
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Users, BarChart2, Shield, Eye, Copy } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';

const mockTraders = [
  { id: '1', username: 'AlphaTrader', avatarSeed: 'AT', risk: 'Medium', profit: '+25.5%', copiers: 1200, market: 'Forex & Crypto', image: "https://placehold.co/400x250.png", imageHint: "trader success" },
  { id: '2', username: 'StockSavvy', avatarSeed: 'SS', risk: 'Low', profit: '+18.2%', copiers: 850, market: 'Stocks (US)', image: "https://placehold.co/400x251.png", imageHint: "stock market" },
  { id: '3', username: 'YieldHero', avatarSeed: 'YH', risk: 'High', profit: '+45.0%', copiers: 500, market: 'Commodities', image: "https://placehold.co/400x252.png", imageHint: "global finance" },
  { id: '4', username: 'SteadyGrowth', avatarSeed: 'SG', risk: 'Low', profit: '+12.8%', copiers: 1500, market: 'Indices & ETFs', image: "https://placehold.co/400x253.png", imageHint: "investment growth" },
];

export default function CopyTradingPage() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-3xl font-bold tracking-tight text-primary flex items-center">
          <Users className="mr-3 h-8 w-8" /> Copy Trading
        </h1>
        {/* Optional: Filters or search for traders */}
      </div>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl">Discover Top Traders</CardTitle>
          <CardDescription>Find experienced traders and copy their strategies automatically.</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockTraders.map(trader => (
            <Card key={trader.id} className="overflow-hidden flex flex-col hover:shadow-xl transition-shadow duration-300">
              <div className="relative h-40 w-full">
                 <Image 
                  src={trader.image} 
                  alt={`${trader.username} - Trading Activity`} 
                  layout="fill" 
                  objectFit="cover"
                  data-ai-hint={trader.imageHint}
                  className="opacity-80"
                />
                 <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent p-4 flex flex-col justify-end">
                     <h3 className="text-lg font-semibold text-white">{trader.username}</h3>
                 </div>
              </div>
              <CardContent className="p-4 space-y-3 flex-grow">
                <div className="flex items-center justify-between">
                   <Avatar className="h-12 w-12 border-2 border-primary">
                     <AvatarImage src={`https://placehold.co/80x80.png?text=${trader.avatarSeed}`} alt={trader.username} data-ai-hint="trader avatar" />
                     <AvatarFallback>{trader.avatarSeed}</AvatarFallback>
                   </Avatar>
                   <Badge variant={trader.risk === 'Low' ? 'secondary' : trader.risk === 'Medium' ? 'default' : 'destructive'} className="capitalize">
                     <Shield className="mr-1 h-3 w-3" /> {trader.risk} Risk
                   </Badge>
                </div>
                <p className="text-sm text-muted-foreground">Trades in: {trader.market}</p>
                <div className="flex justify-between items-center text-sm">
                  <span className="font-semibold text-positive">{trader.profit}</span>
                  <span className="text-muted-foreground">{trader.copiers.toLocaleString()} Copiers</span>
                </div>
              </CardContent>
              <CardFooter className="p-4 bg-muted/30 border-t">
                <div className="flex w-full gap-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    <Eye className="mr-2 h-4 w-4" /> View Profile
                  </Button>
                  <Button variant="accent" size="sm" className="flex-1">
                    <Copy className="mr-2 h-4 w-4" /> Copy Trader
                  </Button>
                </div>
              </CardFooter>
            </Card>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
