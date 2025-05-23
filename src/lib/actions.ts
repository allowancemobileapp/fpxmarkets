
'use server';

import { 
  ContactFormSchema, type ContactFormValues,
  LoginFormSchema, type LoginFormValues,
  SignupFormSchema, type SignupFormValues,
  PinSetupFormSchema, type PinSetupFormValues, // Import PinSetupFormSchema
  type User 
} from '@/lib/types';
import { generateMarketInsights as generateMarketInsightsFlow, type MarketInsightsInput, type MarketInsightsOutput } from '@/ai/flows/generate-market-insights';

export async function submitContactForm(data: ContactFormValues): Promise<{ success: boolean; message: string }> {
  const validationResult = ContactFormSchema.safeParse(data);
  if (!validationResult.success) {
    return { success: false, message: "Invalid form data. Please check your input." };
  }
  console.log("Contact form submitted:", validationResult.data);
  await new Promise(resolve => setTimeout(resolve, 1000));
  if (validationResult.data.email.includes("fail")) {
    return { success: false, message: "Failed to submit form due to a server error. Please try again." };
  }
  return { success: true, message: "Thank you for your message! We'll be in touch soon." };
}

export async function getAIMarketInsights(input: MarketInsightsInput): Promise<MarketInsightsOutput | { error: string }> {
  try {
    await new Promise(resolve => setTimeout(resolve, 1500));
    const result = await generateMarketInsightsFlow(input);
    return result;
  } catch (error) {
    console.error("Error generating market insights:", error);
    return { error: "Failed to generate market insights. Please try again later." };
  }
}

// Simulated Login Action
export async function handleLogin(data: LoginFormValues): Promise<{ success: boolean; message?: string; user?: User }> {
  const validationResult = LoginFormSchema.safeParse(data);
  if (!validationResult.success) {
    return { success: false, message: "Invalid login data." };
  }

  await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay

  // Simulate user lookup
  if (data.email === "user@example.com" && data.password === "password123") {
    const mockUser: User = {
      id: "user123",
      email: "user@example.com",
      username: "TestUser",
      firstName: "Test",
      lastName: "User",
      accountType: "Personal",
      profileCompleted: true, // Assume profile is complete for this mock user
      pinSetupCompleted: false, // PIN needs to be set up
    };
    return { success: true, user: mockUser };
  } else if (data.email === "admin@example.com" && data.password === "password123") {
     const mockUser: User = {
      id: "admin123",
      email: "admin@example.com",
      username: "AdminUser",
      firstName: "Admin",
      lastName: "User",
      accountType: "Professional",
      profileCompleted: true, 
      pinSetupCompleted: true, // PIN already set for admin
    };
    return { success: true, user: mockUser };
  }
  return { success: false, message: "Invalid email or password." };
}

// Simulated Signup Action
export async function handleSignup(data: SignupFormValues): Promise<{ success: boolean; message?: string; user?: Partial<User> }> {
  const validationResult = SignupFormSchema.safeParse(data);
  if (!validationResult.success) {
    // Construct a more detailed error message from validation issues
    const errorMessages = validationResult.error.errors.map(err => `${err.path.join('.')}: ${err.message}`).join(', ');
    return { success: false, message: `Invalid signup data: ${errorMessages}` };
  }
  
  await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay

  // Simulate username uniqueness check (very basic)
  if (data.username === "existinguser") {
    return { success: false, message: "Username already taken." };
  }
  // Simulate email uniqueness check (very basic)
   if (data.email === "existing@example.com") {
    return { success: false, message: "Email already registered." };
  }

  // Simulate successful signup and user creation
  const newUser: Partial<User> = {
    id: `user-${Date.now()}`, // Mock ID
    email: data.email,
    username: data.username,
    firstName: data.firstName,
    lastName: data.lastName,
    accountType: data.accountType,
    phoneNumber: data.phoneNumber,
    country: data.country,
    profileCompleted: true, // This form completes the profile
    pinSetupCompleted: false, // PIN setup is the next step
  };
  console.log("Simulated signup for:", newUser);
  // In a real app, you would call Firebase Auth createUserWithEmailAndPassword
  // and then save additional user details to Firestore.
  return { success: true, user: newUser };
}

// Simulated PIN Setup Action
export async function handlePinSetup(data: { pin: string, userId: string }): Promise<{ success: boolean; message?: string }> {
  // Basic validation for PIN format (e.g., 4 digits) can be added here if not fully covered by Zod on client
  if (!/^\d{4}$/.test(data.pin)) {
    return { success: false, message: "Invalid PIN format. Must be 4 digits." };
  }

  await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay
  
  console.log(`Simulated PIN setup for user ${data.userId} with PIN: ${data.pin}`);
  // In a real app, you would securely hash and store the PIN in Firestore for the user.
  // For example: /users/{userId}/private/pinHash
  
  // Simulate a potential error
  if (data.pin === "0000") {
      return { success: false, message: "PIN cannot be '0000'. Please choose a different PIN." };
  }

  return { success: true, message: "Trading PIN successfully set." };
}
