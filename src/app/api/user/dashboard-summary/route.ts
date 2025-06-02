
// src/app/api/user/dashboard-summary/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import type { AppUser } from '@/lib/types'; // Assuming AppUser has firebase_auth_uid

interface DashboardSummary {
  totalAssets: number;
  totalProfitLoss: number;
  totalDeposited: number; // Mocked for now
  pendingDeposits: number; // Mocked for now
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
    // 1. Get user's PostgreSQL ID
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

    // 2. Get wallet information
    const walletResult = await query<{ balance: string; profit_loss_balance: string }>( // Balances are NUMERIC, come as string
      `SELECT balance, profit_loss_balance FROM wallets WHERE user_id = $1 AND currency = 'USDT'`, // Assuming primary wallet is USDT
      [userId]
    );

    let totalAssets = 0;
    let totalProfitLoss = 0;

    if (walletResult.rows.length > 0) {
      totalAssets = parseFloat(walletResult.rows[0].balance) || 0;
      totalProfitLoss = parseFloat(walletResult.rows[0].profit_loss_balance) || 0;
      console.log(`[API /user/dashboard-summary GET] SERVER: Wallet found for user ID ${userId}. Assets: ${totalAssets}, P/L: ${totalProfitLoss}`);
    } else {
      console.log(`[API /user/dashboard-summary GET] SERVER: No USDT wallet found for user ID: ${userId}. Defaulting assets/P&L to 0.`);
    }

    // Mocked values for now
    const totalDeposited = 0; // TODO: Calculate from transactions
    const pendingDeposits = 0; // TODO: Implement logic for pending deposits

    const summary: DashboardSummary = {
      totalAssets,
      totalProfitLoss,
      totalDeposited,
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
