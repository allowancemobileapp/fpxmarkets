
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { LineChart, Star, Search } from 'lucide-react';
import Image from 'next/image';

// Mock data for markets
const marketCategories = [
  { value: 'forex', label: 'Forex' },
  { value: 'crypto', label: 'Crypto' },
  { value: 'stocks', label: 'Stocks' },
  { value: 'commodities', label: 'Commodities' },
];

const mockAssets = {
  forex: [
    { id: 'EURUSD', name: 'EUR/USD', price: 1.0850, change: '+0.25%', high: 1.0875, low: 1.0825, favorite: true },
    { id: 'GBPUSD', name: 'GBP/USD', price: 1.2700, change: '-0.10%', high: 1.2750, low: 1.2680, favorite: false },
  ],
  crypto: [
    { id: 'BTCUSD', name: 'BTC/USD', price: 68500.00, change: '+5.80%', high: 69200.00, low: 65300.00, favorite: true },
    { id: 'ETHUSD', name: 'ETH/USD', price: 3800.00, change: '+3.10%', high: 3850.00, low: 3700.00, favorite: false },
  ],
  stocks: [
    { id: 'AAPL', name: 'Apple Inc.', price: 190.50, change: '+1.20%', high: 191.00, low: 188.50, favorite: false },
    { id: 'MSFT', name: 'Microsoft Corp.', price: 425.00, change: '+0.75%', high: 428.00, low: 422.00, favorite: true },
  ],
  commodities: [
    { id: 'XAUUSD', name: 'Gold', price: 2350.00, change: '+0.50%', high: 2360.00, low: 2340.00, favorite: true },
    { id: 'WTIUSD', name: 'Crude Oil (WTI)', price: 78.50, change: '-1.10%', high: 79.80, low: 78.00, favorite: false },
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Placeholder Chart */}
                  <Card className="md:col-span-1">
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
                  <div className="overflow-x-auto md:col-span-1">
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
                            <TableCell className="text-right">${typeof asset.price === 'number' ? asset.price.toFixed(2) : asset.price}</TableCell>
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
import { Input } from '@/components/ui/input'; // Add missing import
