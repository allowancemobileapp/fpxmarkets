
// src/app/api/auth/setup-pin/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { SetupPinRequestSchema, type SetupPinPayload, type AppUser } from '@/lib/types';
import bcrypt from 'bcryptjs';

export async function POST(request: NextRequest) {
  console.log('[API /auth/setup-pin POST] SERVER: Route handler invoked.');
  let payload: SetupPinPayload;

  try {
    payload = await request.json();
    const validation = SetupPinRequestSchema.safeParse(payload);
    if (!validation.success) {
      console.log('[API /auth/setup-pin POST] SERVER: Invalid payload:', validation.error.flatten());
      return NextResponse.json({ message: 'Invalid PIN data', errors: validation.error.flatten() }, { status: 400 });
    }
    payload = validation.data;
  } catch (error) {
    console.error('[API /auth/setup-pin POST] SERVER: Invalid JSON payload:', error);
    return NextResponse.json({ message: 'Invalid JSON payload' }, { status: 400 });
  }

  const { firebaseAuthUid, pin } = payload;
  console.log(`[API /auth/setup-pin POST] SERVER: Setting up PIN for firebaseAuthUid: ${firebaseAuthUid}`);

  try {
    // In a real app, you'd hash the PIN
    const salt = await bcrypt.genSalt(10);
    const pinHash = await bcrypt.hash(pin, salt);
    
    // For this simplified version, we'll just mark pin_setup_completed_at
    // and store the hash. Actual PIN verification during transactions would be needed later.
    const result = await query(
      `UPDATE users 
       SET pin_hash = $1, pin_setup_completed_at = NOW(), updated_at = NOW()
       WHERE firebase_auth_uid = $2
       RETURNING id`, // Return id to confirm update
      [pinHash, firebaseAuthUid]
    );

    if (result.rows.length === 0) {
      console.log(`[API /auth/setup-pin POST] SERVER: User not found for PIN setup, firebaseAuthUid: ${firebaseAuthUid}`);
      return NextResponse.json({ message: 'User not found for PIN setup' }, { status: 404 });
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
      console.error(`[API /auth/setup-pin POST] SERVER: Failed to fetch profile after PIN setup for ${firebaseAuthUid}`);
      return NextResponse.json({ message: 'PIN set but failed to fetch profile details' }, { status: 500 });
    }

    const appUser = completeUserProfileResult.rows[0];
    console.log(`[API /auth/setup-pin POST] SERVER: PIN setup successful for ${firebaseAuthUid}. Returning profile:`, appUser);
    return NextResponse.json(appUser, { status: 200 });

  } catch (error) {
    console.error(`[API /auth/setup-pin POST] SERVER: Error setting up PIN for ${firebaseAuthUid}:`, error);
    return NextResponse.json({ message: 'Internal server error during PIN setup' }, { status: 500 });
  }
}
