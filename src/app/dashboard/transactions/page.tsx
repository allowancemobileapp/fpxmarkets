
'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { History, ArrowUpCircle, ArrowDownCircle, Repeat, Download, Filter, Loader2, AlertTriangle, DollarSign, Briefcase } from 'lucide-react';
import { format } from 'date-fns';

interface Transaction {
  id: string;
  created_at: string;
  transaction_type: string;
  asset_name: string;
  amount_crypto: string | null;
  amount_usd_equivalent: string;
  status: string;
  description: string | null;
}

const formatTransactionType = (type: string): string => {
  if (!type) return 'N/A';
  return type
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};

const getTransactionIcon = (type: string, status: string, amountUsd?: string | number): React.ReactNode => {
  const normalizedType = type?.toUpperCase() || 'UNKNOWN';
  const normalizedStatus = status?.toUpperCase() || 'UNKNOWN';
  const usdValue = typeof amountUsd === 'string' ? parseFloat(amountUsd) : amountUsd;


  if (normalizedType.includes('DEPOSIT')) {
    if (normalizedStatus === 'FAILED') return <ArrowDownCircle className="text-red-500" />;
    if (normalizedStatus === 'PENDING') return <ArrowDownCircle className="text-yellow-500" />;
    return <ArrowDownCircle className="text-positive" />;
  }
  if (normalizedType.includes('WITHDRAWAL')) {
    if (normalizedStatus === 'FAILED') return <ArrowUpCircle className="text-red-500" />;
    if (normalizedStatus === 'PENDING') return <ArrowUpCircle className="text-yellow-500" />;
    return <ArrowUpCircle className="text-blue-500" />;
  }
  if (normalizedType.includes('TRADE_BUY') || normalizedType.includes('TRADE_SELL')) {
    return <Repeat className="text-blue-500" />;
  }
  if (normalizedType.includes('COPY_TRADE_PNL')) {
    if (usdValue && usdValue > 0) return <Repeat className="text-positive" />;
    if (usdValue && usdValue < 0) return <Repeat className="text-destructive" />;
    return <Repeat className="text-muted-foreground" />;
  }
   if (normalizedType.includes('COPY_TRADE_FEE') || normalizedType.includes('FEE')) {
      return <DollarSign className="text-orange-500" />;
  }
  if (normalizedType.includes('PNL_ADJUSTMENT')) {
    if (usdValue && usdValue > 0) return <Briefcase className="text-positive" />;
    if (usdValue && usdValue < 0) return <Briefcase className="text-destructive" />;
    return <Briefcase className="text-muted-foreground" />;
  }
  return <History className="text-gray-500" />;
};


const displayAmountCrypto = (amount: string | null, assetName: string): string => {
  if (amount === null || amount === undefined || amount.trim() === '') return '-';

  const numericAmount = parseFloat(amount);
  if (isNaN(numericAmount)) return '-';

  let symbol = assetName;
  if (assetName && assetName.includes('/')) {
    symbol = assetName.split('/')[0];
  }

  const precision = (symbol === 'BTC' || symbol === 'ETH') ? 6 : 2;
  return `${numericAmount.toLocaleString(undefined, { minimumFractionDigits: precision, maximumFractionDigits: precision })} ${symbol}`;
};


