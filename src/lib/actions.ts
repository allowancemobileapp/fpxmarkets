'use server';

import { ContactFormSchema, type ContactFormValues } from '@/lib/types';
import { generateMarketInsights as generateMarketInsightsFlow, type MarketInsightsInput, type MarketInsightsOutput } from '@/ai/flows/generate-market-insights';

export async function submitContactForm(data: ContactFormValues): Promise<{ success: boolean; message: string }> {
  const validationResult = ContactFormSchema.safeParse(data);
  if (!validationResult.success) {
    return { success: false, message: "Invalid form data. Please check your input." };
  }

  // In a real app, you'd send an email, save to DB, etc.
  console.log("Contact form submitted:", validationResult.data);
  
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1000));

  // Simulate success/failure
  if (validationResult.data.email.includes("fail")) { // Simple test condition
    return { success: false, message: "Failed to submit form due to a server error. Please try again." };
  }
  return { success: true, message: "Thank you for your message! We'll be in touch soon." };
}

export async function getAIMarketInsights(input: MarketInsightsInput): Promise<MarketInsightsOutput | { error: string }> {
  try {
    // Simulate network delay for AI processing
    await new Promise(resolve => setTimeout(resolve, 1500));
    const result = await generateMarketInsightsFlow(input);
    return result;
  } catch (error) {
    console.error("Error generating market insights:", error);
    return { error: "Failed to generate market insights. Please try again later." };
  }
}
