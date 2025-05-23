
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { LifeBuoy, HelpCircle, MessageSquare, Mail, Phone, Search } from 'lucide-react';
import { Label } from '@/components/ui/label';

const faqItems = [
  {
    question: "How do I make a deposit?",
    answer: "You can make a deposit by navigating to the 'Deposit Funds' section in your dashboard. Select your preferred cryptocurrency, enter the amount in USD, and follow the instructions to send funds to the provided address."
  },
  {
    question: "What is the minimum deposit amount?",
    answer: "The minimum deposit amount depends on your account type. For example, the Beginner plan has a $500 minimum first deposit. Subsequent deposits may have lower or no minimums depending on current promotions."
  },
  {
    question: "How can I change my password or Trading PIN?",
    answer: "You can change your password and Trading PIN in the 'Settings' section under 'Security'. You will typically need to provide your current credentials to make these changes."
  },
  {
    question: "How does Copy Trading work?",
    answer: "Copy Trading allows you to automatically replicate the trades of experienced traders on our platform. Browse available traders in the 'Copy Trading' section, choose one to copy, and allocate funds. Their trades will then be copied to your account proportionally."
  },
   {
    question: "How do I withdraw funds?",
    answer: "Navigate to the 'Withdraw Funds' section in your dashboard. Select your withdrawal method, enter the amount, and provide the necessary details (e.g., wallet address). Withdrawals may take some time to process."
  },
  {
    question: "What trading platforms are available?",
    answer: "FPX Markets offers a WebTrader, mobile apps for iOS and Android, and a downloadable Desktop Trader. Each platform provides robust tools for trading and account management."
  }
];

export default function SupportPage() {
  return (
    <div className="space-y-8">
      <div className="flex items-center">
        <h1 className="text-3xl font-bold tracking-tight text-primary flex items-center">
          <LifeBuoy className="mr-3 h-8 w-8" /> Support Center
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* FAQ Section */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl flex items-center"><HelpCircle className="mr-2 h-6 w-6 text-primary"/>Frequently Asked Questions (FAQ)</CardTitle>
               <div className="relative mt-2">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search FAQs..." className="pl-8 w-full" />
              </div>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                {faqItems.map((item, index) => (
                  <AccordionItem value={`item-${index}`} key={index}>
                    <AccordionTrigger className="text-base hover:no-underline">
                      {item.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-base text-muted-foreground leading-relaxed">
                      {item.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>

          {/* Contact Form Section */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl flex items-center"><MessageSquare className="mr-2 h-6 w-6 text-primary"/>Send Us a Message</CardTitle>
              <CardDescription>Can't find an answer? Fill out the form below.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="support-name">Full Name</Label>
                  <Input id="support-name" placeholder="Your Name" />
                </div>
                <div>
                  <Label htmlFor="support-email">Email Address</Label>
                  <Input id="support-email" type="email" placeholder="you@example.com" />
                </div>
              </div>
              <div>
                <Label htmlFor="support-subject">Subject</Label>
                <Input id="support-subject" placeholder="e.g., Deposit Issue" />
              </div>
              <div>
                <Label htmlFor="support-message">Your Message</Label>
                <Textarea id="support-message" placeholder="Describe your issue or question in detail..." rows={5} />
              </div>
            </CardContent>
            <CardFooter>
              <Button size="lg">Submit Ticket</Button>
            </CardFooter>
          </Card>
        </div>
        
        {/* Contact Information Card */}
        <div className="lg:col-span-1">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl">Other Ways to Reach Us</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                <Mail className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold">Email Support</h4>
                  <p className="text-sm text-muted-foreground">support@fpxmarkets-demo.com</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Phone className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold">Phone Support</h4>
                  <p className="text-sm text-muted-foreground">+1 (800) 555-0199 (Toll-Free)</p>
                  <p className="text-xs text-muted-foreground">Mon-Fri, 9am - 6pm GMT</p>
                </div>
              </div>
               <Button variant="outline" className="w-full">
                <MessageSquare className="mr-2 h-4 w-4" /> Start Live Chat (Coming Soon)
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