export default function TransactionsPage() {
  const { appUser, isLoading: authLoading } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (authLoading) return;

    if (!appUser) {
      setError("User not authenticated. Please login.");
      setIsLoading(false);
      return;
    }

    const fetchTransactions = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch(`/api/user/transactions?firebaseAuthUid=${appUser.firebase_auth_uid}`);
        if (!response.ok) {
          let detailedErrorMessage = `Failed to fetch transactions. API Status: ${response.status}.`; // Default message
          try {
            const errorData = await response.json();
            // Prefer detail if available, then message, then stringify
            if (errorData.detail) {
              detailedErrorMessage = `API Error (${response.status}): ${errorData.detail}`;
            } else if (errorData.message) {
              detailedErrorMessage = `API Error (${response.status}): ${errorData.message}`;
            } else if (Object.keys(errorData).length > 0) { 
              detailedErrorMessage = `API Error (${response.status}): ${JSON.stringify(errorData).substring(0, 250)}`;
            }
          } catch (jsonError) {
            // Response was not JSON
            try {
              const errorText = await response.text();
              detailedErrorMessage = `API Error (${response.status}), Non-JSON response: ${errorText.substring(0, 250)}`;
            } catch (textError) {
              // Stick with status if text also fails
            }
          }
          console.error("[TransactionsPage] Fetch error details:", detailedErrorMessage);
          throw new Error(detailedErrorMessage);
        }
        const data: Transaction[] = await response.json();
        setTransactions(data);
      } catch (err: any) {
        setError(err.message || "An unknown error occurred while fetching transactions.");
        console.error("Error fetching transactions:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTransactions();
  }, [appUser, authLoading]);

  const getStatusBadgeVariant = (status: string): "default" | "secondary" | "destructive" | "outline" => {
    switch (status?.toUpperCase()) {
      case 'COMPLETED':
      case 'EXECUTED':
      case 'PROFIT':
        return 'default';
      case 'PENDING':
        return 'secondary';
      case 'FAILED':
      case 'CANCELLED':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  if (isLoading || authLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8">
        <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
        <p className="text-muted-foreground">Loading transaction history...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8 text-center">
        <AlertTriangle className="h-12 w-12 text-destructive mb-4" />
        <p className="text-lg font-semibold text-destructive-foreground mb-2">Failed to Load Transactions</p>
        <p className="text-muted-foreground">{error}</p>
        <Button variant="outline" className="mt-6" onClick={() => window.location.reload()}>Try Again</Button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-3xl font-bold tracking-tight text-primary flex items-center">
          <History className="mr-3 h-8 w-8" /> Transaction History
        </h1>
        <div className="flex gap-2">
          <Button variant="outline" disabled>
            <Filter className="mr-2 h-4 w-4" /> Filter (Soon)
          </Button>
          <Button variant="outline" disabled>
            <Download className="mr-2 h-4 w-4" /> Export CSV (Soon)
          </Button>
        </div>
      </div>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl">All Transactions</CardTitle>
          <CardDescription>Review your deposits, withdrawals, trades, and other account activities.</CardDescription>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          {transactions.length === 0 ? (
            <div className="text-center py-10">
              <History className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No transactions found.</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12 hidden md:table-cell"></TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Asset/Details</TableHead>
                  <TableHead className="text-right">Amount (Crypto)</TableHead>
                  <TableHead className="text-right hidden sm:table-cell">Amount (USD)</TableHead>
                  <TableHead className="text-center">Status</TableHead>
                  <TableHead className="hidden lg:table-cell">Description</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions.map(txn => (
                  <TableRow key={txn.id}>
                    <TableCell className="hidden md:table-cell">
                      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-muted">
                        {getTransactionIcon(txn.transaction_type, txn.status, txn.amount_usd_equivalent)}
                      </span>
                    </TableCell>
                    <TableCell>{format(new Date(txn.created_at), 'MMM dd, yyyy HH:mm')}</TableCell>
                    <TableCell className="font-medium">{formatTransactionType(txn.transaction_type)}</TableCell>
                    <TableCell>{txn.asset_name}</TableCell>
                    <TableCell className="text-right">
                      {txn.amount_crypto ? displayAmountCrypto(txn.amount_crypto, txn.asset_name) : '-'}
                    </TableCell>
                    <TableCell className="text-right hidden sm:table-cell">${parseFloat(txn.amount_usd_equivalent).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</TableCell>
                    <TableCell className="text-center">
                      <Badge variant={getStatusBadgeVariant(txn.status)} className="capitalize">{txn.status.toLowerCase()}</Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground hidden lg:table-cell">{txn.description || '-'}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
