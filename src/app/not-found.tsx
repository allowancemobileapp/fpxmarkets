
import Link from 'next/link';
import { Button, buttonVariants } from '@/components/ui/button';
import { FileQuestion } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-10rem)] text-center px-6 py-12 bg-background">
      <div className="max-w-md w-full">
        <div className="mx-auto mb-8 flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
          <FileQuestion className="h-10 w-10 text-primary" />
        </div>
        <h1 className="text-5xl sm:text-6xl font-bold text-primary mb-4">404</h1>
        <h2 className="text-2xl sm:text-3xl font-semibold text-foreground mb-6">Page Not Found</h2>
        <p className="text-md sm:text-lg text-muted-foreground mb-10">
          Oops! The page you&apos;re looking for doesn&apos;t seem to exist. It might have been moved, deleted, or you might have typed the address incorrectly.
        </p>
        <Link
          href="/"
          className={cn(
            buttonVariants({ size: "lg", variant: "default" }), // Use buttonVariants to style the Link
            "w-full sm:w-auto"
          )}
        >
          Go Back to Homepage
        </Link>
      </div>
    </div>
  );
}
