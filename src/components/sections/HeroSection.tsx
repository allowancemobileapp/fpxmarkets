import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export default function HeroSection() {
  return (
    <section className="relative bg-gradient-to-br from-primary/10 via-background to-secondary/10 py-20 md:py-32">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <Card className="max-w-3xl mx-auto p-8 md:p-12 shadow-xl bg-background/80 backdrop-blur-sm">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-primary">
            Trade the World with <span className="text-accent">FPX Markets</span>
          </h1>
          <p className="mt-6 max-w-xl mx-auto text-lg sm:text-xl text-muted-foreground">
            Access global markets with competitive pricing, advanced platforms, and dedicated support. Start your trading journey today.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row justify-center items-center gap-4">
            <Button variant="accent" size="lg" className="w-full sm:w-auto text-accent-foreground hover:bg-accent/90 transition-transform hover:scale-105">
              Open Live Account
            </Button>
            <Button variant="outline" size="lg" className="w-full sm:w-auto hover:bg-primary/5 transition-transform hover:scale-105">
              Try Demo Account
            </Button>
          </div>
        </Card>
      </div>
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <Image
          src="https://picsum.photos/1920/1080?grayscale&blur=2"
          alt="Abstract financial background"
          layout="fill"
          objectFit="cover"
          className="opacity-20"
          data-ai-hint="abstract finance"
        />
      </div>
    </section>
  );
}
