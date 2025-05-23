'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Home,
  UserCircle,
  LineChart,
  Users,
  Briefcase,
  Settings,
  Coins,
  LogOut,
  Wallet,
  History,
  LifeBuoy,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import Image from 'next/image';

const mainNavItems = [
  { href: '/dashboard', label: 'Home', icon: Home },
  { href: '/dashboard/profile', label: 'Profile', icon: UserCircle },
  { href: '/dashboard/markets', label: 'Market', icon: LineChart },
  { href: '/dashboard/copy-trading', label: 'Copy Trading', icon: Users },
  { href: '/dashboard/portfolio', label: 'Portfolio', icon: Briefcase },
  { href: '/dashboard/deposit', label: 'Deposit Funds', icon: Wallet },
  { href: '/dashboard/transactions', label: 'Transactions', icon: History },
];

const secondaryNavItems = [
  { href: '/dashboard/settings', label: 'Settings', icon: Settings },
  { href: '/dashboard/support', label: 'Support', icon: LifeBuoy },
];

export default function DashboardSidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  return (
    <aside className="hidden md:flex md:flex-col md:w-64 border-r bg-background">
      <div className="flex h-16 items-center border-b px-6 shrink-0">
        <Link href="/dashboard" className="flex items-center gap-2 font-semibold">
          <Coins className="h-7 w-7 text-primary" />
          <span className="text-lg text-primary">FPX Dashboard</span>
        </Link>
      </div>
      <nav className="flex-1 overflow-y-auto px-4 py-6 space-y-2">
        {mainNavItems.map((item) => (
          <Button
            key={item.label}
            variant={pathname === item.href ? 'secondary' : 'ghost'}
            className={cn(
              'w-full justify-start',
              pathname === item.href && 'font-semibold'
            )}
            asChild
          >
            <Link href={item.href}>
              <item.icon className="mr-3 h-5 w-5" />
              {item.label}
            </Link>
          </Button>
        ))}
      </nav>
      <Separator className="my-2" />
      <nav className="px-4 py-6 space-y-2 shrink-0">
         {secondaryNavItems.map((item) => (
          <Button
            key={item.label}
            variant={pathname === item.href ? 'secondary' : 'ghost'}
            className={cn(
              'w-full justify-start',
              pathname === item.href && 'font-semibold'
            )}
            asChild
          >
            <Link href={item.href}>
              <item.icon className="mr-3 h-5 w-5" />
              {item.label}
            </Link>
          </Button>
        ))}
        <Button
          variant="ghost"
          className="w-full justify-start text-muted-foreground hover:text-destructive"
          onClick={logout}
        >
          <LogOut className="mr-3 h-5 w-5" />
          Logout
        </Button>
      </nav>
       {user && (
        <div className="mt-auto border-t p-4">
          <div className="flex items-center gap-3">
            <Image 
              src={`https://placehold.co/40x40.png?text=${user.username?.[0]?.toUpperCase() ?? 'U'}`} 
              alt={user.username || "User"} 
              width={40} 
              height={40} 
              className="rounded-full"
              data-ai-hint="user avatar"
            />
            <div>
              <p className="text-sm font-medium leading-none">{user.username}</p>
              <p className="text-xs text-muted-foreground">{user.email}</p>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}
