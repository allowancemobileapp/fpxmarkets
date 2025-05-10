"use client";

import Link from "next/link";
import { Coins, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetClose } from "@/components/ui/sheet";
import { useState } from "react";
import { ThemeToggleButton } from "@/components/ThemeToggleButton";
import { Separator } from "@/components/ui/separator";

const navItems = [
  { href: "/quick-start", label: "Quick Start" },
  { href: "/your-account", label: "Your Account" },
  { href: "/trading-platforms", label: "Trading Platforms" },
  { href: "/trading", label: "Trading" },
  { href: "/markets", label: "Markets" },
  { href: "/pricing", label: "Pricing" },
  { href: "/partners", label: "Partners" },
  { href: "/resources", label: "Resources" },
  { href: "/contact", label: "Contact" },
];

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 w-full border-b">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2">
          <Coins className="h-8 w-8 text-primary" />
          <span className="text-xl font-bold text-primary">FPX Markets</span>
        </Link>

        <nav className="hidden md:flex items-center space-x-4 lg:space-x-6">
          {navItems.slice(0, 5).map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
            >
              {item.label}
            </Link>
          ))}
          {navItems.length > 5 && (
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
          <Button variant="outline" size="sm" className="hidden md:inline-flex">
            Login
          </Button>
          <Button variant="accent" size="sm" className="hidden md:inline-flex">
            Open Live Account
          </Button>
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
                  {navItems.map((item) => (
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
                   <Button variant="outline" className="w-full">
                      Login
                    </Button>
                    <Button variant="accent" className="w-full">
                      Open Live Account
                    </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
