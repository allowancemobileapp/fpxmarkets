
// src/app/api/user/transactions/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

interface ApiTransaction {
  id: string;
  created_at: string; // ISO date string
  transaction_type: string; // e.g., 'DEPOSIT', 'TRADE_BUY'
  asset_name: string; // e.g., 'BTC', 'ETH', 'USDT' (from transactions.asset_code)
  amount_crypto: string | null; // String because numeric type might lose precision, or null (from transactions.amount_asset)
  amount_usd_equivalent: string; // String
  status: string; // e.g., 'COMPLETED', 'PENDING'
  description: string | null; // from transactions.notes
}

export async function GET(request: NextRequest) {
  console.log('[API /user/transactions GET] SERVER: Route handler invoked.');
  const searchParams = request.nextUrl.searchParams;
  const firebaseAuthUid = searchParams.get('firebaseAuthUid');

  if (!firebaseAuthUid) {
    console.log('[API /user/transactions GET] SERVER: Missing firebaseAuthUid query parameter.');
    return NextResponse.json({ message: 'Firebase Auth UID is required' }, { status: 400 });
  }
  console.log(`[API /user/transactions GET] SERVER: Attempting to fetch transactions for firebaseAuthUid: ${firebaseAuthUid}`);

  try {
    const userResult = await query<{ id: string }>(
      `SELECT id FROM users WHERE firebase_auth_uid = $1`,
      [firebaseAuthUid]
    );

    if (userResult.rows.length === 0) {
      console.log(`[API /user/transactions GET] SERVER: User not found for firebaseAuthUid: ${firebaseAuthUid}`);
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }
    const userId = userResult.rows[0].id;
    console.log(`[API /user/transactions GET] SERVER: Found user ID: ${userId} for firebaseAuthUid: ${firebaseAuthUid}`);

    // Updated query based on the provided schema
    const transactionsQuery = `
      SELECT
        t.id,
        t.created_at,
        t.transaction_type,
        t.asset_code as asset_name, -- Use asset_code for asset_name
        CAST(t.amount_asset AS TEXT) as amount_crypto, -- Use amount_asset for amount_crypto
        CAST(t.amount_usd_equivalent AS TEXT) as amount_usd_equivalent,
        t.status,
        t.notes as description -- Use notes for description
      FROM
        transactions t
      WHERE
        t.user_id = $1
      ORDER BY
        t.created_at DESC;
    `;
    
    const transactionsResult = await query<ApiTransaction>(transactionsQuery, [userId]);
    
    // Ensure fields are strings as expected by the frontend interface
    const formattedTransactions = transactionsResult.rows.map(txn => ({
        ...txn,
        amount_crypto: txn.amount_crypto !== null ? String(txn.amount_crypto) : null,
        amount_usd_equivalent: String(txn.amount_usd_equivalent),
        // created_at is already a string from the DB or cast
        // description can be null, so String(null) would be "null", handle carefully if needed or let it be null
        description: txn.description !== null ? String(txn.description) : null,
    }));

    console.log(`[API /user/transactions GET] SERVER: Returning ${formattedTransactions.length} transactions for user ID ${userId}.`);
    return NextResponse.json(formattedTransactions);

  } catch (error: any) {
    console.error(`[API /user/transactions GET] SERVER: Error fetching transactions for ${firebaseAuthUid}:`, error);
    if (error.stack) console.error(`[API /user/transactions GET] SERVER: Error stack: ${error.stack}`);
    const dbErrorMessage = error.message || 'Unknown database error';
    return NextResponse.json({ message: 'Internal server error while fetching transactions', detail: dbErrorMessage }, { status: 500 });
  }
}
