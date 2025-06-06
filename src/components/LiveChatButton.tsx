
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { MessageCircle, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { usePathname } from 'next/navigation';
import ChatWidget from './ChatWidget'; // Import the new ChatWidget

export default function LiveChatButton() {
  const { toast } = useToast();
  const pathname = usePathname();
  const [isChatOpen, setIsChatOpen] = useState(false);

  // Don't show on dashboard pages
  if (pathname && pathname.startsWith('/dashboard')) {
    return null;
  }

  const handleChatToggle = () => {
    setIsChatOpen(prev => !prev);
  };

  return (
    <>
      <Button
        variant="accent"
        size="icon"
        className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 rounded-full h-12 w-12 sm:h-14 sm:w-14 shadow-lg z-50 flex items-center justify-center transition-transform hover:scale-110"
        onClick={handleChatToggle}
        aria-label={isChatOpen ? "Close Live Chat" : "Open Live Chat"}
      >
        {isChatOpen ? <X className="h-6 w-6 sm:h-7 sm:w-7" /> : <MessageCircle className="h-6 w-6 sm:h-7 sm:w-7" />}
      </Button>
      <ChatWidget isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
    </>
  );
}
