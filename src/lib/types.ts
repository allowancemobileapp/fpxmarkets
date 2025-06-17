
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
  profile_image_url?: string | null; // Added profile image URL
  account_type: AccountType | null; // This is the plan NAME like 'Beginner', 'Pro', derived from trading_plans.name
  trading_plan_id?: number | null;
  phone_number: string | null;
  country_code: string | null;
  profile_completed_at: string | null; // ISO date string
  pin_setup_completed_at: string | null; // ISO date string
  is_active?: boolean;
  is_email_verified?: boolean;
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
  firstName: z.string().min(2, "First name must be at least 2 characters.").max(100),
  lastName: z.string().min(2, "Last name must be at least 2 characters.").max(100),
  username: z.string().min(3, "Username must be at least 3 characters.").max(100).regex(/^[a-zA-Z0-9_]+$/, "Username can only contain letters, numbers, and underscores."),
  accountType: z.enum(accountTypeValues, { required_error: "Account type is required." }),
  phoneNumber: z.string().min(7, "Phone number seems too short.").max(50).optional().or(z.literal('')),
  country: z.string().length(2, "Country selection is required."), // Expects 2-letter country code
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


// Schema for the profile update form on the client-side
export const UpdateProfileFormSchema = z.object({
  firstName: z.string().min(1, "First name is required.").max(100).optional().or(z.literal('')),
  lastName: z.string().min(1, "Last name is required.").max(100).optional().or(z.literal('')),
  username: z.string().min(3, "Username must be at least 3 characters.").max(100).regex(/^[a-zA-Z0-9_]+$/, "Username can only contain letters, numbers, and underscores.").optional().or(z.literal('')),
  phoneNumber: z.string().max(50).optional().or(z.literal('')), // Making min length optional for clearing the field
  country_code: z.string().length(2, "Country selection is required.").optional().or(z.literal('')),
  profile_image_url: z.string().url("Invalid URL format for profile image.").optional().nullable(), // Added
});
export type UpdateProfileFormValues = z.infer<typeof UpdateProfileFormSchema>;


// Schema for the API request payload when updating a profile
export const UpdateProfileRequestSchema = z.object({
  firebaseAuthUid: z.string(), // Used for identification
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  username: z.string().optional(),
  phoneNumber: z.string().optional(),
  country_code: z.string().length(2).optional(),
  profile_image_url: z.string().url().optional().nullable(), // Added
});
export type UpdateProfilePayload = z.infer<typeof UpdateProfileRequestSchema>;


// For /api/auth/register-user, the payload comes from SignupDetailsFormValues
export const RegisterUserRequestSchema = SignupDetailsFormSchema.extend({
  email: z.string().email(), // Email comes from Firebase user
  firebaseAuthUid: z.string(),
  profile_image_url: z.string().url().optional().nullable(), // Added, though likely null at this stage
}).transform(data => ({
    ...data,
    country_code: data.country, // The 'country' field from form IS the code
  }));
export type RegisterUserPayload = z.infer<typeof RegisterUserRequestSchema>;

export const SetupPinRequestSchema = z.object({
  firebaseAuthUid: z.string(),
  pin: z.string().length(4).regex(/^\d{4}$/), // The actual 4-digit PIN
});
export type SetupPinPayload = z.infer<typeof SetupPinRequestSchema>;

// Bank Withdrawal Form Schema
export const BankWithdrawalFormSchema = z.object({
  amountUSD: z.preprocess(
    (val) => parseFloat(z.string().parse(val)),
    z.number().min(50, "Withdrawal amount must be at least $50.")
  ),
  bankName: z.string().min(3, "Bank name is required.").max(100),
  accountHolderName: z.string().min(3, "Account holder name is required.").max(100),
  accountNumber: z.string().min(5, "Account number is required.").max(30).regex(/^[a-zA-Z0-9-]+$/, "Account number contains invalid characters."),
  swiftBic: z.string().min(8, "SWIFT/BIC code must be 8-11 characters.").max(11).regex(/^[A-Z0-9]{8,11}$/, "Invalid SWIFT/BIC code format.").optional().or(z.literal('')),
  bankCountry: z.string().length(2, "Bank country is required."),
  iban: z.string().optional().or(z.literal('')),
  sortCode: z.string().optional().or(z.literal('')),
  routingNumber: z.string().optional().or(z.literal('')),
  notes: z.string().max(200, "Notes cannot exceed 200 characters.").optional().or(z.literal('')),
});
export type BankWithdrawalFormValues = z.infer<typeof BankWithdrawalFormSchema>;

// BTC Withdrawal Form Schema
export const BTCWithdrawalFormSchema = z.object({
  amountUSD: z.preprocess(
    (val) => parseFloat(z.string().parse(val)),
    z.number().min(20, "BTC withdrawal amount must be at least $20 USD equivalent.") // Example minimum for BTC
  ),
  btcAddress: z.string()
    .min(26, "BTC address seems too short.")
    .max(62, "BTC address seems too long.")
    // Basic regex for common BTC address formats (P2PKH, P2SH, Bech32), not exhaustive
    .regex(/^(bc1|[13])[a-zA-HJ-NP-Z0-9]{25,61}$/, "Invalid BTC wallet address format."),
  notes: z.string().max(200, "Notes cannot exceed 200 characters.").optional().or(z.literal('')),
});
export type BTCWithdrawalFormValues = z.infer<typeof BTCWithdrawalFormSchema>;
    