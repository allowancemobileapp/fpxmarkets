
'use server';

import {
  ContactFormSchema, type ContactFormValues,
  LoginFormSchema, type LoginFormValues,
  SignupFormSchema, type SignupFormValues,
  PinSetupFormSchema, type PinSetupFormValues, // Import PinSetupFormSchema
  type AppUser // Changed from User to AppUser
} from '@/lib/types';
import { generateMarketInsights as generateMarketInsightsFlow, type MarketInsightsInput, type MarketInsightsOutput } from '@/ai/flows/generate-market-insights';
import { getImageByContextTag, type ImageData } from '@/lib/imageService'; // Import imageService

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
    if (error.response && error.response.data) {
        console.error("[Action:getAIMarketInsights] API Error Data:", error.response.data);
        errorMessage += ` API Response: ${JSON.stringify(error.response.data)}`;
    }
    return { error: errorMessage };
  }
}

// Simulated Login Action
export async function handleLogin(data: LoginFormValues): Promise<{ success: boolean; message?: string; user?: AppUser }> { // Changed User to AppUser
  const validationResult = LoginFormSchema.safeParse(data);
  if (!validationResult.success) {
    return { success: false, message: "Invalid login data." };
  }

  await new Promise(resolve => setTimeout(resolve, 1000));

  // This is a mock login. In a real app, this would interact with Firebase Auth and your backend.
  // For now, we assume that if login is successful, the AuthContext would be updated with the actual AppUser from the database.
  // The redirect logic is primarily handled by AuthContext based on FirebaseUser and AppUser state.

  // Example successful login (replace with actual Firebase logic client-side, and DB check server-side if needed)
  if (data.email === "user@example.com" && data.password === "password123") {
    // In a real scenario, you'd fetch the full AppUser profile here after successful Firebase auth
    const mockUser: AppUser = {
      id: "user123",
      firebase_auth_uid: "firebaseUser123",
      email: "user@example.com",
      username: "TestUser",
      first_name: "Test",
      last_name: "User",
      account_type: "Personal",
      profile_completed_at: new Date().toISOString(),
      pin_setup_completed_at: null, // Example: PIN not set up
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    return { success: true, user: mockUser };
  }
  return { success: false, message: "Invalid email or password." };
}


// Simulated Signup Action - Note: Actual Firebase signup is client-side.
// This server action might be used for post-Firebase-signup profile creation.
export async function handleSignup(data: SignupFormValues): Promise<{ success: boolean; message?: string; user?: Partial<AppUser> }> { // Changed User to AppUser
  const validationResult = SignupFormSchema.safeParse(data);
  if (!validationResult.success) {
    const errorMessages = validationResult.error.errors.map(err => `${err.path.join('.')}: ${err.message}`).join(', ');
    return { success: false, message: `Invalid signup data: ${errorMessages}` };
  }

  await new Promise(resolve => setTimeout(resolve, 1000));

  // This simulates creating a user profile record after Firebase auth creates the user.
  // The actual Firebase user creation (createUserWithEmailAndPassword) happens on the client via AuthContext.
  // This action would typically be called from SignupDetailsForm to save the profile to your PG database.

  // For demonstration, we'll just log it.
  console.log("Simulated backend signup processing for email:", data.email);
  // In a real app, you'd now save this to your database.
  // The AuthContext would then fetch this AppUser profile.

  // Return a partial user object, as the full AppUser object comes from the database fetch.
  const partialUser: Partial<AppUser> = {
    email: data.email,
    // other fields would be null/undefined until profile is fully completed
  };
  return { success: true, user: partialUser, message: "Signup process initiated. Complete profile next." };
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
  // In a real app, you would update the user's record in your database (e.g., set pin_hash and pin_setup_completed_at)
  // The AuthContext would then refetch/update the AppUser state.

  return { success: true, message: "Trading PIN successfully set." };
}

/**
 * Server Action to get a specific image by its context tag.
 * Uses the imageService.
 */
export async function getSpecificImageByContextTag(contextTag: string): Promise<ImageData> {
  console.log(`[Action:getSpecificImageByContextTag] Fetching image for context_tag: ${contextTag}`);
  try {
    // imageService.getImageByContextTag already handles fallbacks.
    const imageData = await getImageByContextTag(contextTag);
    console.log(`[Action:getSpecificImageByContextTag] Fetched image data for ${contextTag}:`, imageData);
    return imageData;
  } catch (error) {
    console.error(`[Action:getSpecificImageByContextTag] Error fetching image for ${contextTag}:`, error);
    // Return default placeholder data in case of an unexpected error from the service itself.
    // Though imageService is designed to return placeholders on its own.
    return {
      imageUrl: 'https://placehold.co/600x400.png', // Default fallback
      altText: 'Error loading image'
    };
  }
}
