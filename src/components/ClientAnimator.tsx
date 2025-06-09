
'use client';

import type { ReactNode } from 'react';
import AnimatedSection from '@/components/AnimatedSection'; // Your existing animation component

interface ClientAnimatorProps {
  children: ReactNode;
  className?: string;
  delay?: number;
}

export default function ClientAnimator({ children, className, delay }: ClientAnimatorProps) {
  return (
    <AnimatedSection className={className} delay={delay}>
      {children}
    </AnimatedSection>
  );
}
