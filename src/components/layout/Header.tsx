
"use client";

import Link from "next/link";
import { Coins, Menu, X, LogOut, LayoutDashboard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetClose } from "@/components/ui/sheet";
import { useState } from "react";
import { ThemeToggleButton } from "@/components/ThemeToggleButton";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/contexts/AuthContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const navItems = [
  { href: "/quick-start", label: "Quick Start" },
  { href: "/your-account", label: "Your Account", authRequired: true }, // Example: auth required
  { href: "/trading-platforms", label: "Trading Platforms" },
  { href: "/trading", label: "Trading" },
  { href: "/markets", label: "Markets" },
  { href: "/pricing", label: "Pricing" },
  // { href: "/partners", label: "Partners" }, // Removed as per dashboard structure
  // { href: "/resources", label: "Resources" }, // Removed
  { href: "/contact", label: "Contact" },
];


export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, logout, loading } = useAuth();

  const getInitials = (name?: string) => {
    if (!name) return "FP";
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  }

  const displayedNavItems = navItems.filter(item => !item.authRequired || (item.authRequired && user));
  const desktopNavLimit = 5;


  return (
    <header className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 w-full border-b">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2">
          <Coins className="h-8 w-8 text-primary" />
          <span className="text-xl font-bold text-primary">FPX Markets</span>
        </Link>

        <nav className="hidden md:flex items-center space-x-4 lg:space-x-6">
          {displayedNavItems.slice(0, desktopNavLimit).map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
            >
              {item.label}
            </Link>
          ))}
          {displayedNavItems.length > desktopNavLimit && (
             <Link
              href="/more" 
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
            >
              More...
            </Link>
          )}
        </nav>

        <div className="flex items-center gap-3">
          <ThemeToggleButton />
          {loading ? (
            <div className="hidden md:flex items-center gap-2">
              <div className="h-9 w-20 bg-muted rounded-md animate-pulse"></div>
              <div className="h-9 w-32 bg-muted rounded-md animate-pulse"></div>
            </div>
          ) : user ? (
             <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                  <Avatar className="h-9 w-9">
                    <AvatarImage src={user.profilePictureUrl || `https://placehold.co/100x100.png?text=${getInitials(user.username)}`} alt={user.username} data-ai-hint="profile avatar" />
                    <AvatarFallback>{getInitials(user.username)}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{user.username}</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/dashboard">
                    <LayoutDashboard className="mr-2 h-4 w-4" />
                    Dashboard
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                   <Link href="/dashboard/profile">
                    <Coins className="mr-2 h-4 w-4" /> {/* Placeholder icon */}
                    Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Button variant="outline" size="sm" className="hidden md:inline-flex" asChild>
                <Link href="/login">Login</Link>
              </Button>
              <Button variant="accent" size="sm" className="hidden md:inline-flex" asChild>
                <Link href="/signup">Sign Up</Link>
              </Button>
            </>
          )}
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Open menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-full max-w-xs bg-background p-6">
              <div className="flex flex-col space-y-5 h-full">
                <div className="flex justify-between items-center">
                   <Link href="/" className="flex items-center gap-2" onClick={() => setIsMobileMenuOpen(false)}>
                    <Coins className="h-7 w-7 text-primary" />
                    <span className="text-lg font-bold text-primary">FPX Markets</span>
                  </Link>
                  <SheetClose asChild>
                     <Button variant="ghost" size="icon">
                        <X className="h-6 w-6" />
                        <span className="sr-only">Close menu</span>
                      </Button>
                  </SheetClose>
                </div>
                <Separator />
                <nav className="flex flex-col space-y-3 flex-grow">
                  {displayedNavItems.map((item) => (
                    <Link
                      key={item.label}
                      href={item.href}
                      className="text-base font-medium text-foreground transition-colors hover:text-primary py-1.5"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {item.label}
                    </Link>
                  ))}
                </nav>
                <Separator />
                 <div className="flex flex-col space-y-3 pt-4">
                  {loading ? (
                     <>
                      <div className="h-10 w-full bg-muted rounded-md animate-pulse"></div>
                      <div className="h-10 w-full bg-muted rounded-md animate-pulse"></div>
                    </>
                  ) : user ? (
                    <>
                     <Button variant="default" className="w-full" asChild onClick={() => setIsMobileMenuOpen(false)}>
                       <Link href="/dashboard">Dashboard</Link>
                      </Button>
                      <Button variant="outline" className="w-full" onClick={() => { logout(); setIsMobileMenuOpen(false); }}>
                        Logout
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button variant="outline" className="w-full" asChild onClick={() => setIsMobileMenuOpen(false)}>
                        <Link href="/login">Login</Link>
                      </Button>
                      <Button variant="accent" className="w-full" asChild onClick={() => setIsMobileMenuOpen(false)}>
                        <Link href="/signup">Sign Up</Link>
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
