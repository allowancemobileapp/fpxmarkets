
// src/app/api/user/transactions/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

interface ApiTransaction {
  id: string;
  created_at: string; // ISO date string
  transaction_type: string; // e.g., 'DEPOSIT', 'TRADE_BUY'
  asset_name: string; // e.g., 'BTC', 'ETH/USD', 'StrategyX PNL'
  amount_crypto: string | null; // String because numeric type might lose precision, or null
  amount_usd_equivalent: string; // String
  status: string; // e.g., 'COMPLETED', 'PENDING'
  description: string | null;
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

    // MODIFIED QUERY: Removed LEFT JOIN to 'assets' table and reference to a.symbol
    const transactionsQuery = `
      SELECT
        t.id,
        t.created_at,
        t.transaction_type,
        COALESCE(tp.symbol, t.description, 'N/A') as asset_name, -- a.symbol removed
        CAST(t.amount_crypto AS TEXT) as amount_crypto,
        CAST(t.amount_usd_equivalent AS TEXT) as amount_usd_equivalent,
        t.status,
        t.description
      FROM
        transactions t
      LEFT JOIN
        trading_pairs tp ON t.pair_id = tp.id
      WHERE
        t.user_id = $1
      ORDER BY
        t.created_at DESC;
    `;
    
    const transactionsResult = await query<ApiTransaction>(transactionsQuery, [userId]);
    
    const formattedTransactions = transactionsResult.rows.map(txn => ({
        ...txn,
        amount_crypto: txn.amount_crypto !== null ? String(txn.amount_crypto) : null,
        amount_usd_equivalent: String(txn.amount_usd_equivalent),
    }));

    console.log(`[API /user/transactions GET] SERVER: Returning ${formattedTransactions.length} transactions for user ID ${userId}.`);
    return NextResponse.json(formattedTransactions);

  } catch (error: any) {
    console.error(`[API /user/transactions GET] SERVER: Error fetching transactions for ${firebaseAuthUid}:`, error);
    if (error.stack) console.error(`[API /user/transactions GET] SERVER: Error stack: ${error.stack}`);
    // Send back a more structured error, including the actual DB error message if possible
    const dbErrorMessage = error.message || 'Unknown database error';
    return NextResponse.json({ message: 'Internal server error while fetching transactions', detail: dbErrorMessage }, { status: 500 });
  }
}
