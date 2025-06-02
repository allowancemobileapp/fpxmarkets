
'use client';

import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { DollarSign, TrendingUp, AlertTriangle, CheckCircle, Clock, Copy, Users, BarChartBig, UserCircle, Loader2 } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useState } from 'react';

interface DashboardData {
  totalAssets: number;
  totalDeposited: number;
  totalProfitLoss: number;
  pendingDeposits: number;
}

const mockCopiedTraders = [
  { id: '1', username: 'CryptoKing', avatarSeed: 'CK', market: 'Cryptocurrencies', profitLoss: 150.25 },
  { id: '2', username: 'ForexMaster', avatarSeed: 'FM', market: 'Forex', profitLoss: -50.75 },
  { id: '3', username: 'StockWizard', avatarSeed: 'SW', market: 'Stocks', profitLoss: 300.00 },
];

const StatCard = ({ title, value, icon: Icon, unit = '$', color = 'text-primary', description, trend }: {
  title: string;
  value: number | string;
  icon: React.ElementType;
  unit?: string;
  color?: string;
  description?: string;
  trend?: 'up' | 'down' | 'neutral';
}) => (
  <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
      <Icon className={`h-5 w-5 ${color}`} />
    </CardHeader>
    <CardContent>
      <div className={`text-2xl font-bold ${color}`}>
        {unit}{typeof value === 'number' ? value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : value}
      </div>
      {description && <p className="text-xs text-muted-foreground mt-1">{description}</p>}
    </CardContent>
    {trend && (
       <CardFooter className="text-xs text-muted-foreground">
        {trend === 'up' && <TrendingUp className="h-4 w-4 mr-1 text-positive" />}
        {trend === 'down' && <TrendingUp className="h-4 w-4 mr-1 text-destructive transform rotate-180" />}
      </CardFooter>
    )}
  </Card>
);


