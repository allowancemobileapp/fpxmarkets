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

// New User Type
export interface User {
  id: string;
  email: string;
  username: string;
  firstName?: string;
  lastName?: string;
  accountType?: string;
  phoneNumber?: string;
  country?: string;
  profileCompleted: boolean;
  pinSetupCompleted: boolean;
}

// Signup Form Schema
export const SignupFormSchema = z.object({
  accountType: z.enum(['Beginner', 'Personal', 'Professional', 'Corporate'], { required_error: "Account type is required." }),
  firstName: z.string().min(2, "First name must be at least 2 characters."),
  lastName: z.string().min(2, "Last name must be at least 2 characters."),
  username: z.string().min(3, "Username must be at least 3 characters."),
  email: z.string().email("Invalid email address."),
  phoneNumber: z.string().min(7, "Phone number seems too short.").optional(), // Simplified validation
  country: z.string().min(2, "Country is required."),
  password: z.string().min(8, "Password must be at least 8 characters."),
  confirmPassword: z.string(),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords do not match.",
  path: ["confirmPassword"],
});
export type SignupFormValues = z.infer<typeof SignupFormSchema>;

// Login Form Schema
export const LoginFormSchema = z.object({
  email: z.string().email("Invalid email address."),
  password: z.string().min(1, "Password is required."),
});
export type LoginFormValues = z.infer<typeof LoginFormSchema>;

// Trading PIN Setup Schema
export const PinSetupFormSchema = z.object({
  pin1: z.string().length(1, "Required").regex(/^\d$/, "Must be a digit"),
  pin2: z.string().length(1, "Required").regex(/^\d$/, "Must be a digit"),
  pin3: z.string().length(1, "Required").regex(/^\d$/, "Must be a digit"),
  pin4: z.string().length(1, "Required").regex(/^\d$/, "Must be a digit"),
  confirmPin1: z.string().length(1, "Required").regex(/^\d$/, "Must be a digit"),
  confirmPin2: z.string().length(1, "Required").regex(/^\d$/, "Must be a digit"),
  confirmPin3: z.string().length(1, "Required").regex(/^\d$/, "Must be a digit"),
  confirmPin4: z.string().length(1, "Required").regex(/^\d$/, "Must be a digit"),
}).refine(data => 
  `${data.pin1}${data.pin2}${data.pin3}${data.pin4}` === `${data.confirmPin1}${data.confirmPin2}${data.confirmPin3}${data.confirmPin4}`, {
  message: "PINs do not match.",
  path: ["confirmPin4"], // Or a general path
});
export type PinSetupFormValues = z.infer<typeof PinSetupFormSchema>;

export type AccountType = 'Beginner' | 'Personal' | 'Professional' | 'Corporate';
