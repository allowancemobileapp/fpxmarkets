// src/app/api/user/copy-traders/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { z } from 'zod';

// Helper to get user ID from Firebase UID
async function getUserId(firebaseAuthUid: string): Promise<string | null> {
  const userResult = await query<{ id: string }>(
    `SELECT id FROM users WHERE firebase_auth_uid = $1`,
    [firebaseAuthUid]
  );
  if (userResult.rows.length === 0) {
    return null;
  }
  return userResult.rows[0].id;
}

// GET: Fetch all copied trader IDs for a user
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const firebaseAuthUid = searchParams.get('firebaseAuthUid');

  if (!firebaseAuthUid) {
    return NextResponse.json({ message: 'Firebase Auth UID is required' }, { status: 400 });
  }

  try {
    const userId = await getUserId(firebaseAuthUid);
    if (!userId) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    const result = await query<{ trader_id: string }>(
      'SELECT trader_id FROM user_copied_traders WHERE user_id = $1',
      [userId]
    );

    const traderIds = result.rows.map(row => row.trader_id);
    return NextResponse.json({ traderIds });

  } catch (error: any) {
    console.error('[API /user/copy-traders GET] Error:', error);
    return NextResponse.json({ message: 'Internal server error', detail: error.message }, { status: 500 });
  }
}

// POST: Add a trader to the user's copied list
const PostPayloadSchema = z.object({
  firebaseAuthUid: z.string(),
  traderId: z.string(),
});

export async function POST(request: NextRequest) {
  let payload;
  try {
    payload = PostPayloadSchema.parse(await request.json());
  } catch (error) {
    return NextResponse.json({ message: 'Invalid payload', errors: (error as z.ZodError).flatten() }, { status: 400 });
  }
  
  const { firebaseAuthUid, traderId } = payload;

  try {
    const userId = await getUserId(firebaseAuthUid);
    if (!userId) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    await query(
      'INSERT INTO user_copied_traders (user_id, trader_id) VALUES ($1, $2) ON CONFLICT (user_id, trader_id) DO NOTHING',
      [userId, traderId]
    );

    return NextResponse.json({ success: true, message: `Started copying trader ${traderId}` });

  } catch (error: any) {
    console.error('[API /user/copy-traders POST] Error:', error);
    return NextResponse.json({ message: 'Internal server error', detail: error.message }, { status: 500 });
  }
}


// DELETE: Remove a trader from the user's copied list
const DeletePayloadSchema = z.object({
  firebaseAuthUid: z.string(),
  traderId: z.string(),
});
export async function DELETE(request: NextRequest) {
  let payload;
   try {
    payload = DeletePayloadSchema.parse(await request.json());
  } catch (error) {
    return NextResponse.json({ message: 'Invalid payload', errors: (error as z.ZodError).flatten() }, { status: 400 });
  }
  
  const { firebaseAuthUid, traderId } = payload;
  
  try {
    const userId = await getUserId(firebaseAuthUid);
    if (!userId) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    const result = await query(
      'DELETE FROM user_copied_traders WHERE user_id = $1 AND trader_id = $2',
      [userId, traderId]
    );

    if (result.rowCount === 0) {
      // Not necessarily an error, maybe they already unfollowed.
      return NextResponse.json({ success: true, message: `Trader ${traderId} was not being copied.` });
    }

    return NextResponse.json({ success: true, message: `Stopped copying trader ${traderId}` });

  } catch (error: any) {
    console.error('[API /user/copy-traders DELETE] Error:', error);
    return NextResponse.json({ message: 'Internal server error', detail: error.message }, { status: 500 });
  }
}
