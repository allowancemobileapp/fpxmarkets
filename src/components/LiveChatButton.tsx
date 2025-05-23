'use client';

import { Button } from '@/components/ui/button';
import { MessageCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { usePathname } from 'next/navigation';

export default function LiveChatButton() {
  const { toast } = useToast();
  const pathname = usePathname();

  // Don't show on dashboard pages
  if (pathname && pathname.startsWith('/dashboard')) {
    return null;
  }

  const handleChatClick = () => {
    toast({
      title: "Live Chat",
      description: "Our live chat feature is coming soon! In the meantime, please visit our Contact Us page.",
      duration: 5000,
    });
  };

  return (
    <Button
      variant="accent"
      size="icon"
      className="fixed bottom-6 right-6 rounded-full h-14 w-14 shadow-lg z-50 flex items-center justify-center transition-transform hover:scale-110"
      onClick={handleChatClick}
      aria-label="Open Live Chat"
    >
      <MessageCircle className="h-7 w-7" />
    </Button>
  );
}
