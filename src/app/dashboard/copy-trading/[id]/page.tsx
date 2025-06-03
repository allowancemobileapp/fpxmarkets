
'use client';

import { useParams } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ArrowLeft, UserCircle, BarChart2, Shield, CalendarDays, TrendingUp, Users } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

// Mock data - in a real app, this would be fetched based on params.id
const mockTraders = [
  { id: '1', username: 'AlphaTrader', avatarSeed: 'AT', risk: 'Medium', profit: '+25.5%', copiers: 1200, market: 'Forex & Crypto', strategy: 'Scalping & Swing Trading', joined: '2023-01-15', image: "https://placehold.co/800x400.png", imageHint: "trader profile background" },
  { id: '2', username: 'StockSavvy', avatarSeed: 'SS', risk: 'Low', profit: '+18.2%', copiers: 850, market: 'Stocks (US)', strategy: 'Value Investing & Blue Chips', joined: '2022-11-01', image: "https://placehold.co/800x401.png", imageHint: "stock market analysis" },
  { id: '3', username: 'YieldHero', avatarSeed: 'YH', risk: 'High', profit: '+45.0%', copiers: 500, market: 'Commodities', strategy: 'Trend Following & Futures', joined: '2023-05-20', image: "https://placehold.co/800x402.png", imageHint: "commodities chart" },
  { id: '4', username: 'SteadyGrowth', avatarSeed: 'SG', risk: 'Low', profit: '+12.8%', copiers: 1500, market: 'Indices & ETFs', strategy: 'Long-term Index Investing', joined: '2022-08-10', image: "https://placehold.co/800x403.png", imageHint: "etf growth chart" },
];

export default function TraderProfilePage() {
  const params = useParams();
  const traderId = typeof params.id === 'string' ? params.id : '';
  
  // Find the trader from mock data. Replace with actual data fetching later.
  const trader = mockTraders.find(t => t.id === traderId);

  if (!trader) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8">
        <UserCircle className="w-24 h-24 text-muted-foreground mb-4" />
        <h1 className="text-2xl font-semibold text-destructive">Trader Not Found</h1>
        <p className="text-muted-foreground mt-2">The trader profile you are looking for does not exist or could not be loaded.</p>
        <Button asChild variant="link" className="mt-6">
          <Link href="/dashboard/copy-trading">
            <ArrowLeft className="mr-2 h-4 w-4" /> Go Back to Copy Trading
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <Button asChild variant="outline" size="sm" className="mb-6">
        <Link href="/dashboard/copy-trading">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to All Traders
        </Link>
      </Button>

      <Card className="shadow-xl overflow-hidden">
        <div className="relative h-48 md:h-64 w-full">
          <Image 
            src={trader.image} 
            alt={`${trader.username}'s Profile Banner`} 
            layout="fill" 
            objectFit="cover" 
            data-ai-hint={trader.imageHint}
            className="opacity-80"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent p-6 flex items-end">
            <div className="flex items-center gap-4">
              <Avatar className="h-20 w-20 border-4 border-background shadow-lg">
                <AvatarImage src={`https://placehold.co/100x100.png?text=${trader.avatarSeed}`} alt={trader.username} data-ai-hint="trader avatar" />
                <AvatarFallback className="text-2xl">{trader.avatarSeed}</AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-3xl font-bold text-white">{trader.username}</h1>
                <p className="text-sm text-gray-200">Trading in: {trader.market}</p>
              </div>
            </div>
          </div>
        </div>

        <CardContent className="p-6 grid md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl flex items-center text-primary"><BarChart2 className="mr-2 h-5 w-5"/> Trading Strategy</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{trader.strategy || "Strategy details not provided."}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-xl flex items-center text-primary"><TrendingUp className="mr-2 h-5 w-5"/> Performance (Mock)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="aspect-video bg-muted/30 rounded-md flex items-center justify-center">
                    <Image 
                        src={`https://placehold.co/600x300.png?text=${trader.username}+Performance`} 
                        alt={`${trader.username} Performance Chart`} 
                        width={600} 
                        height={300} 
                        data-ai-hint="performance graph"
                        className="opacity-60 rounded-md"
                    />
                </div>
                <p className="text-xs text-muted-foreground mt-2 text-center">Detailed performance chart coming soon.</p>
              </CardContent>
            </Card>
          </div>

          <div className="md:col-span-1 space-y-6">
            <Card className="bg-secondary/30">
              <CardHeader>
                <CardTitle className="text-lg text-primary">Key Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground flex items-center"><Shield className="mr-2 h-4 w-4"/>Risk Level:</span>
                  <Badge variant={trader.risk === 'Low' ? 'secondary' : trader.risk === 'Medium' ? 'default' : 'destructive'} className="capitalize">
                    {trader.risk}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground flex items-center"><TrendingUp className="mr-2 h-4 w-4"/>Profit (All Time):</span>
                  <span className="font-semibold text-positive">{trader.profit}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground flex items-center"><Users className="mr-2 h-4 w-4"/>Copiers:</span>
                  <span className="font-semibold">{trader.copiers.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground flex items-center"><CalendarDays className="mr-2 h-4 w-4"/>Joined:</span>
                  <span className="font-semibold">{new Date(trader.joined).toLocaleDateString()}</span>
                </div>
              </CardContent>
            </Card>
            <Button 
                variant="accent" 
                size="lg" 
                className="w-full"
                onClick={() => alert(`UI Demo: Copying ${trader.username}. This would typically use the same logic as the main copy trading page.`)}
            >
              <Copy className="mr-2 h-5 w-5"/> Copy {trader.username}
            </Button>
            <Button variant="outline" className="w-full">Message {trader.username} (Coming Soon)</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
