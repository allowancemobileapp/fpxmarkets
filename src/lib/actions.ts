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
// Defaults to .net branding
const resendFromEmail = process.env.RESEND_FROM_EMAIL || 'hello@fpxmarkets.net';
const resendToEmail = process.env.RESEND_TO_EMAIL || 'support@fpxmarkets.net';

let resend: Resend | null = null;

if (resendApiKey) {
  resend = new Resend(resendApiKey);
  console.log('[Action:Global] Resend SDK initialized.');
} else {
  console.warn('[Action:Global] Resend SDK NOT initialized - missing RESEND_API_KEY.');
}

export async function submitContactForm(data: ContactFormValues): Promise<{ success: boolean; message: string }> {
  console.log('[Action:submitContactForm] Attempting submission for fpxmarkets.net');

  const validationResult = ContactFormSchema.safeParse(data);
  if (!validationResult.success) {
    return { success: false, message: "Invalid form data. Please check your input." };
  }

  if (!resend) {
    return { success: false, message: "Email service not configured. Please contact us via live chat." };
  }
  
  const { name, email, message } = validationResult.data;
  
  try {
    const { data: resendData, error: resendError } = await resend.emails.send({
      from: `FPX Support <${resendFromEmail}>`,
      to: resendToEmail,
      subject: `New Inquiry from ${name} on fpxmarkets.net`,
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <h2 style="color: #0057B7;">New Contact Submission</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Message:</strong></p>
          <div style="background: #f4f4f4; padding: 15px; border-radius: 5px;">${message.replace(/\n/g, '<br>')}</div>
          <p style="font-size: 12px; color: #999; margin-top: 20px;">Sent from fpxmarkets.net</p>
        </div>
      `,
      reply_to: email,
    });

    if (resendError) {
      console.error('[Action:submitContactForm] Resend Error:', resendError);
      return { success: false, message: `Sending failed: ${resendError.message}` };
    }

    return { success: true, message: "Message sent! Our team will contact you shortly." };
  } catch (error: any) {
    return { success: false, message: "Server error occurred. Please use live chat." };
  }
}

export async function getAIMarketInsights(input: MarketInsightsInput): Promise<MarketInsightsOutput | { error: string }> {
  try {
    return await generateMarketInsightsFlow(input);
  } catch (error: any) {
    return { error: "AI service temporarily unavailable." };
  }
}

export async function getSpecificImageByContextTag(contextTag: string): Promise<ImageData> {
  try {
    return await getImageByContextTag(contextTag);
  } catch (error) {
    return {
      imageUrl: 'https://placehold.co/600x400.png',
      altText: 'Image unavailable'
    };
  }
}
