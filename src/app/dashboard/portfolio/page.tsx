
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Briefcase, TrendingUp, Download, Bitcoin as BitcoinIcon, Apple as AppleIcon, DollarSign as DollarSignIcon } from 'lucide-react';
import Image from 'next/image';

// Custom SVG component for Ethereum Icon
const EthereumIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 256 417" preserveAspectRatio="xMidYMid" className="rounded-full">
    <path fill="#627EEA" d="m127.961 0l-2.795 9.5v275.668l2.795 2.79l127.962-75.638z"/> {/* Main part blue */}
    <path fill="#4557A5" d="M127.962 0L0 212.32l127.962 75.638V157.885z"/> {/* Darker blue facet */}
    <path fill="#8AA0F2" d="m127.961 312.187l-1.575 1.92v98.199l1.575 4.6l127.963-177.959z"/> {/* Lighter blue facet */}
    <path fill="#627EEA" d="m127.962 416.905v-104.72L0 239.625z"/> {/* Main part blue */}
    <path fill="#4557A5" d="m127.961 287.958l127.96-75.637l-127.96-58.162z"/> {/* Darker blue facet */}
    <path fill="#8AA0F2" d="m.001 212.321l127.96 75.637V154.159z"/> {/* Lighter blue facet */}
  </svg>
);


const mockPortfolioAssets = [
  { id: 'BTC', name: 'Bitcoin', quantity: 0.5, price: 68500.00, value: 34250.00, pnl: 2250.00, pnlPercent: 7.03, icon: <BitcoinIcon className="h-8 w-8 text-orange-500" /> },
  { id: 'ETH', name: 'Ethereum', quantity: 10, price: 3800.00, value: 38000.00, pnl: -800.00, pnlPercent: -2.06, icon: <EthereumIcon /> },
  { id: 'AAPL', name: 'Apple Inc.', quantity: 50, price: 190.50, value: 9525.00, pnl: 525.00, pnlPercent: 5.83, icon: <AppleIcon className="h-8 w-8 text-gray-700 dark:text-gray-300" /> },
  { id: 'USD_BAL', name: 'USD Balance', quantity: 12500.00, price: 1.00, value: 12500.00, pnl: 0, pnlPercent: 0, isCash: true, icon: <DollarSignIcon className="h-8 w-8 text-green-600" />},
];

const overallPortfolio = {
  totalValue: mockPortfolioAssets.reduce((sum, asset) => sum + asset.value, 0),
  totalPnl: mockPortfolioAssets.reduce((sum, asset) => sum + asset.pnl, 0),
};

export default function PortfolioPage() {
  const totalPnlPercent = overallPortfolio.totalValue - overallPortfolio.totalPnl !== 0 
    ? (overallPortfolio.totalPnl / (overallPortfolio.totalValue - overallPortfolio.totalPnl)) * 100 
    : 0;

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-3xl font-bold tracking-tight text-primary flex items-center">
          <Briefcase className="mr-3 h-8 w-8" /> My Portfolio
        </h1>
        <Button variant="outline">
          <Download className="mr-2 h-4 w-4" /> Export Report
        </Button>
      </div>

      {/* Overall Portfolio Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Portfolio Value</CardTitle>
            <Briefcase className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">
              ${overallPortfolio.totalValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Overall Profit/Loss</CardTitle>
            {overallPortfolio.totalPnl >= 0 ? <TrendingUp className="h-5 w-5 text-positive" /> : <TrendingUp className="h-5 w-5 text-destructive transform rotate-180" />}
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${overallPortfolio.totalPnl >= 0 ? 'text-positive' : 'text-destructive'}`}>
              ${overallPortfolio.totalPnl.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <p className={`text-xs ${overallPortfolio.totalPnl >= 0 ? 'text-positive' : 'text-destructive'}`}>
              ({totalPnlPercent.toFixed(2)}%)
            </p>
          </CardContent>
        </Card>
        {/* Placeholder for Performance Chart */}
        <Card className="shadow-md md:col-span-2 lg:col-span-1">
           <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">Performance Over Time</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-center aspect-video md:aspect-auto md:h-full bg-muted/30 rounded-md">
             <Image src="https://placehold.co/600x300.png" alt="Placeholder performance chart" width={600} height={300} data-ai-hint="portfolio performance" className="opacity-50"/>
          </CardContent>
        </Card>
      </div>

      {/* Asset Breakdown Table */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl">Asset Allocation</CardTitle>
          <CardDescription>Detailed view of your current holdings.</CardDescription>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[60px] hidden sm:table-cell px-2">Icon</TableHead>
                <TableHead>Asset</TableHead>
                <TableHead className="text-right">Quantity</TableHead>
                <TableHead className="text-right">Price</TableHead>
                <TableHead className="text-right">Total Value</TableHead>
                <TableHead className="text-right">P/L ($)</TableHead>
                <TableHead className="text-right hidden md:table-cell">P/L (%)</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockPortfolioAssets.map(asset => (
                <TableRow key={asset.id}>
                  <TableCell className="hidden sm:table-cell px-2">
                    <div className="flex items-center justify-center w-8 h-8">
                       {asset.icon}
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">{asset.name}</TableCell>
                  <TableCell className="text-right">{asset.isCash ? '-' : asset.quantity.toLocaleString()}</TableCell>
                  <TableCell className="text-right">${asset.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</TableCell>
                  <TableCell className="text-right font-semibold">${asset.value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</TableCell>
                  <TableCell className={`text-right ${asset.pnl >= 0 ? 'text-positive' : 'text-destructive'}`}>
                    {asset.pnl.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </TableCell>
                   <TableCell className={`text-right hidden md:table-cell ${asset.pnl >= 0 ? 'text-positive' : 'text-destructive'}`}>
                    {asset.pnlPercent.toFixed(2)}%
                  </TableCell>
                  <TableCell className="text-right">
                    {!asset.isCash && <Button variant="outline" size="sm">Trade</Button>}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

