
'use client';

import { useParams } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ArrowLeft, UserCircle, BarChart2, Shield, CalendarDays, TrendingUp, Users, Copy, CheckCircle, Loader2 } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { mockTraders } from '@/config/mockTraders'; // Import mockTraders
import { useCopyTrading } from '@/contexts/CopyTradingContext'; // Import the context hook
import { useEffect, useState } from 'react'; // For handling client-side state

export default function TraderProfilePage() {
  const params = useParams();
  const traderId = typeof params.id === 'string' ? params.id : '';
  const { toggleCopyTrader, isTraderCopied, isLoading: isContextLoading } = useCopyTrading(); // Use the context
  
  const trader = mockTraders.find(t => t.id === traderId);
  const [isCopiedByCurrentUser, setIsCopiedByCurrentUser] = useState(false);
  const [isToggling, setIsToggling] = useState(false);

  useEffect(() => {
    if (!isContextLoading && trader) {
      setIsCopiedByCurrentUser(isTraderCopied(trader.id));
    }
  }, [trader, isTraderCopied, isContextLoading]);

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

  const handleToggleCopyFromProfile = async () => {
    setIsToggling(true);
    await toggleCopyTrader(trader.id, trader.username);
    setIsToggling(false);
  };

  const buttonIsDisabled = isContextLoading || isToggling;
  const buttonText = isCopiedByCurrentUser ? `Stop Copying ${trader.username}` : `Copy ${trader.username}`;

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
            src={trader.image} // This will now use the Supabase URL
            alt={`${trader.username}'s Profile Banner`} 
            layout="fill" 
            objectFit="cover" 
            // data-ai-hint removed as this is now a specific image
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
                <CardTitle className="text-xl flex items-center text-primary"><TrendingUp className="mr-2 h-5 w-5"/> Performance</CardTitle>
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
                  <span className="font-semibold">{trader.joined ? new Date(trader.joined).toLocaleDateString() : 'N/A'}</span>
                </div>
              </CardContent>
            </Card>
            <Button 
                variant={isCopiedByCurrentUser ? "destructive" : "accent"} 
                size="lg" 
                className="w-full"
                onClick={handleToggleCopyFromProfile}
                disabled={buttonIsDisabled}
            >
              {buttonIsDisabled ? <Loader2 className="mr-2 h-5 w-5 animate-spin"/> : (isCopiedByCurrentUser ? <CheckCircle className="mr-2 h-5 w-5"/> : <Copy className="mr-2 h-5 w-5"/>)}
              {buttonIsDisabled ? "Processing..." : buttonText}
            </Button>
            <Button variant="outline" className="w-full" disabled>Message {trader.username} (Coming Soon)</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
