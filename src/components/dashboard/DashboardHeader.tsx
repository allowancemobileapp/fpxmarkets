
'use client';

import Link from 'next/link';
import {
  Menu,
  Search,
  Bell,
  Coins,
  LogOut,
  LayoutDashboard,
  UserCircle,
  Settings,
  LifeBuoy,
  Wallet,
  History,
  LineChart,
  Users,
  Briefcase,
  ArrowUpCircle, // Added for Withdrawal
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Sheet, SheetContent, SheetTrigger, SheetClose } from '@/components/ui/sheet';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/contexts/AuthContext';
import { ThemeToggleButton } from '@/components/ThemeToggleButton';
import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

// Define Home icon alias immediately after imports
const HomeIcon = LayoutDashboard; 

const sidebarNavItems = [
  { href: '/dashboard', label: 'Home', icon: HomeIcon },
  { href: '/dashboard/profile', label: 'Profile', icon: UserCircle },
  { href: '/dashboard/markets', label: 'Market', icon: LineChart },
  { href: '/dashboard/copy-trading', label: 'Copy Trading', icon: Users },
  { href: '/dashboard/portfolio', label: 'Portfolio', icon: Briefcase },
  { href: '/dashboard/deposit', label: 'Deposit Funds', icon: Wallet },
  { href: '/dashboard/withdrawal', label: 'Withdraw Funds', icon: ArrowUpCircle }, // Added Withdrawal
  { href: '/dashboard/transactions', label: 'Transactions', icon: History },
  { href: '/dashboard/settings', label: 'Settings', icon: Settings },
  { href: '/dashboard/support', label: 'Support', icon: LifeBuoy },
];


export default function DashboardHeader() {
  const { user, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();


  const getInitials = (name?: string) => {
    if (!name) return 'FP';
    const parts = name.split(' ').map(n => n[0]);
    if (parts.length > 2) return parts.slice(0, 2).join('').toUpperCase();
    return parts.join('').toUpperCase();
  };

  const getActivePageLabel = () => {
    for (const item of sidebarNavItems) {
      // Exact match for /dashboard, prefix match for others
      if (item.href === '/dashboard' && pathname === '/dashboard') {
        return item.label;
      }
      if (item.href !== '/dashboard' && pathname.startsWith(item.href)) {
        return item.label;
      }
    }
    return 'Dashboard'; // Default
  };

  return (
    <header className="flex h-16 items-center justify-between border-b bg-background px-4 sm:px-6 lg:px-8 shrink-0">
      <div className="flex items-center gap-4">
        <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="outline" size="icon">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle navigation menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="flex flex-col p-0 w-[280px] sm:w-[320px]"> {/* Increased width */}
            <div className="flex h-16 items-center border-b px-6 shrink-0">
                <Link href="/dashboard" className="flex items-center gap-2 font-semibold" onClick={() => setIsMobileMenuOpen(false)}>
                <Coins className="h-7 w-7 text-primary" />
                <span className="text-lg text-primary">FPX Dashboard</span>
                </Link>
            </div>
            <nav className="grid gap-1 text-base font-medium p-4 flex-1 overflow-y-auto"> {/* Reduced gap, text-base */}
              {sidebarNavItems.map((item) => (
                 <SheetClose asChild key={item.label}>
                    <Link
                    href={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={cn(
                        "flex items-center gap-3 rounded-lg px-3 py-2.5 text-muted-foreground transition-all hover:text-primary hover:bg-muted", // Adjusted padding
                        pathname === item.href && "bg-muted text-primary font-semibold"
                    )}
                    >
                    <item.icon className="h-5 w-5" />
                    {item.label}
                    </Link>
                </SheetClose>
              ))}
            </nav>
            <div className="mt-auto border-t p-4">
                <Button
                variant="ghost"
                className="w-full justify-start text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                onClick={() => { logout(); setIsMobileMenuOpen(false);}}
                >
                <LogOut className="mr-3 h-5 w-5" />
                Logout
                </Button>
            </div>
          </SheetContent>
        </Sheet>
        
         <h1 className="text-lg font-semibold hidden md:block text-foreground">
           {getActivePageLabel()}
         </h1>

      </div>

      <div className="flex items-center gap-2 sm:gap-3 md:gap-4">
        {/* Search can be added here if needed across dashboard */}
        <ThemeToggleButton />
        <Button variant="outline" size="icon" className="relative rounded-full">
          <Bell className="h-5 w-5" />
          <span className="absolute -top-1 -right-1 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-accent"></span>
          </span>
          <span className="sr-only">Toggle notifications</span>
        </Button>
        {user && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                <Avatar className="h-9 w-9">
                  <AvatarImage src={`https://placehold.co/100x100.png?text=${getInitials(user.username)}`} alt={user.username || 'User'} data-ai-hint="user avatar" />
                  <AvatarFallback>{getInitials(user.username)}</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">{user.firstName && user.lastName ? `${user.firstName} ${user.lastName}` : user.username}</p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {user.email}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/dashboard/profile">
                  <UserCircle className="mr-2 h-4 w-4" />
                  Profile
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/dashboard/settings">
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={logout}>
                <LogOut className="mr-2 h-4 w-4" />
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </header>
  );
}
