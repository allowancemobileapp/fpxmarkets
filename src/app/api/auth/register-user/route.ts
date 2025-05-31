
// src/app/api/auth/register-user/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { RegisterUserRequestSchema, type RegisterUserPayload, type AppUser, type AccountType } from '@/lib/types';
import { tradingPlans } from '@/config/tradingPlans'; // To map accountType name to ID

export async function POST(request: NextRequest) {
  console.log('[API /auth/register-user POST] SERVER: Route handler invoked.');
  let payload: RegisterUserPayload;

  try {
    payload = await request.json();
    const validation = RegisterUserRequestSchema.safeParse(payload);
    if (!validation.success) {
      console.log('[API /auth/register-user POST] SERVER: Invalid payload:', validation.error.flatten());
      return NextResponse.json({ message: 'Invalid user data', errors: validation.error.flatten() }, { status: 400 });
    }
    payload = validation.data; // Use validated data
  } catch (error) {
    console.error('[API /auth/register-user POST] SERVER: Invalid JSON payload:', error);
    return NextResponse.json({ message: 'Invalid JSON payload' }, { status: 400 });
  }

  const {
    firebaseAuthUid,
    email,
    username,
    firstName,
    lastName,
    accountType, // This is the plan name like 'Beginner'
    phoneNumber,
    country,
  } = payload;

  console.log(`[API /auth/register-user POST] SERVER: Processing registration for firebaseAuthUid: ${firebaseAuthUid}, email: ${email}, accountType: ${accountType}`);

  const selectedPlan = tradingPlans.find(plan => plan.value === accountType);
  if (!selectedPlan) {
    console.log(`[API /auth/register-user POST] SERVER: Invalid account type specified: ${accountType}`);
    return NextResponse.json({ message: `Invalid account type: ${accountType}` }, { status: 400 });
  }
  const tradingPlanId = selectedPlan.id; // Assumes 'id' field in tradingPlans config

  try {
    // Check if user already exists by firebase_auth_uid
    const existingUserResult = await query('SELECT id FROM users WHERE firebase_auth_uid = $1', [firebaseAuthUid]);
    let userId: string;
    let isNewUser = true;

    if (existingUserResult.rows.length > 0) {
      // User exists, update their profile
      userId = existingUserResult.rows[0].id;
      isNewUser = false;
      console.log(`[API /auth/register-user POST] SERVER: User ${firebaseAuthUid} exists (ID: ${userId}). Updating profile.`);
      await query(
        `UPDATE users SET 
           username = $1, first_name = $2, last_name = $3, trading_plan_id = $4, 
           phone_number = $5, country = $6, profile_completed_at = NOW(), updated_at = NOW()
         WHERE firebase_auth_uid = $7`,
        [username, firstName, lastName, tradingPlanId, phoneNumber, country, firebaseAuthUid]
      );
    } else {
      // New user, insert their profile
      console.log(`[API /auth/register-user POST] SERVER: New user ${firebaseAuthUid}. Inserting profile.`);
      const newUserResult = await query(
        `INSERT INTO users (firebase_auth_uid, email, username, first_name, last_name, trading_plan_id, phone_number, country, profile_completed_at, account_type_name)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW(), $9)
         RETURNING id`,
        [firebaseAuthUid, email, username, firstName, lastName, tradingPlanId, phoneNumber, country, accountType]
      );
      userId = newUserResult.rows[0].id;
    }

    // Create a default USDT wallet if it's a truly new user
    if (isNewUser) {
      const walletTypeResult = await query('SELECT id FROM wallet_types WHERE currency_code = $1', ['USDT']);
      if (walletTypeResult.rows.length > 0) {
        const walletTypeId = walletTypeResult.rows[0].id;
        await query(
          'INSERT INTO wallets (user_id, wallet_type_id, balance) VALUES ($1, $2, $3)',
          [userId, walletTypeId, 0.00]
        );
        console.log(`[API /auth/register-user POST] SERVER: Default USDT wallet created for new user ID: ${userId}`);
      } else {
        console.warn('[API /auth/register-user POST] SERVER: USDT wallet type not found. Default wallet not created.');
      }
    }

    // Fetch the complete user profile to return
    const completeUserProfileResult = await query<AppUser>(
       `SELECT 
         u.id, u.firebase_auth_uid, u.email, u.username, u.first_name, u.last_name, 
         u.phone_number, u.country, u.profile_completed_at, u.pin_setup_completed_at,
         u.created_at, u.updated_at,
         tp.name as account_type 
       FROM users u
       LEFT JOIN trading_plans tp ON u.trading_plan_id = tp.id
       WHERE u.firebase_auth_uid = $1`,
      [firebaseAuthUid]
    );
    
    if (completeUserProfileResult.rows.length === 0) {
      console.error(`[API /auth/register-user POST] SERVER: Failed to fetch profile after registration for ${firebaseAuthUid}`);
      return NextResponse.json({ message: 'User registered but failed to fetch profile details' }, { status: 500 });
    }

    const appUser = completeUserProfileResult.rows[0];
    console.log(`[API /auth/register-user POST] SERVER: User registration/update successful for ${firebaseAuthUid}. Returning profile:`, appUser);
    return NextResponse.json(appUser, { status: 201 });

  } catch (error: any) {
    if (error.code === '23505') { // Unique constraint violation (e.g., username or email if unique in DB)
      console.error(`[API /auth/register-user POST] SERVER: Unique constraint violation for ${firebaseAuthUid}:`, error.detail);
      return NextResponse.json({ message: 'Registration failed. Username or email may already be taken.', detail: error.detail }, { status: 409 });
    }
    console.error(`[API /auth/register-user POST] SERVER: Error during user registration for ${firebaseAuthUid}:`, error);
    return NextResponse.json({ message: 'Internal server error during registration' }, { status: 500 });
  }
}
