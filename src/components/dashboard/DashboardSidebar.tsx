
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Home as HomeIcon,
  UserCircle,
  LineChart,
  Users,
  // Briefcase, // Portfolio icon removed
  Settings,
  Coins,
  LogOut,
  Wallet,
  History,
  LifeBuoy,
  ArrowUpCircle, 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import Image from 'next/image';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

const mainNavItems = [
  { href: '/dashboard', label: 'Home', icon: HomeIcon },
  { href: '/dashboard/profile', label: 'Profile', icon: UserCircle },
  { href: '/dashboard/markets', label: 'Markets', icon: LineChart },
  { href: '/dashboard/copy-trading', label: 'Copy Trading', icon: Users },
  // { href: '/dashboard/portfolio', label: 'Portfolio', icon: Briefcase }, // Removed Portfolio
  { href: '/dashboard/deposit', label: 'Deposit Funds', icon: Wallet },
  { href: '/dashboard/withdrawal', label: 'Withdraw Funds', icon: ArrowUpCircle },
  { href: '/dashboard/transactions', label: 'Transactions', icon: History },
];

const secondaryNavItems = [
  { href: '/dashboard/settings', label: 'Settings', icon: Settings },
  { href: '/dashboard/support', label: 'Support', icon: LifeBuoy },
];

export default function DashboardSidebar() {
  const pathname = usePathname();
  const { appUser, logout } = useAuth(); // Changed user to appUser to match context

  const getInitials = (name?: string | null) => { // Added null check for name
    if (!name) return 'FP';
    const parts = name.split(' ').map(n => n[0]);
    if (parts.length > 2) return parts.slice(0, 2).join('').toUpperCase();
    return parts.join('').toUpperCase();
  };

  return (
    <aside className="hidden md:flex md:flex-col md:w-64 border-r bg-background">
      <div className="flex h-16 items-center border-b px-6 shrink-0">
        <Link href="/dashboard" className="flex items-center gap-2 font-semibold">
          <Coins className="h-7 w-7 text-primary" />
          <span className="text-lg text-primary">FPX Dashboard</span>
        </Link>
      </div>
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        {mainNavItems.map((item) => (
          <Button
            key={item.label}
            variant={pathname === item.href ? 'secondary' : 'ghost'}
            className={cn(
              'w-full justify-start text-base py-2.5 px-3',
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
      <Separator className="my-2 mx-3" />
      <nav className="px-3 py-4 space-y-1 shrink-0">
         {secondaryNavItems.map((item) => (
          <Button
            key={item.label}
            variant={pathname.startsWith(item.href) ? 'secondary' : 'ghost'}
            className={cn(
              'w-full justify-start text-base py-2.5 px-3',
              pathname.startsWith(item.href) && 'font-semibold'
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
          className="w-full justify-start text-muted-foreground hover:text-destructive hover:bg-destructive/10 text-base py-2.5 px-3"
          onClick={logout}
        >
          <LogOut className="mr-3 h-5 w-5" />
          Logout
        </Button>
      </nav>
       {appUser && ( // Changed user to appUser
        <div className="mt-auto border-t p-4">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
                <AvatarImage 
                src={`https://placehold.co/40x40.png?text=${getInitials(appUser.username)}`} 
                alt={appUser.username || "User"}
                data-ai-hint="user avatar"
                />
                <AvatarFallback>{getInitials(appUser.username)}</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-medium leading-none">{appUser.first_name && appUser.last_name ? `${appUser.first_name} ${appUser.last_name}` : appUser.username}</p>
              <p className="text-xs text-muted-foreground">{appUser.email}</p>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}
