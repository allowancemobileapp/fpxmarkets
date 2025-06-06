
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Link from 'next/link';

export default function HeroSection() {
  return (
    <section className="relative bg-gradient-to-br from-primary/10 via-background to-secondary/10 py-20 md:py-32">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <Card className="max-w-3xl mx-auto p-8 md:p-12 shadow-xl rounded-xl bg-background/80 backdrop-blur-sm">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-primary">
            Trade the World with <span className="text-accent">FPX Markets</span>
          </h1>
          <p className="mt-6 max-w-xl mx-auto text-lg sm:text-xl text-muted-foreground">
            Access global markets with competitive pricing, advanced platforms, and dedicated support. Start your trading journey today.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row justify-center items-center gap-4">
            <Button asChild variant="accent" size="lg" className="w-full sm:w-auto transition-transform hover:scale-105 text-base py-3">
              <Link href="/signup">Open Live Account</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="w-full sm:w-auto hover:bg-primary/5 transition-transform hover:scale-105 text-base py-3">
              {/* We can link this to a specific page about demo accounts later */}
              <Link href="/signup">Try Demo Account</Link>
            </Button>
          </div>
        </Card>
      </div>
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <Image
          src="https://picsum.photos/seed/heroBgFinancial/1920/1080"
          alt="Abstract financial background"
          layout="fill"
          objectFit="cover"
          className="opacity-10 dark:opacity-5"
          data-ai-hint="abstract finance technology"
          priority
        />
      </div>
    </section>
  );
}
