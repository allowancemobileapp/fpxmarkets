
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link'; // Import Link

export default function Footer() {
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

  useEffect(() => {
    setCurrentYear(new Date().getFullYear());
  }, []);

  return (
    <footer className="bg-muted/50 border-t">
      <div className="container mx-auto py-6 px-4 sm:px-6 lg:px-8 text-center text-sm text-muted-foreground">
        <p>&copy; {currentYear} FPX Markets. All rights reserved.</p>
        <div className="mt-2 space-x-4">
            <Link href="/privacy-policy" className="hover:text-primary hover:underline">
                Privacy Policy
            </Link>
            <span className="text-muted-foreground/50">|</span>
            {/* Placeholder for Terms of Service link */}
            <Link href="/terms-of-service" className="hover:text-primary hover:underline">
                Terms of Service
            </Link>
        </div>
        <p className="mt-2">
          This is a fictional platform for demonstration purposes only.
        </p>
      </div>
    </footer>
  );
}

    