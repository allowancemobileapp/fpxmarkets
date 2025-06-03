
// src/app/api/user/dashboard-summary/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import type { AppUser } from '@/lib/types';

interface DashboardSummary {
  totalAssets: number;          // Represents current_wallet_main_balance + current_wallet_profit_loss_balance
  totalProfitLoss: number;      // Represents current_wallet_profit_loss_balance
  totalDeposited: number;       // SUM of all 'COMPLETED' 'DEPOSIT' transactions
  totalWithdrawals: number;     // SUM of all 'COMPLETED' 'WITHDRAWAL' transactions
  pendingDeposits: number;      // SUM of all 'PENDING' 'DEPOSIT' transactions
}

export async function GET(request: NextRequest) {
  console.log('[API /user/dashboard-summary GET] SERVER: Route handler invoked.');
  const searchParams = request.nextUrl.searchParams;
  const firebaseAuthUid = searchParams.get('firebaseAuthUid');

  if (!firebaseAuthUid) {
    console.log('[API /user/dashboard-summary GET] SERVER: Missing firebaseAuthUid query parameter.');
    return NextResponse.json({ message: 'Firebase Auth UID is required' }, { status: 400 });
  }
  console.log(`[API /user/dashboard-summary GET] SERVER: Attempting to fetch dashboard summary for firebaseAuthUid: ${firebaseAuthUid}`);

  try {
    const userResult = await query<{ id: string }>(
      `SELECT id FROM users WHERE firebase_auth_uid = $1`,
      [firebaseAuthUid]
    );

    if (userResult.rows.length === 0) {
      console.log(`[API /user/dashboard-summary GET] SERVER: User not found for firebaseAuthUid: ${firebaseAuthUid}`);
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }
    const userId = userResult.rows[0].id;
    console.log(`[API /user/dashboard-summary GET] SERVER: Found user ID: ${userId} for firebaseAuthUid: ${firebaseAuthUid}`);

    // Fetch wallet balance
    const walletResult = await query<{ balance: string; profit_loss_balance: string }>(
      `SELECT balance, profit_loss_balance FROM wallets WHERE user_id = $1 AND currency = 'USDT'`,
      [userId]
    );

    let currentWalletBalance = 0;
    let currentProfitLoss = 0;

    if (walletResult.rows.length > 0) {
      currentWalletBalance = parseFloat(walletResult.rows[0].balance) || 0;
      currentProfitLoss = parseFloat(walletResult.rows[0].profit_loss_balance) || 0;
      console.log(`[API /user/dashboard-summary GET] SERVER: Wallet found for user ID ${userId}. Main Balance: ${currentWalletBalance}, P/L Balance: ${currentProfitLoss}`);
    } else {
      console.log(`[API /user/dashboard-summary GET] SERVER: No USDT wallet found for user ID: ${userId}. Defaulting balances to 0.`);
    }

    const calculatedTotalAssets = currentWalletBalance + currentProfitLoss;

    // Fetch transaction aggregates using the correct column name 'transaction_type'
    const transactionsAggregateQuery = `
      SELECT 
        COALESCE(SUM(CASE WHEN transaction_type = 'DEPOSIT' AND status = 'COMPLETED' THEN amount_usd_equivalent ELSE 0 END), 0) as total_deposited,
        COALESCE(SUM(CASE WHEN transaction_type = 'WITHDRAWAL' AND status = 'COMPLETED' THEN amount_usd_equivalent ELSE 0 END), 0) as total_withdrawn,
        COALESCE(SUM(CASE WHEN transaction_type = 'DEPOSIT' AND status = 'PENDING' THEN amount_usd_equivalent ELSE 0 END), 0) as pending_deposits
      FROM transactions
      WHERE user_id = $1;
    `;
    
    let totalDeposited = 0;
    let totalWithdrawals = 0;
    let pendingDeposits = 0;

    try {
        const aggResult = await query(transactionsAggregateQuery, [userId]);
        if (aggResult.rows.length > 0) {
            totalDeposited = parseFloat(aggResult.rows[0].total_deposited) || 0;
            totalWithdrawals = parseFloat(aggResult.rows[0].total_withdrawn) || 0;
            pendingDeposits = parseFloat(aggResult.rows[0].pending_deposits) || 0;
            console.log(`[API /user/dashboard-summary GET] SERVER: Transaction aggregates for user ID ${userId}: Deposited: ${totalDeposited}, Withdrawn: ${totalWithdrawals}, Pending Deposits: ${pendingDeposits}`);
        } else {
            console.log(`[API /user/dashboard-summary GET] SERVER: No transaction records found for user ID ${userId}. Totals will be 0.`);
        }
    } catch (dbError: any) {
        // Check if the error is because the transactions table doesn't exist (common error code for undefined table is '42P01')
        // This check might be less relevant now that we know the table exists, but good for robustness.
        if (dbError.code === '42P01') {
            console.warn(`[API /user/dashboard-summary GET] SERVER: The 'transactions' table might not exist or is inaccessible. totalDeposited, totalWithdrawals, and pendingDeposits will be 0. Error: ${dbError.message}`);
        } else {
            console.error(`[API /user/dashboard-summary GET] SERVER: Error fetching transaction aggregates for user ID ${userId}:`, dbError.message);
        }
        // Defaults are already 0, so no need to set them again here
    }


    const summary: DashboardSummary = {
      totalAssets: calculatedTotalAssets,
      totalProfitLoss: currentProfitLoss,
      totalDeposited,
      totalWithdrawals,
      pendingDeposits,
    };

    console.log(`[API /user/dashboard-summary GET] SERVER: Returning summary for ${firebaseAuthUid}:`, summary);
    return NextResponse.json(summary);

  } catch (error: any) {
    console.error(`[API /user/dashboard-summary GET] SERVER: Error fetching dashboard summary for ${firebaseAuthUid}:`, error);
    if (error.stack) console.error(`[API /user/dashboard-summary GET] SERVER: Error stack: ${error.stack}`);
    return NextResponse.json({ message: 'Internal server error while fetching dashboard summary', detail: error.message }, { status: 500 });
  }
}

