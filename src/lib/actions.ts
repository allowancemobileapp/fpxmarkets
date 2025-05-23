
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
    // Removed artificial delay for faster debugging
    // await new Promise(resolve => setTimeout(resolve, 1500)); 
    console.log("[Action:getAIMarketInsights] Calling generateMarketInsightsFlow with input:", input);
    const result = await generateMarketInsightsFlow(input);
    console.log("[Action:getAIMarketInsights] Received result:", result);
    return result;
  } catch (error: any) {
    console.error("[Action:getAIMarketInsights] Error generating market insights:", error);
    let errorMessage = "Failed to generate market insights. Please try again later.";
    if (error.message) {
      errorMessage += ` Details: ${error.message}`;
    }
    if (error.stack) {
      console.error("[Action:getAIMarketInsights] Error stack:", error.stack);
    }
    // Check for specific Genkit or API errors if possible
    if (error.response && error.response.data) {
        console.error("[Action:getAIMarketInsights] API Error Data:", error.response.data);
        errorMessage += ` API Response: ${JSON.stringify(error.response.data)}`;
    }
    return { error: errorMessage };
  }
}

// Simulated Login Action
export async function handleLogin(data: LoginFormValues): Promise<{ success: boolean; message?: string; user?: User }> {
  const validationResult = LoginFormSchema.safeParse(data);
  if (!validationResult.success) {
    return { success: false, message: "Invalid login data." };
  }

  await new Promise(resolve => setTimeout(resolve, 1000)); 

  if (data.email === "user@example.com" && data.password === "password123") {
    const mockUser: User = {
      id: "user123",
      email: "user@example.com",
      username: "TestUser",
      firstName: "Test",
      lastName: "User",
      accountType: "Personal",
      profileCompleted: true, 
      pinSetupCompleted: false, 
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
      pinSetupCompleted: true, 
    };
    return { success: true, user: mockUser };
  }
  return { success: false, message: "Invalid email or password." };
}

// Simulated Signup Action
export async function handleSignup(data: SignupFormValues): Promise<{ success: boolean; message?: string; user?: Partial<User> }> {
  const validationResult = SignupFormSchema.safeParse(data);
  if (!validationResult.success) {
    const errorMessages = validationResult.error.errors.map(err => `${err.path.join('.')}: ${err.message}`).join(', ');
    return { success: false, message: `Invalid signup data: ${errorMessages}` };
  }
  
  await new Promise(resolve => setTimeout(resolve, 1000)); 

  if (data.username === "existinguser") {
    return { success: false, message: "Username already taken." };
  }
   if (data.email === "existing@example.com") {
    return { success: false, message: "Email already registered." };
  }

  const newUser: Partial<User> = {
    id: `user-${Date.now()}`, 
    email: data.email,
    username: data.username,
    firstName: data.firstName,
    lastName: data.lastName,
    accountType: data.accountType,
    phoneNumber: data.phoneNumber,
    country: data.country,
    profileCompleted: true, 
    pinSetupCompleted: false, 
  };
  console.log("Simulated signup for:", newUser);
  return { success: true, user: newUser };
}

// Simulated PIN Setup Action
export async function handlePinSetup(data: { pin: string, userId: string }): Promise<{ success: boolean; message?: string }> {
  if (!/^\d{4}$/.test(data.pin)) {
    return { success: false, message: "Invalid PIN format. Must be 4 digits." };
  }

  await new Promise(resolve => setTimeout(resolve, 1000)); 
  
  console.log(`Simulated PIN setup for user ${data.userId} with PIN: ${data.pin}`);
  
  if (data.pin === "0000") {
      return { success: false, message: "PIN cannot be '0000'. Please choose a different PIN." };
  }

  return { success: true, message: "Trading PIN successfully set." };
}
