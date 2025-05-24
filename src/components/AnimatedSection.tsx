
'use client';

import type { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface AnimatedSectionProps {
  children: ReactNode;
  className?: string;
  delay?: number;
}

const AnimatedSection = ({ children, className, delay = 0 }: AnimatedSectionProps) => {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 30 }} // Start slightly lower and invisible
      whileInView={{ opacity: 1, y: 0 }} // Animate to fully visible and original position
      viewport={{ once: true, amount: 0.1 }} // Trigger when 10% of the element is visible, only once
      transition={{ duration: 0.5, delay: delay, ease: "easeOut" }} // Smooth easeOut transition
    >
      {children}
    </motion.div>
  );
};

export default AnimatedSection;
