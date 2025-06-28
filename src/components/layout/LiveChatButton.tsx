'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { MessageSquare } from 'lucide-react';
import { motion } from 'framer-motion';

export default function LiveChatButton() {
  return (
    <motion.div
      initial={{ scale: 0, y: 100 }}
      animate={{ scale: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 1, ease: "easeOut" }}
      className="fixed bottom-6 right-6 z-50"
    >
      <Button
        asChild
        size="icon"
        className="rounded-full w-16 h-16 shadow-lg bg-primary hover:bg-primary/90 hover:scale-105 transition-transform"
        aria-label="Open Live Chat"
      >
        <Link
          href="https://tawk.to/chat/6854ad05a39e6f190afdf00c/1iu5c7o0v"
          target="_blank"
          rel="noopener noreferrer"
        >
          <MessageSquare className="h-8 w-8" />
        </Link>
      </Button>
    </motion.div>
  );
}
