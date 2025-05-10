'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ContactFormSchema, type ContactFormValues } from '@/lib/types';
import { submitContactForm } from '@/lib/actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { Mail, Loader2 } from 'lucide-react';
import { useState } from 'react';

export default function ContactForm() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<ContactFormValues>({
    resolver: zodResolver(ContactFormSchema),
    defaultValues: {
      name: '',
      email: '',
      message: '',
    },
  });

  async function onSubmit(values: ContactFormValues) {
    setIsLoading(true);
    const result = await submitContactForm(values);
    setIsLoading(false);

    if (result.success) {
      toast({
        title: "Message Sent!",
        description: result.message,
        variant: "default", // Or use a custom "success" variant if defined
      });
      form.reset();
    } else {
      toast({
        title: "Submission Failed",
        description: result.message,
        variant: "destructive",
      });
    }
  }

  return (
    <section className="py-16 sm:py-24 bg-secondary/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <Card className="max-w-2xl mx-auto shadow-lg">
          <CardHeader className="text-center">
             <div className="inline-flex items-center justify-center bg-primary/10 p-3 rounded-full mx-auto mb-4">
               <Mail className="h-10 w-10 text-primary" />
            </div>
            <CardTitle className="text-2xl sm:text-3xl font-bold text-primary">Get In Touch</CardTitle>
            <CardDescription className="text-md text-muted-foreground">
              Have questions or need support? Fill out the form below, and we'll get back to you.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor="name-input" className="text-lg">Full Name</FormLabel>
                      <FormControl>
                        <Input id="name-input" placeholder="John Doe" {...field} className="text-base py-3 px-4"/>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor="email-input" className="text-lg">Email Address</FormLabel>
                      <FormControl>
                        <Input id="email-input" type="email" placeholder="you@example.com" {...field} className="text-base py-3 px-4"/>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor="message-input" className="text-lg">Your Message</FormLabel>
                      <FormControl>
                        <Textarea id="message-input" placeholder="How can we help you today?" {...field} rows={5} className="text-base py-3 px-4"/>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" disabled={isLoading} className="w-full bg-primary text-primary-foreground hover:bg-primary/90 text-lg py-3">
                 {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    'Send Message'
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
