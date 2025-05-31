
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

// User Type for Application Logic (what client components might expect)
export interface AppUser {
  id: string; // This will be the PostgreSQL user ID (uuid)
  firebase_auth_uid: string;
  email: string;
  username: string | null;
  first_name: string | null;
  last_name: string | null;
  account_type: AccountType | null; // This is the plan NAME like 'Beginner', 'Pro', derived from trading_plans.name
  trading_plan_id?: number | null; // Added for clarity, though account_type (name) is primarily used in frontend
  phone_number: string | null;
  country: string | null; // The form collects full country name. Schema has country_code CHAR(2). API needs to handle this if schema is strict.
  profile_completed_at: string | null; // ISO date string
  pin_setup_completed_at: string | null; // ISO date string
  is_active?: boolean; // Added from user's schema
  is_email_verified?: boolean; // Added from user's schema
  created_at: string; // ISO date string
  updated_at: string; // ISO date string
}

export type AccountType = 'Beginner' | 'Personal' | 'Pro' | 'Professional' | 'Corporate';
export const accountTypeValues: [AccountType, ...AccountType[]] = ['Beginner', 'Personal', 'Pro', 'Professional', 'Corporate'];

// Signup Form Schema (initial Firebase signup)
export const SignupFormSchema = z.object({
  email: z.string().email("Invalid email address."),
  password: z.string().min(8, "Password must be at least 8 characters."),
  confirmPassword: z.string(),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords do not match.",
  path: ["confirmPassword"],
});
export type SignupFormValues = z.infer<typeof SignupFormSchema>;


// Signup Details Form Schema (after Firebase signup, for PG profile)
export const SignupDetailsFormSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters."),
  lastName: z.string().min(2, "Last name must be at least 2 characters."),
  username: z.string().min(3, "Username must be at least 3 characters.").regex(/^[a-zA-Z0-9_]+$/, "Username can only contain letters, numbers, and underscores."),
  accountType: z.enum(accountTypeValues, { required_error: "Account type is required." }),
  phoneNumber: z.string().min(7, "Phone number seems too short.").optional().or(z.literal('')),
  country: z.string().min(2, "Country is required."), // Form collects full country name.
});
export type SignupDetailsFormValues = z.infer<typeof SignupDetailsFormSchema>;


// Login Form Schema
export const LoginFormSchema = z.object({
  email: z.string().email("Invalid email address."),
  password: z.string().min(1, "Password is required."),
});
export type LoginFormValues = z.infer<typeof LoginFormSchema>;

// Trading PIN Setup Schema
export const PinSetupFormSchema = z.object({
  pin: z.string().length(4, "PIN must be 4 digits.").regex(/^\d{4}$/, "PIN must contain only digits."),
  confirmPin: z.string().length(4, "Confirm PIN must be 4 digits.").regex(/^\d{4}$/, "Confirm PIN must contain only digits."),
}).refine(data => data.pin === data.confirmPin, {
  message: "PINs do not match.",
  path: ["confirmPin"], 
});
export type PinSetupFormValues = z.infer<typeof PinSetupFormSchema>;


// Schemas for API requests (matching backend expectations)
export const UpdateProfileRequestSchema = z.object({
  firebaseAuthUid: z.string(), // Used for identification
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  username: z.string().optional(),
  phoneNumber: z.string().optional(),
  country: z.string().optional(),
  // accountType might be updatable through a different flow or not at all by user directly
});
export type UpdateProfilePayload = z.infer<typeof UpdateProfileRequestSchema>;

export const RegisterUserRequestSchema = SignupDetailsFormSchema.extend({
  email: z.string().email(), // Email comes from Firebase user
  firebaseAuthUid: z.string(),
});
export type RegisterUserPayload = z.infer<typeof RegisterUserRequestSchema>;

export const SetupPinRequestSchema = z.object({
  firebaseAuthUid: z.string(),
  pin: z.string().length(4).regex(/^\d{4}$/), // The actual 4-digit PIN
});
export type SetupPinPayload = z.infer<typeof SetupPinRequestSchema>;
