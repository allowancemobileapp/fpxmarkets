
'use client';

import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Users, Shield, Eye, Copy, CheckCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
import { useCopyTrading } from '@/contexts/CopyTradingContext'; // Import the context hook
import { mockTraders } from '@/config/mockTraders'; // Import mockTraders

export default function CopyTradingPage() {
  const { toggleCopyTrader, isTraderCopied } = useCopyTrading(); // Use the context

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-3xl font-bold tracking-tight text-primary flex items-center">
          <Users className="mr-3 h-8 w-8" /> Copy Trading
        </h1>
      </div>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl">Discover Top Traders</CardTitle>
          <CardDescription>Find experienced traders and copy their strategies automatically.</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {mockTraders.map(trader => {
            const isCopied = isTraderCopied(trader.id);
            return (
              <Card 
                key={trader.id} 
                className={`overflow-hidden flex flex-col hover:shadow-xl transition-shadow duration-300 bg-card ${isCopied ? 'border-2 border-positive' : ''}`}
              >
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
                       {isCopied && <Badge variant="default" className="absolute top-2 right-2 bg-positive text-positive-foreground text-xs"><CheckCircle className="mr-1 h-3 w-3"/>Copying</Badge>}
                   </div>
                </div>
                <CardContent className="p-4 space-y-3 flex-grow">
                  <div className="flex items-center justify-between">
                     <Avatar className="h-12 w-12 border-2 border-primary">
                       <AvatarImage src={`https://placehold.co/80x80.png?text=${trader.avatarSeed}`} alt={trader.username} data-ai-hint="trader avatar" />
                       <AvatarFallback>{trader.avatarSeed}</AvatarFallback>
                     </Avatar>
                     <Badge variant={trader.risk === 'Low' ? 'secondary' : trader.risk === 'Medium' ? 'default' : 'destructive'} className="capitalize text-xs px-2 py-1">
                       <Shield className="mr-1 h-3 w-3" /> {trader.risk} Risk
                     </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">Trades in: {trader.market}</p>
                  <div className="flex justify-between items-center text-sm">
                    <span className="font-semibold text-positive">{trader.profit}</span>
                    <span className="text-muted-foreground">{trader.copiers.toLocaleString()} Copiers</span>
                  </div>
                </CardContent>
                <CardFooter className="flex flex-wrap items-center justify-start gap-2 p-4 bg-muted/30 border-t mt-auto">
                  <Button variant="outline" size="sm" className="text-xs sm:text-sm" asChild>
                    <Link href={`/dashboard/copy-trading/${trader.id}`}>
                      <Eye className="mr-1.5 h-4 w-4" /> View Profile
                    </Link>
                  </Button>
                  <Button 
                    variant={isCopied ? "destructive" : "accent"} 
                    size="sm" 
                    className="text-xs sm:text-sm"
                    onClick={() => toggleCopyTrader(trader.id, trader.username)}
                  >
                    {isCopied ? <CheckCircle className="mr-1.5 h-4 w-4" /> : <Copy className="mr-1.5 h-4 w-4" />}
                    {isCopied ? "Stop Copying" : "Copy"}
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );
}
