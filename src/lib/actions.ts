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

if (resendApiKey && resendFromEmail && resendToEmail) {
  resend = new Resend(resendApiKey);
  console.log('[Action:Global] Resend SDK initialized.');
} else {
  console.warn('[Action:Global] Resend SDK NOT initialized due to missing environment variables.');
  if (!resendApiKey) console.warn('[Action:Global] RESEND_API_KEY is missing.');
  if (!resendFromEmail) console.warn('[Action:Global] RESEND_FROM_EMAIL is missing.');
  if (!resendToEmail) console.warn('[Action:Global] RESEND_TO_EMAIL is missing.');
}

export async function submitContactForm(data: ContactFormValues): Promise<{ success: boolean; message: string }> {
  console.log('[Action:submitContactForm] Received data:', JSON.stringify(data));

  const validationResult = ContactFormSchema.safeParse(data);
  if (!validationResult.success) {
    console.error('[Action:submitContactForm] Validation failed:', validationResult.error.flatten());
    return { success: false, message: "Invalid form data. Please check your input." };
  }

  if (!resend) {
    console.error('[Action:submitContactForm] Resend SDK is not initialized. One or more Resend environment variables are missing.');
    return { success: false, message: "Email service is not configured on the server. Please contact support." };
  }
  
  const fromEmailToUse = resendFromEmail || 'hello@fpxmarkets.net';
  const toEmailToUse = resendToEmail || 'support@fpxmarkets.net';

  const { name, email, message } = validationResult.data;
  
  const fromAddress = `FPX Markets <${fromEmailToUse}>`;
  console.log(`[Action:submitContactForm] Sending email. From: "${fromAddress}", To: "${toEmailToUse}"`);

  try {
    const { data: resendData, error: resendError } = await resend.emails.send({
      from: fromAddress,
      to: toEmailToUse,
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
          <p style="font-size: 0.9em; color: #777;">This email was sent from fpxmarkets.net</p>
        </div>
      `,
      reply_to: email,
    });

    if (resendError) {
      console.error('[Action:submitContactForm] Resend API Error:', JSON.stringify(resendError, null, 2));
      return { success: false, message: `Failed to send message. Error: ${resendError.message}` };
    }

    console.log('[Action:submitContactForm] Email sent successfully. ID:', resendData?.id);
    return { success: true, message: "Thank you for your message! We'll be in touch soon." };
  } catch (error: any) {
    console.error('[Action:submitContactForm] Exception sending email:', error);
    return { success: false, message: "Failed to send message due to an unexpected server error." };
  }
}

export async function getAIMarketInsights(input: MarketInsightsInput): Promise<MarketInsightsOutput | { error: string }> {
  try {
    const result = await generateMarketInsightsFlow(input);
    return result;
  } catch (error: any) {
    console.error("[Action:getAIMarketInsights] Error generating market insights:", error);
    return { error: "Failed to generate market insights. Please try again later." };
  }
}

export async function getSpecificImageByContextTag(contextTag: string): Promise<ImageData> {
  try {
    const imageData = await getImageByContextTag(contextTag);
    return imageData;
  } catch (error) {
    return {
      imageUrl: 'https://placehold.co/600x400.png',
      altText: 'Error loading image'
    };
  }
}
