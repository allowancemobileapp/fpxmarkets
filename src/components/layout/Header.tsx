
"use client";

import Link from "next/link";
import { Coins, Menu, X, LogOut, LayoutDashboard, UserCircle, Globe } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetClose, SheetHeader, SheetTitle } from "@/components/ui/sheet"; // Added SheetHeader, SheetTitle
import { useState, useEffect } from "react";
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
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { usePathname } from 'next/navigation';
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/quick-start", label: "Quick Start" },
  { href: "/trading-platforms", label: "Trading Platforms" },
  { href: "/trading", label: "Trading" },
  { href: "/markets", label: "Markets" },
  { href: "/about", label: "About Us" },
  { href: "/copy-trading", label: "Copy Trading" },
  { href: "/pricing", label: "Pricing" },
  { href: "/contact", label: "Contact" },
];


export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, logout, loading: authLoading } = useAuth();
  const pathname = usePathname();
  const { toast } = useToast();
  const [language, setLanguage] = useState("en");
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);


  if (pathname && pathname.startsWith('/dashboard')) {
    return null;
  }

  const getInitials = (name?: string) => {
    if (!name) return "FP";
    const parts = name.split(' ').map(n => n[0]);
    if (parts.length > 2) return parts.slice(0, 2).join('').toUpperCase();
    return parts.join('').toUpperCase();
  }

  const handleLanguageChange = (lang: string) => {
    setLanguage(lang);
    let langName = "English";
    if (lang === 'es') langName = "Español";
    if (lang === 'fr') langName = "Français";
    if (lang === 'de') langName = "Deutsch";
    if (lang === 'zh') langName = "中文 (Chinese)";
    if (lang === 'ja') langName = "日本語 (Japanese)";

    toast({
      title: "Language Switched (UI Demo)",
      description: `Language changed to ${langName}. Actual translation not implemented.`,
    });
  };

  const displayedNavItems = navItems.filter(item => {
    return true;
  });
  const desktopNavLimit = 6;


  return (
    <header className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-40 w-full border-b">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2" onClick={() => setIsMobileMenuOpen(false)}>
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

        <div className="flex items-center gap-2 sm:gap-3">
          <ThemeToggleButton />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <Globe className="h-[1.2rem] w-[1.2rem]" />
                <span className="sr-only">Change language</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Select Language</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuRadioGroup value={language} onValueChange={handleLanguageChange}>
                <DropdownMenuRadioItem value="en">English</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="es">Español</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="fr">Français</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="de">Deutsch</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="zh">中文 (Chinese)</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="ja">日本語 (Japanese)</DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>

          {isClient && authLoading ? (
            <div className="hidden md:flex items-center gap-2">
              <div className="h-9 w-20 bg-muted rounded-md animate-pulse"></div>
              <div className="h-9 w-32 bg-muted rounded-md animate-pulse"></div>
            </div>
          ) : isClient && user ? (
             <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                  <Avatar className="h-9 w-9">
                    <AvatarImage src={`https://placehold.co/100x100.png?text=${getInitials(user.username)}`} alt={user.username || 'User Profile'} data-ai-hint="profile avatar" />
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
                  <Link href="/dashboard">
                    <LayoutDashboard className="mr-2 h-4 w-4" />
                    Dashboard
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                   <Link href="/dashboard/profile">
                    <UserCircle className="mr-2 h-4 w-4" />
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
          ) : isClient ? (
            <>
              <Button variant="outline" size="sm" className="hidden md:inline-flex" asChild>
                <Link href="/login">Login</Link>
              </Button>
              <Button variant="accent" size="sm" className="hidden md:inline-flex" asChild>
                <Link href="/signup">Sign Up</Link>
              </Button>
            </>
          ) : (
             <div className="hidden md:flex items-center gap-2">
              <div className="h-9 w-20 bg-muted rounded-md animate-pulse"></div>
              <div className="h-9 w-32 bg-muted rounded-md animate-pulse"></div>
            </div>
          )}

          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Open menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-full max-w-xs bg-background p-0"> {/* Changed p-6 to p-0 for header */}
              <SheetHeader className="flex flex-row justify-between items-center p-4 border-b"> {/* Added SheetHeader */}
                <SheetTitle className="sr-only">Main Menu</SheetTitle> {/* Added sr-only SheetTitle */}
                 <Link href="/" className="flex items-center gap-2" onClick={() => setIsMobileMenuOpen(false)}>
                  <Coins className="h-7 w-7 text-primary" />
                  <span className="text-lg font-bold text-primary">FPX Markets</span>
                </Link>
                <SheetClose asChild>
                   <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(false)}>
                      <X className="h-6 w-6" />
                      <span className="sr-only">Close menu</span>
                    </Button>
                </SheetClose>
              </SheetHeader>
              <div className="p-6 flex flex-col space-y-5 h-[calc(100%-4rem)]"> {/* Adjust height for header */}
                <Separator />
                <nav className="flex flex-col space-y-3 flex-grow">
                  {displayedNavItems.map((item) => (
                     <SheetClose asChild key={item.label}>
                        <Link
                        href={item.href}
                        className="text-base font-medium text-foreground transition-colors hover:text-primary py-1.5"
                        onClick={() => setIsMobileMenuOpen(false)}
                        >
                        {item.label}
                        </Link>
                    </SheetClose>
                  ))}
                </nav>
                <Separator />
                 <div className="flex flex-col space-y-3 pt-4">
                  {isClient && authLoading ? (
                     <>
                      <div className="h-10 w-full bg-muted rounded-md animate-pulse"></div>
                      <div className="h-10 w-full bg-muted rounded-md animate-pulse"></div>
                    </>
                  ) : isClient && user ? (
                    <>
                     <SheetClose asChild>
                        <Link
                          href="/dashboard"
                          className={cn(buttonVariants({ variant: "default", size: "default" }), "w-full")}
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                           Dashboard
                        </Link>
                     </SheetClose>
                      <Button variant="outline" className="w-full" onClick={() => { logout(); setIsMobileMenuOpen(false); }}>
                        Logout
                      </Button>
                    </>
                  ) : isClient ? (
                    <>
                      <SheetClose asChild>
                        <Link
                          href="/login"
                          className={cn(buttonVariants({ variant: "outline", size: "default" }), "w-full")}
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                           Login
                        </Link>
                      </SheetClose>
                      <SheetClose asChild>
                         <Link
                          href="/signup"
                          className={cn(buttonVariants({ variant: "accent", size: "default" }), "w-full")}
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                           Sign Up
                        </Link>
                      </SheetClose>
                    </>
                  ) : (
                     <>
                      <div className="h-10 w-full bg-muted rounded-md animate-pulse"></div>
                      <div className="h-10 w-full bg-muted rounded-md animate-pulse"></div>
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

