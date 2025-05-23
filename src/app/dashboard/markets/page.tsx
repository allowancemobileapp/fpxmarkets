
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { LineChart, Star, Search } from 'lucide-react';
import Image from 'next/image';
import { Input } from '@/components/ui/input';

// Mock data for markets
const marketCategories = [
  { value: 'forex', label: 'Forex' },
  { value: 'crypto', label: 'Crypto' },
  { value: 'stocks', label: 'Stocks' },
  { value: 'commodities', label: 'Commodities' },
];

const mockAssets: Record<string, Array<{ id: string; name: string; price: number | string; change: string; high: number | string; low: number | string; favorite: boolean }>> = {
  forex: [
    { id: 'EURUSD', name: 'EUR/USD', price: 1.0850, change: '+0.25%', high: 1.0875, low: 1.0825, favorite: true },
    { id: 'GBPUSD', name: 'GBP/USD', price: 1.2700, change: '-0.10%', high: 1.2750, low: 1.2680, favorite: false },
    { id: 'USDJPY', name: 'USD/JPY', price: 157.20, change: '+0.05%', high: 157.50, low: 156.80, favorite: false },
    { id: 'AUDUSD', name: 'AUD/USD', price: 0.6650, change: '-0.15%', high: 0.6680, low: 0.6630, favorite: true },
  ],
  crypto: [
    { id: 'BTCUSD', name: 'BTC/USD', price: 68500.00, change: '+5.80%', high: 69200.00, low: 65300.00, favorite: true },
    { id: 'ETHUSD', name: 'ETH/USD', price: 3800.00, change: '+3.10%', high: 3850.00, low: 3700.00, favorite: false },
    { id: 'SOLUSD', name: 'SOL/USD', price: 165.00, change: '+2.50%', high: 170.00, low: 160.00, favorite: true },
    { id: 'DOGEUSD', name: 'DOGE/USD', price: 0.1600, change: '-1.20%', high: 0.1650, low: 0.1580, favorite: false },
  ],
  stocks: [
    { id: 'AAPL', name: 'Apple Inc.', price: 190.50, change: '+1.20%', high: 191.00, low: 188.50, favorite: false },
    { id: 'MSFT', name: 'Microsoft Corp.', price: 425.00, change: '+0.75%', high: 428.00, low: 422.00, favorite: true },
    { id: 'NVDA', name: 'NVIDIA Corp.', price: 1200.00, change: '+3.50%', high: 1210.00, low: 1180.00, favorite: true },
    { id: 'AMZN', name: 'Amazon.com Inc.', price: 185.00, change: '+0.90%', high: 186.50, low: 183.00, favorite: false },
  ],
  commodities: [
    { id: 'XAUUSD', name: 'Gold', price: 2350.00, change: '+0.50%', high: 2360.00, low: 2340.00, favorite: true },
    { id: 'WTIUSD', name: 'Crude Oil (WTI)', price: 78.50, change: '-1.10%', high: 79.80, low: 78.00, favorite: false },
    { id: 'XAGUSD', name: 'Silver', price: 30.50, change: '+1.50%', high: 31.00, low: 30.00, favorite: false },
    { id: 'NGUSD', name: 'Natural Gas', price: 2.80, change: '-2.00%', high: 2.90, low: 2.75, favorite: false },
  ],
};

export default function MarketsPage() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-3xl font-bold tracking-tight text-primary flex items-center">
          <LineChart className="mr-3 h-8 w-8" /> Markets Overview
        </h1>
        <div className="relative w-full sm:w-auto">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search markets..." className="pl-8 w-full sm:w-64 md:w-80" />
        </div>
      </div>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl">Explore Trading Instruments</CardTitle>
          <CardDescription>View different market categories and their assets.</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="forex" className="w-full">
            <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 mb-6">
              {marketCategories.map(cat => (
                <TabsTrigger key={cat.value} value={cat.value}>{cat.label}</TabsTrigger>
              ))}
            </TabsList>
            
            {marketCategories.map(cat => (
              <TabsContent key={cat.value} value={cat.value}>
                <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
                  {/* Placeholder Chart */}
                  <Card className="md:col-span-2">
                    <CardHeader>
                      <CardTitle className="text-lg">
                        {(mockAssets[cat.value as keyof typeof mockAssets]?.[0]?.name) || 'Selected Asset'} Chart
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="flex items-center justify-center aspect-video bg-muted/30 rounded-md">
                       <Image src="https://placehold.co/600x300.png" alt="Placeholder chart" width={600} height={300} data-ai-hint="market chart graph" className="opacity-50"/>
                       {/* Replace with actual chart component */}
                    </CardContent>
                  </Card>

                  {/* Asset Details Table */}
                  <div className="overflow-x-auto md:col-span-3">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Asset</TableHead>
                          <TableHead className="text-right">Price</TableHead>
                          <TableHead className="text-right">Change</TableHead>
                          <TableHead className="text-center hidden sm:table-cell">Favorite</TableHead>
                          <TableHead className="text-right">Action</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {(mockAssets[cat.value as keyof typeof mockAssets] || []).map(asset => (
                          <TableRow key={asset.id}>
                            <TableCell className="font-medium">{asset.name}</TableCell>
                            <TableCell className="text-right">${typeof asset.price === 'number' ? asset.price.toFixed(cat.value === 'crypto' && asset.id === 'DOGEUSD' ? 4 : 2) : asset.price}</TableCell>
                            <TableCell className={`text-right ${asset.change.startsWith('+') ? 'text-positive' : 'text-destructive'}`}>
                              {asset.change}
                            </TableCell>
                            <TableCell className="text-center hidden sm:table-cell">
                              <Button variant="ghost" size="icon" className={asset.favorite ? "text-accent" : "text-muted-foreground"}>
                                <Star className="h-5 w-5" />
                              </Button>
                            </TableCell>
                            <TableCell className="text-right">
                              <Button variant="outline" size="sm">Trade</Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
