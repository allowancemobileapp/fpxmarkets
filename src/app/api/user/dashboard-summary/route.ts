
// src/app/api/user/dashboard-summary/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import type { AppUser } from '@/lib/types';

interface DashboardSummary {
  totalAssets: number;          // Represents current_wallet_main_balance + current_wallet_profit_loss_balance
  totalProfitLoss: number;      // Represents current_wallet_profit_loss_balance
  totalDeposited: number;       // Mocked: Would be SUM of all historical deposits
  totalWithdrawals: number;     // Mocked: Would be SUM of all historical withdrawals
  pendingDeposits: number;      // Mocked
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

    // Mocked values for fields requiring transaction aggregation from a transactions table
    // In a real system, these would be calculated by SUMming relevant transaction records.
    const totalDeposited = 0; 
    const totalWithdrawals = 0; 
    const pendingDeposits = 0; 
    console.log(`[API /user/dashboard-summary GET] SERVER: NOTE - totalDeposited and totalWithdrawals are currently mocked as 0. A transaction history system is required for accurate values.`);


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
