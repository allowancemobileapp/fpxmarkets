
// src/app/api/auth/setup-pin/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { SetupPinRequestSchema, type SetupPinPayload, type AppUser } from '@/lib/types';
import bcrypt from 'bcryptjs';

export async function POST(request: NextRequest) {
  console.log('[API /auth/setup-pin POST] SERVER: Route handler invoked.');
  let payload: SetupPinPayload;

  try {
    const rawPayload = await request.json();
    const validation = SetupPinRequestSchema.safeParse(rawPayload);
    if (!validation.success) {
      console.error('[API /auth/setup-pin POST] SERVER: Invalid payload:', validation.error.flatten());
      return NextResponse.json({ message: 'Invalid PIN data', errors: validation.error.flatten() }, { status: 400 });
    }
    payload = validation.data;
    console.log('[API /auth/setup-pin POST] SERVER: Validated payload received:', payload);
  } catch (error) {
    console.error('[API /auth/setup-pin POST] SERVER: Invalid JSON payload:', error);
    return NextResponse.json({ message: 'Invalid JSON payload' }, { status: 400 });
  }

  const { firebaseAuthUid, pin } = payload;
  console.log(`[API /auth/setup-pin POST] SERVER: Setting up PIN for firebaseAuthUid: ${firebaseAuthUid}`);

  try {
    console.log(`[API /auth/setup-pin POST] SERVER: Hashing PIN for firebaseAuthUid: ${firebaseAuthUid}`);
    const salt = await bcrypt.genSalt(10);
    const pinHashToStore = await bcrypt.hash(pin, salt);
    console.log(`[API /auth/setup-pin POST] SERVER: PIN hashed successfully for ${firebaseAuthUid}.`);
    
    // UPDATED to use admin_pin based on provided schema.
    // If a different column like 'pin_hash' is intended for user trading PIN,
    // ensure that column exists in the 'users' table.
    const updateQuery = `
      UPDATE users 
      SET admin_pin = $1, pin_setup_completed_at = NOW(), updated_at = NOW()
      WHERE firebase_auth_uid = $2
      RETURNING id`;
      
    console.log(`[API /auth/setup-pin POST] SERVER: Attempting to update user's PIN in DB for ${firebaseAuthUid}. Query: ${updateQuery.substring(0,100)}...`);
    const result = await query(updateQuery, [pinHashToStore, firebaseAuthUid]);

    if (result.rows.length === 0) {
      console.log(`[API /auth/setup-pin POST] SERVER: User not found for PIN setup, firebaseAuthUid: ${firebaseAuthUid}`);
      return NextResponse.json({ message: 'User not found for PIN setup' }, { status: 404 });
    }
    const userId = result.rows[0].id;
    console.log(`[API /auth/setup-pin POST] SERVER: User record updated. User ID: ${userId}. Pin setup timestamp marked.`);
    
    // Fetch the complete user profile to return
    console.log(`[API /auth/setup-pin POST] SERVER: Attempting to fetch complete user profile for ${firebaseAuthUid}.`);
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
      console.error(`[API /auth/setup-pin POST] SERVER: CRITICAL - Failed to fetch profile AFTER PIN setup for ${firebaseAuthUid}.`);
      return NextResponse.json({ message: 'PIN set but failed to fetch profile details' }, { status: 500 });
    }

    const appUser = completeUserProfileResult.rows[0];
    console.log(`[API /auth/setup-pin POST] SERVER: PIN setup successful for ${firebaseAuthUid}. Returning profile:`, appUser);
    return NextResponse.json(appUser, { status: 200 });

  } catch (error: any) {
    console.error(`[API /auth/setup-pin POST] SERVER: CAUGHT ERROR during PIN setup for ${firebaseAuthUid}`);
    console.error(`[API /auth/setup-pin POST] SERVER: Error Message: ${error.message}`);
    if (error.detail) console.error(`[API /auth/setup-pin POST] SERVER: Error Detail: ${error.detail}`);
    if (error.code) console.error(`[API /auth/setup-pin POST] SERVER: Error Code: ${error.code}`);
    if (error.constraint) console.error(`[API /auth/setup-pin POST] SERVER: Error Constraint: ${error.constraint}`);
    if (error.stack) console.error(`[API /auth/setup-pin POST] SERVER: Error Stack: ${error.stack.substring(0, 500)}...`);
    console.error(`[API /auth/setup-pin POST] SERVER: Payload causing error:`, JSON.stringify(payload, null, 2));
    
    return NextResponse.json({ message: 'Internal server error during PIN setup', detail: error.message }, { status: 500 });
  }
}
