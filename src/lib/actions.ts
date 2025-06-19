
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

const resendApiKey = process.env.RESEND_API_KEY;
const resendFromEmail = process.env.RESEND_FROM_EMAIL;
const resendToEmail = process.env.RESEND_TO_EMAIL;

let resend: Resend | null = null;
if (resendApiKey) {
  resend = new Resend(resendApiKey);
} else {
  console.warn('[Action:Global] RESEND_API_KEY is not set. Email functionality will be disabled.');
}

export async function submitContactForm(data: ContactFormValues): Promise<{ success: boolean; message: string }> {
  const validationResult = ContactFormSchema.safeParse(data);
  if (!validationResult.success) {
    return { success: false, message: "Invalid form data. Please check your input." };
  }

  const { name, email, message } = validationResult.data;

  if (!resend) {
    console.error('[Action:submitContactForm] Resend SDK not initialized because RESEND_API_KEY is missing.');
    return { success: false, message: "Email service is not configured. Please contact support. (API Key Missing)" };
  }
  if (!resendFromEmail) {
    console.error('[Action:submitContactForm] RESEND_FROM_EMAIL environment variable is not set.');
    return { success: false, message: "Email service is not configured. Please contact support. (From Email Missing)" };
  }
  if (!resendToEmail) {
    console.error('[Action:submitContactForm] RESEND_TO_EMAIL environment variable is not set.');
    return { success: false, message: "Email service is not configured. Please contact support. (To Email Missing)" };
  }

  try {
    console.log(`[Action:submitContactForm] Attempting to send email from ${resendFromEmail} to ${resendToEmail}`);
    const { data: resendData, error: resendError } = await resend.emails.send({
      from: resendFromEmail,
      to: resendToEmail,
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
      reply_to: email,
    });

    if (resendError) {
      console.error('[Action:submitContactForm] Resend API Error:', resendError);
      return { success: false, message: `Failed to send message. Resend Error: ${resendError.message}` };
    }

    console.log('[Action:submitContactForm] Email sent successfully via Resend. ID:', resendData?.id);
    return { success: true, message: "Thank you for your message! We'll be in touch soon." };
  } catch (error: any) {
    console.error('[Action:submitContactForm] Exception sending email via Resend:', error);
    return { success: false, message: "Failed to send message due to an unexpected error. Please try again later or contact support directly." };
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
