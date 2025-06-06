
'use client';

import { useState, useEffect, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Send, Bot, User } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

interface ChatWidgetProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ChatWidget({ isOpen, onClose }: ChatWidgetProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Add initial bot message when chat opens for the first time or if messages are empty
    if (isOpen && messages.length === 0) {
      setMessages([
        {
          id: crypto.randomUUID(),
          text: 'Hello! How can I help you today?',
          sender: 'bot',
          timestamp: new Date(),
        },
      ]);
    }
  }, [isOpen, messages.length]);
  
  useEffect(() => {
    // Auto-scroll to bottom when new messages are added
    if (scrollAreaRef.current) {
      const scrollableViewport = scrollAreaRef.current.querySelector('div[data-radix-scroll-area-viewport]');
      if (scrollableViewport) {
        scrollableViewport.scrollTop = scrollableViewport.scrollHeight;
      }
    }
  }, [messages]);


  const handleSendMessage = () => {
    if (inputValue.trim() === '') return;

    const userMessage: Message = {
      id: crypto.randomUUID(),
      text: inputValue.trim(),
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages(prevMessages => [...prevMessages, userMessage]);
    setInputValue('');

    // Simulate bot reply
    setTimeout(() => {
      const botReply: Message = {
        id: crypto.randomUUID(),
        text: "Thanks for your message! A representative will be with you shortly. (This is a demo response)",
        sender: 'bot',
        timestamp: new Date(),
      };
      setMessages(prevMessages => [...prevMessages, botReply]);
    }, 1500);
  };
  
  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if (!open) onClose(); }}>
      <DialogContent
        className="fixed bottom-0 right-0 sm:bottom-6 sm:right-20 m-0 sm:m-0 p-0 w-full h-[calc(100%-4rem)] sm:h-[600px] sm:w-[400px] flex flex-col rounded-none sm:rounded-lg shadow-xl border-none sm:border"
        onInteractOutside={(e) => {
          // Allow closing by clicking outside on desktop, but not mobile where it's more like a full sheet
          if (window.innerWidth < 640) { // sm breakpoint
            e.preventDefault(); 
          }
        }}
      >
        <DialogHeader className="p-4 border-b">
          <DialogTitle className="flex items-center text-lg">
            <Bot className="h-6 w-6 mr-2 text-primary" /> Live Chat Support
          </DialogTitle>
          <DialogClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground sm:hidden">
            {/* Hide default X on mobile, use button below */}
          </DialogClose>
        </DialogHeader>

        <ScrollArea className="flex-grow p-4 bg-muted/20" ref={scrollAreaRef}>
          <div className="space-y-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={cn(
                  'flex items-end gap-2',
                  msg.sender === 'user' ? 'justify-end' : 'justify-start'
                )}
              >
                {msg.sender === 'bot' && (
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      <Bot className="h-5 w-5" />
                    </AvatarFallback>
                  </Avatar>
                )}
                <div
                  className={cn(
                    'max-w-[75%] rounded-lg px-3 py-2 text-sm shadow',
                    msg.sender === 'user'
                      ? 'bg-primary text-primary-foreground rounded-br-none'
                      : 'bg-background text-foreground border rounded-bl-none'
                  )}
                >
                  <p className="whitespace-pre-wrap">{msg.text}</p>
                  <p className="text-xs opacity-70 mt-1 text-right">
                    {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
                {msg.sender === 'user' && (
                  <Avatar className="h-8 w-8">
                     <AvatarFallback className="bg-accent text-accent-foreground">
                      <User className="h-5 w-5" />
                    </AvatarFallback>
                  </Avatar>
                )}
              </div>
            ))}
          </div>
        </ScrollArea>

        <DialogFooter className="p-3 border-t bg-background">
          <div className="flex items-center w-full space-x-2">
            <Input
              type="text"
              placeholder="Type your message..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              className="flex-grow text-sm"
            />
            <Button type="submit" size="icon" onClick={handleSendMessage} disabled={!inputValue.trim()}>
              <Send className="h-4 w-4" />
              <span className="sr-only">Send message</span>
            </Button>
          </div>
        </DialogFooter>
         {/* Mobile specific close button at the bottom */}
        <Button variant="ghost" onClick={onClose} className="sm:hidden w-full rounded-none border-t text-muted-foreground">
            Close Chat
        </Button>
      </DialogContent>
    </Dialog>
  );
}
