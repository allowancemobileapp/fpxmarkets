
// src/app/api/user/profile/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import type { AppUser, UpdateProfilePayload } from '@/lib/types';

// GET request to fetch user profile
export async function GET(request: NextRequest) {
  console.log('[API /user/profile GET] SERVER: Route handler invoked.');
  const searchParams = request.nextUrl.searchParams;
  const firebaseAuthUid = searchParams.get('firebaseAuthUid');

  if (!firebaseAuthUid) {
    console.log('[API /user/profile GET] SERVER: Missing firebaseAuthUid query parameter.');
    return NextResponse.json({ message: 'Firebase Auth UID is required' }, { status: 400 });
  }
  console.log(`[API /user/profile GET] SERVER: Attempting to fetch profile for firebaseAuthUid: ${firebaseAuthUid}`);

  try {
    const userResult = await query<AppUser>(
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

    if (userResult.rows.length === 0) {
      console.log(`[API /user/profile GET] SERVER: User not found for firebaseAuthUid: ${firebaseAuthUid}`);
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    const userProfile = userResult.rows[0];
    console.log(`[API /user/profile GET] SERVER: Profile found for ${firebaseAuthUid}:`, userProfile);
    return NextResponse.json(userProfile);

  } catch (error) {
    console.error(`[API /user/profile GET] SERVER: Error fetching user profile for ${firebaseAuthUid}:`, error);
    return NextResponse.json({ message: 'Internal server error while fetching profile' }, { status: 500 });
  }
}

// PUT request to update user profile (example, might not be used in initial auth flow)
export async function PUT(request: NextRequest) {
  console.log('[API /user/profile PUT] SERVER: Route handler invoked.');
  
  let payload: UpdateProfilePayload;
  try {
    payload = await request.json();
  } catch (error) {
    console.error('[API /user/profile PUT] SERVER: Invalid JSON payload:', error);
    return NextResponse.json({ message: 'Invalid JSON payload' }, { status: 400 });
  }

  const { firebaseAuthUid, firstName, lastName, username, phoneNumber, country } = payload;

  if (!firebaseAuthUid) {
    console.log('[API /user/profile PUT] SERVER: Missing firebaseAuthUid in payload.');
    return NextResponse.json({ message: 'Firebase Auth UID is required' }, { status: 400 });
  }
  console.log(`[API /user/profile PUT] SERVER: Attempting to update profile for firebaseAuthUid: ${firebaseAuthUid} with data:`, { firstName, lastName, username, phoneNumber, country });

  try {
    // Construct dynamic query based on provided fields
    const fieldsToUpdate: string[] = [];
    const values: any[] = [];
    let queryIndex = 1;

    if (firstName !== undefined) { fieldsToUpdate.push(`first_name = $${queryIndex++}`); values.push(firstName); }
    if (lastName !== undefined) { fieldsToUpdate.push(`last_name = $${queryIndex++}`); values.push(lastName); }
    if (username !== undefined) { fieldsToUpdate.push(`username = $${queryIndex++}`); values.push(username); }
    if (phoneNumber !== undefined) { fieldsToUpdate.push(`phone_number = $${queryIndex++}`); values.push(phoneNumber); }
    if (country !== undefined) { fieldsToUpdate.push(`country = $${queryIndex++}`); values.push(country); }
    
    if (fieldsToUpdate.length === 0) {
      return NextResponse.json({ message: 'No fields to update provided' }, { status: 400 });
    }
    
    fieldsToUpdate.push(`updated_at = NOW()`);
    values.push(firebaseAuthUid);

    const updateQueryText = `UPDATE users SET ${fieldsToUpdate.join(', ')} WHERE firebase_auth_uid = $${queryIndex} RETURNING *`;
    
    const result = await query<AppUser>(updateQueryText, values);

    if (result.rows.length === 0) {
      console.log(`[API /user/profile PUT] SERVER: User not found for update, firebaseAuthUid: ${firebaseAuthUid}`);
      return NextResponse.json({ message: 'User not found for update' }, { status: 404 });
    }
    
    // Fetch the updated profile with account_type name
    const updatedProfileResult = await query<AppUser>(
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

    if (updatedProfileResult.rows.length === 0) {
         console.error(`[API /user/profile PUT] SERVER: Failed to fetch profile after update for ${firebaseAuthUid}`);
        return NextResponse.json({ message: 'Profile updated, but failed to fetch updated details' }, { status: 500 });
    }

    const updatedUser = updatedProfileResult.rows[0];
    console.log(`[API /user/profile PUT] SERVER: Profile updated successfully for ${firebaseAuthUid}:`, updatedUser);
    return NextResponse.json(updatedUser);

  } catch (error: any) {
    if (error.code === '23505') { // Unique constraint violation
      console.error(`[API /user/profile PUT] SERVER: Unique constraint violation (e.g., username already exists) for ${firebaseAuthUid}:`, error.detail);
      return NextResponse.json({ message: 'Update failed. Username or other unique field may already be taken.', detail: error.detail }, { status: 409 });
    }
    console.error(`[API /user/profile PUT] SERVER: Error updating user profile for ${firebaseAuthUid}:`, error);
    return NextResponse.json({ message: 'Internal server error while updating profile' }, { status: 500 });
  }
}
