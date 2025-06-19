'use server';

import { Resend } from 'resend';
import {
  ContactFormSchema, type ContactFormValues,
  LoginFormSchema, type LoginFormValues,
  SignupFormSchema, type SignupFormValues,
  PinSetupFormSchema, type PinSetupFormValues,
  type AppUser
} from '@/lib/types';
import { generateMarketInsights as generateMarketInsightsFlow, type MarketInsightsInput, type MarketInsightsOutput } from '@/ai/flows/generate-market-insights';
import { getImageByContextTag, type ImageData } from '@/lib/imageService';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function submitContactForm(data: ContactFormValues): Promise<{ success: boolean; message: string }> {
  const validationResult = ContactFormSchema.safeParse(data);
  if (!validationResult.success) {
    return { success: false, message: "Invalid form data. Please check your input." };
  }

  const { name, email, message } = validationResult.data;

  if (!process.env.RESEND_API_KEY) {
    console.error('[Action:submitContactForm] RESEND_API_KEY is not set.');
    return { success: false, message: "Email configuration error. Please contact support." };
  }
  if (!process.env.RESEND_FROM_EMAIL) {
    console.error('[Action:submitContactForm] RESEND_FROM_EMAIL is not set.');
    return { success: false, message: "Email configuration error (from). Please contact support." };
  }
  if (!process.env.RESEND_TO_EMAIL) {
    console.error('[Action:submitContactForm] RESEND_TO_EMAIL is not set.');
    return { success: false, message: "Email configuration error (to). Please contact support." };
  }

  try {
    console.log(`[Action:submitContactForm] Attempting to send email from ${process.env.RESEND_FROM_EMAIL} to ${process.env.RESEND_TO_EMAIL}`);
    await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL,
      to: process.env.RESEND_TO_EMAIL,
      subject: `New Contact Form Submission from ${name} - FPX Markets`,
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6;">
          <h2 style="color: #0057B7;">New Contact Form Submission</h2>
          <p>You have received a new message through the FPX Markets contact form:</p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Message:</strong></p>
          <div style="background-color: #f9f9f9; border: 1px solid #ddd; padding: 15px; border-radius: 5px;">
            <p style="margin: 0;">${message.replace(/\n/g, '<br>')}</p>
          </div>
          <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
          <p style="font-size: 0.9em; color: #777;">This email was sent from the contact form on fpxmarkets.com.</p>
        </div>
      `,
      reply_to: email, // So you can reply directly to the user
    });
    console.log('[Action:submitContactForm] Email sent successfully via Resend.');
    return { success: true, message: "Thank you for your message! We'll be in touch soon." };
  } catch (error) {
    console.error('[Action:submitContactForm] Error sending email via Resend:', error);
    return { success: false, message: "Failed to send message. Please try again later or contact support directly." };
  }
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
      errorMessage += \` Details: \${error.message}\`;
    }
    if (error.stack) {
      console.error("[Action:getAIMarketInsights] Error stack:", error.stack);
    }
    if (error.response && error.response.data) {
        console.error("[Action:getAIMarketInsights] API Error Data:", error.response.data);
        errorMessage += \` API Response: \${JSON.stringify(error.response.data)}\`;
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

  if (data.email === "user@example.com" && data.password === "password123") {
    const mockUser: AppUser = {
      id: "user123",
      firebase_auth_uid: "firebaseUser123",
      email: "user@example.com",
      username: "TestUser",
      first_name: "Test",
      last_name: "User",
      account_type: "Personal",
      profile_completed_at: new Date().toISOString(),
      pin_setup_completed_at: null, 
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    return { success: true, user: mockUser };
  }
  return { success: false, message: "Invalid email or password." };
}


export async function handleSignup(data: SignupFormValues): Promise<{ success: boolean; message?: string; user?: Partial<AppUser> }> { 
  const validationResult = SignupFormSchema.safeParse(data);
  if (!validationResult.success) {
    const errorMessages = validationResult.error.errors.map(err => \`\${err.path.join('.')}: \${err.message}\`).join(', ');
    return { success: false, message: \`Invalid signup data: \${errorMessages}\` };
  }

  await new Promise(resolve => setTimeout(resolve, 1000));
  console.log("Simulated backend signup processing for email:", data.email);
  const partialUser: Partial<AppUser> = {
    email: data.email,
  };
  return { success: true, user: partialUser, message: "Signup process initiated. Complete profile next." };
}


export async function handlePinSetup(data: { pin: string, userId: string }): Promise<{ success: boolean; message?: string }> {
  if (!/^\\d{4}$/.test(data.pin)) {
    return { success: false, message: "Invalid PIN format. Must be 4 digits." };
  }
  await new Promise(resolve => setTimeout(resolve, 1000));
  console.log(\`Simulated PIN setup for user \${data.userId} with PIN: \${data.pin}\`);
  if (data.pin === "0000") {
      return { success: false, message: "PIN cannot be '0000'. Please choose a different PIN." };
  }
  return { success: true, message: "Trading PIN successfully set." };
}

export async function getSpecificImageByContextTag(contextTag: string): Promise<ImageData> {
  console.log(\`[Action:getSpecificImageByContextTag] Fetching image for context_tag: \${contextTag}\`);
  try {
    const imageData = await getImageByContextTag(contextTag);
    console.log(\`[Action:getSpecificImageByContextTag] Fetched image data for \${contextTag}:\`, imageData);
    return imageData;
  } catch (error) {
    console.error(\`[Action:getSpecificImageByContextTag] Error fetching image for \${contextTag}:\`, error);
    return {
      imageUrl: 'https://placehold.co/600x400.png', 
      altText: 'Error loading image'
    };
  }
}