export default function DashboardHomePage() {
  const { appUser, isLoading: authIsLoading } = useAuth();
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [isFetchingDashboardData, setIsFetchingDashboardData] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);

  useEffect(() => {
    if (appUser && appUser.firebase_auth_uid && !dashboardData && !isFetchingDashboardData) {
      const fetchDashboardSummary = async () => {
        console.log('[DashboardHomePage] CLIENT: appUser available, fetching dashboard summary for UID:', appUser.firebase_auth_uid);
        setIsFetchingDashboardData(true);
        setFetchError(null);
        try {
          const response = await fetch(`/api/user/dashboard-summary?firebaseAuthUid=${appUser.firebase_auth_uid}`);
          if (!response.ok) {
            const errorData = await response.json().catch(() => ({ message: `Failed to fetch dashboard data. Status: ${response.status}` }));
            console.error('[DashboardHomePage] CLIENT: Error fetching dashboard summary:', errorData);
            throw new Error(errorData.message || `API request failed with status ${response.status}`);
          }
          const data: DashboardData = await response.json();
          console.log('[DashboardHomePage] CLIENT: Dashboard summary fetched successfully:', data);
          setDashboardData(data);
        } catch (error: any) {
          console.error('[DashboardHomePage] CLIENT: Exception while fetching dashboard summary:', error);
          setFetchError(error.message || 'Could not load dashboard data.');
        } finally {
          setIsFetchingDashboardData(false);
        }
      };
      fetchDashboardSummary();
    }
  }, [appUser, dashboardData, isFetchingDashboardData]);

  if (authIsLoading) {
    return (
      <div className="flex h-[calc(100vh-10rem)] items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <p className="ml-3 text-muted-foreground">Initializing session...</p>
      </div>
    );
  }

  if (!appUser) {
     return (
      <div className="flex h-[calc(100vh-10rem)] items-center justify-center">
        <AlertTriangle className="h-10 w-10 text-destructive" />
        <p className="ml-3 text-destructive-foreground">User data not available. Please try logging in again.</p>
      </div>
    );
  }

  if (isFetchingDashboardData && !dashboardData) {
    return (
      <div className="flex h-[calc(100vh-10rem)] items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <p className="ml-3 text-muted-foreground">Loading dashboard data...</p>
      </div>
    );
  }
  
  if (fetchError && !dashboardData) {
    return (
      <div className="flex h-[calc(100vh-10rem)] items-center justify-center text-center">
        <AlertTriangle className="h-10 w-10 text-destructive mb-2" />
        <p className="text-destructive-foreground">Error loading dashboard: {fetchError}</p>
      </div>
    );
  }
  
  const dataToDisplay = dashboardData; // Use fetched data if available, otherwise mock for CopiedTraders

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-primary">Welcome, {appUser.username || appUser.first_name}!</h1>
          <p className="text-muted-foreground">Here&apos;s an overview of your trading account.</p>
        </div>
        <Button asChild variant="accent">
          <Link href="/dashboard/deposit">
            <DollarSign className="mr-2 h-5 w-5" /> Deposit Funds
          </Link>
        </Button>
      </div>

      {/* Key Metrics */}
      {dataToDisplay ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatCard title="Total Assets" value={dataToDisplay.totalAssets} icon={BarChartBig} color="text-green-500" description="Portfolio Value" trend={dataToDisplay.totalProfitLoss > 0 ? "up" : (dataToDisplay.totalProfitLoss < 0 ? "down" : "neutral")}/>
          <StatCard title="Total Deposited" value={dataToDisplay.totalDeposited} icon={CheckCircle} color="text-blue-500" description="Confirmed Deposits (Mocked)"/>
          <StatCard
            title="Total Profit/Loss"
            value={dataToDisplay.totalProfitLoss}
            icon={dataToDisplay.totalProfitLoss >= 0 ? TrendingUp : TrendingUp}
            color={dataToDisplay.totalProfitLoss >= 0 ? 'text-positive' : 'text-destructive'}
            className={dataToDisplay.totalProfitLoss < 0 ? 'transform rotate-180' : ''}
            description="Overall Performance"
            trend={dataToDisplay.totalProfitLoss > 0 ? 'up' : (dataToDisplay.totalProfitLoss < 0 ? 'down' : 'neutral')}
          />
          <StatCard title="Pending Deposits" value={dataToDisplay.pendingDeposits} icon={Clock} color="text-yellow-500" description="Awaiting Confirmation (Mocked)"/>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => <Card key={i} className="shadow-lg h-32 animate-pulse bg-muted/50"><CardHeader></CardHeader><CardContent></CardContent></Card>)}
        </div>
      )}

       <Card className="overflow-hidden shadow-lg">
        <div className="relative h-56 sm:h-72 md:h-80 w-full">
          <Image
            src="https://placehold.co/1200x400.png"
            alt="Financial Growth Chart"
            layout="fill"
            objectFit="cover"
            className="opacity-80"
            data-ai-hint="financial growth technology"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent p-6 sm:p-8 flex flex-col justify-end">
            <h2 className="text-2xl sm:text-3xl font-semibold text-white">Plan Your Financial Future</h2>
            <p className="mt-2 text-base sm:text-lg text-gray-200 max-w-2xl">
              Utilize our tools and insights to make informed trading decisions and grow your portfolio.
            </p>
          </div>
        </div>
      </Card>

      {mockCopiedTraders && mockCopiedTraders.length > 0 && (
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-primary flex items-center">
              <Users className="mr-3 h-6 w-6" /> My Copied Traders (Mock Data)
            </CardTitle>
            <CardDescription>Overview of traders you are currently copying.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {mockCopiedTraders.map(trader => (
              <Card key={trader.id} className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-secondary/30 hover:shadow-md transition-shadow">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-lg font-semibold">
                    {trader.avatarSeed}
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">{trader.username}</p>
                    <p className="text-xs text-muted-foreground">{trader.market}</p>
                  </div>
                </div>
                <div className={`text-sm font-medium ${trader.profitLoss >= 0 ? 'text-positive' : 'text-destructive'}`}>
                  P/L: ${trader.profitLoss.toFixed(2)}
                </div>
                 <Button variant="outline" size="sm" asChild>
                  <Link href={`/dashboard/copy-trading/${trader.id}`}>Manage</Link>
                </Button>
              </Card>
            ))}
          </CardContent>
           <CardFooter>
            <Button variant="link" asChild>
              <Link href="/dashboard/copy-trading">View All Copy Trading</Link>
            </Button>
          </CardFooter>
        </Card>
      )}

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-primary">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <Button variant="outline" size="lg" className="w-full justify-start text-base py-6" asChild>
             <Link href="/dashboard/markets">
              <BarChartBig className="mr-3 h-6 w-6" /> View Markets
            </Link>
          </Button>
          <Button variant="outline" size="lg" className="w-full justify-start text-base py-6" asChild>
            <Link href="/dashboard/copy-trading">
              <Copy className="mr-3 h-6 w-6" /> Start Copy Trading
            </Link>
          </Button>
           <Button variant="outline" size="lg" className="w-full justify-start text-base py-6" asChild>
            <Link href="/dashboard/profile">
              <UserCircle className="mr-3 h-6 w-6" /> Manage Profile
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
