
// src/app/api/auth/register-user/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { RegisterUserRequestSchema, type RegisterUserPayload, type AppUser } from '@/lib/types';
import { tradingPlans } from '@/config/tradingPlans';

export async function POST(request: NextRequest) {
  console.log('[API /auth/register-user POST] SERVER: Route handler invoked.');
  let rawPayload: any;
  let validatedPayload: RegisterUserPayload;

  try {
    rawPayload = await request.json();
    const validation = RegisterUserRequestSchema.safeParse(rawPayload);
    if (!validation.success) {
      console.error('[API /auth/register-user POST] SERVER: Invalid payload:', validation.error.flatten());
      return NextResponse.json({ message: 'Invalid user data', errors: validation.error.flatten() }, { status: 400 });
    }
    validatedPayload = validation.data;
    console.log('[API /auth/register-user POST] SERVER: Validated payload received:', validatedPayload);
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
    country_code, // This is now the 2-letter country code
  } = validatedPayload;

  console.log(`[API /auth/register-user POST] SERVER: Processing registration for firebaseAuthUid: ${firebaseAuthUid}, email: ${email}, accountType: ${accountType}, username: ${username}, country_code: ${country_code}`);

  const selectedPlan = tradingPlans.find(plan => plan.value === accountType);
  if (!selectedPlan) {
    console.error(`[API /auth/register-user POST] SERVER: Invalid account type specified: ${accountType}`);
    return NextResponse.json({ message: `Invalid account type: ${accountType}` }, { status: 400 });
  }
  const tradingPlanId = selectedPlan.id;
  console.log(`[API /auth/register-user POST] SERVER: Mapped accountType '${accountType}' to trading_plan_id: ${tradingPlanId}`);

  try {
    console.log(`[API /auth/register-user POST] SERVER: Attempting to find existing user by firebase_auth_uid: ${firebaseAuthUid}`);
    const existingUserResult = await query('SELECT id FROM users WHERE firebase_auth_uid = $1', [firebaseAuthUid]);
    let userId: string;
    let isNewUser = true;

    if (existingUserResult.rows.length > 0) {
      userId = existingUserResult.rows[0].id;
      isNewUser = false;
      console.log(`[API /auth/register-user POST] SERVER: User ${firebaseAuthUid} exists (ID: ${userId}). Attempting to update profile.`);
      await query(
        `UPDATE users SET 
           username = $1, first_name = $2, last_name = $3, trading_plan_id = $4, 
           phone_number = $5, country_code = $6, profile_completed_at = NOW(), updated_at = NOW()
         WHERE firebase_auth_uid = $7`,
        [username, firstName, lastName, tradingPlanId, phoneNumber, country_code, firebaseAuthUid]
      );
      console.log(`[API /auth/register-user POST] SERVER: Profile updated for existing user ID: ${userId}`);
    } else {
      console.log(`[API /auth/register-user POST] SERVER: New user ${firebaseAuthUid}. Attempting to insert profile.`);
      const newUserResult = await query(
        `INSERT INTO users (firebase_auth_uid, email, username, first_name, last_name, trading_plan_id, phone_number, country_code, profile_completed_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW())
         RETURNING id`,
        [firebaseAuthUid, email, username, firstName, lastName, tradingPlanId, phoneNumber, country_code]
      );
      userId = newUserResult.rows[0].id;
      console.log(`[API /auth/register-user POST] SERVER: New user profile inserted. User ID: ${userId}`);
    }

    if (isNewUser) {
      console.log(`[API /auth/register-user POST] SERVER: Attempting to create default USDT wallet for new user ID: ${userId}`);
      await query(
        'INSERT INTO wallets (user_id, currency, balance) VALUES ($1, $2, $3)',
        [userId, 'USDT', 0.00]
      );
      console.log(`[API /auth/register-user POST] SERVER: Default USDT wallet created for new user ID: ${userId}`);
    }

    console.log(`[API /auth/register-user POST] SERVER: Attempting to fetch complete user profile for firebaseAuthUid: ${firebaseAuthUid}`);
    const completeUserProfileResult = await query<AppUser>(
       `SELECT 
         u.id, u.firebase_auth_uid, u.email, u.username, u.first_name, u.last_name, 
         u.phone_number, u.country_code, u.profile_completed_at, u.pin_setup_completed_at,
         u.is_active, u.is_email_verified, u.created_at, u.updated_at,
         tp.name as account_type 
       FROM users u
       LEFT JOIN trading_plans tp ON u.trading_plan_id = tp.id
       WHERE u.firebase_auth_uid = $1`,
      [firebaseAuthUid]
    );
    
    if (completeUserProfileResult.rows.length === 0) {
      console.error(`[API /auth/register-user POST] SERVER: CRITICAL - Failed to fetch profile AFTER registration/update for ${firebaseAuthUid}.`);
      return NextResponse.json({ message: 'User registered but failed to retrieve final profile details.' }, { status: 500 });
    }

    const appUser = completeUserProfileResult.rows[0];
    console.log(`[API /auth/register-user POST] SERVER: User registration/update successful for ${firebaseAuthUid}. Returning profile:`, appUser);
    return NextResponse.json(appUser, { status: isNewUser ? 201 : 200 });

  } catch (error: any) {
    console.error(`[API /auth/register-user POST] SERVER: CAUGHT ERROR during user registration for firebaseAuthUid: ${firebaseAuthUid}`);
    console.error(`[API /auth/register-user POST] SERVER: Error Message: ${error.message}`);
    if (error.detail) console.error(`[API /auth/register-user POST] SERVER: Error Detail: ${error.detail}`);
    if (error.code) console.error(`[API /auth/register-user POST] SERVER: Error Code: ${error.code}`);
    if (error.constraint) console.error(`[API /auth/register-user POST] SERVER: Error Constraint: ${error.constraint}`);
    if (error.stack) console.error(`[API /auth/register-user POST] SERVER: Error Stack: ${error.stack.substring(0, 500)}...`);
    console.error(`[API /auth/register-user POST] SERVER: Payload causing error:`, JSON.stringify(validatedPayload, null, 2));

    if (error.code === '23505') { 
      let field = 'unknown field';
      if (error.constraint && error.constraint.includes('users_username_key')) field = 'Username';
      else if (error.constraint && error.constraint.includes('users_email_key')) field = 'Email';
      else if (error.constraint && error.constraint.includes('users_firebase_auth_uid_key')) field = 'Firebase UID (should not happen if logic is correct)';
      
      console.warn(`[API /auth/register-user POST] SERVER: Unique constraint violation for ${field}. Constraint: ${error.constraint}`);
      return NextResponse.json({ message: `${field} may already be taken.` , detail: error.detail }, { status: 409 });
    }
    
    return NextResponse.json({ message: 'Internal server error during registration', detail: error.message }, { status: 500 });
  }
}
