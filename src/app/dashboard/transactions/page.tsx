
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { History, ArrowUpCircle, ArrowDownCircle, Repeat, Download, Filter } from 'lucide-react';
import { format } from 'date-fns';

const mockTransactions = [
  { id: 'txn123', date: new Date(2024, 4, 15, 10, 30), type: 'Deposit', asset: 'BTC', amount: 0.05, amountUSD: 3400.00, status: 'Completed', icon: <ArrowDownCircle className="text-green-500" /> },
  { id: 'txn124', date: new Date(2024, 4, 16, 14,0), type: 'Withdrawal', asset: 'USDT', amount: 500.00, amountUSD: 500.00, status: 'Pending', icon: <ArrowUpCircle className="text-yellow-500" /> },
  { id: 'txn125', date: new Date(2024, 4, 17, 9,15), type: 'Trade', asset: 'ETH/USD', amount: 2.5, amountUSD: 9500.00, status: 'Executed', details: 'Buy ETH @ $3800', icon: <Repeat className="text-blue-500" /> },
  { id: 'txn126', date: new Date(2024, 4, 18, 11,45), type: 'CopyTrade', asset: 'AlphaTrader', amount: 0, amountUSD: 150.75, status: 'Profit', details: 'Copied trade profit', icon: <Repeat className="text-green-500" /> },
  { id: 'txn127', date: new Date(2024, 4, 19, 16,20), type: 'Deposit', asset: 'ETH', amount: 1.0, amountUSD: 3800.00, status: 'Failed', icon: <ArrowDownCircle className="text-red-500" /> },
];

export default function TransactionsPage() {
  const getStatusBadgeVariant = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
      case 'executed':
      case 'profit':
        return 'default'; // Will use primary color
      case 'pending':
        return 'secondary'; // Will use accent color (yellow in this theme)
      case 'failed':
        return 'destructive';
      default:
        return 'outline';
    }
  };


  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-3xl font-bold tracking-tight text-primary flex items-center">
          <History className="mr-3 h-8 w-8" /> Transaction History
        </h1>
        <div className="flex gap-2">
          <Button variant="outline">
            <Filter className="mr-2 h-4 w-4" /> Filter
          </Button>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" /> Export CSV
          </Button>
        </div>
      </div>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl">All Transactions</CardTitle>
          <CardDescription>Review your deposits, withdrawals, trades, and other account activities.</CardDescription>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12 hidden md:table-cell"></TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Asset</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead className="text-right hidden sm:table-cell">Amount (USD)</TableHead>
                <TableHead className="text-center">Status</TableHead>
                <TableHead className="hidden lg:table-cell">Details</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockTransactions.map(txn => (
                <TableRow key={txn.id}>
                  <TableCell className="hidden md:table-cell">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-muted">
                      {txn.icon}
                    </span>
                  </TableCell>
                  <TableCell>{format(txn.date, 'MMM dd, yyyy HH:mm')}</TableCell>
                  <TableCell className="font-medium">{txn.type}</TableCell>
                  <TableCell>{txn.asset}</TableCell>
                  <TableCell className="text-right">
                    {txn.amount.toLocaleString(undefined, { minimumFractionDigits: txn.asset.includes('/') ? 2 : (txn.asset === 'BTC' || txn.asset === 'ETH' ? 6 : 2) })} {txn.type !== 'CopyTrade' ? (txn.asset.split('/')[0] || txn.asset) : ''}
                  </TableCell>
                  <TableCell className="text-right hidden sm:table-cell">${txn.amountUSD.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</TableCell>
                  <TableCell className="text-center">
                    <Badge variant={getStatusBadgeVariant(txn.status)}>{txn.status}</Badge>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground hidden lg:table-cell">{txn.details || '-'}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

