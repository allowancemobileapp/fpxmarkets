import { z } from 'zod';

export const ContactFormSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }).max(50, { message: "Name must be 50 characters or less." }),
  email: z.string().email({ message: "Please enter a valid email." }),
  message: z.string().min(10, { message: "Message must be at least 10 characters." }).max(500, { message: "Message must be 500 characters or less." }),
});
export type ContactFormValues = z.infer<typeof ContactFormSchema>;

export const MarketInsightsFormSchema = z.object({
  interests: z.string().min(3, { message: "Please enter at least one interest (e.g., Forex, Shares)." }).max(100, { message: "Interests must be 100 characters or less." }),
});
export type MarketInsightsFormValues = z.infer<typeof MarketInsightsFormSchema>;
