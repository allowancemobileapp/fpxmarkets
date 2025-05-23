
'use server';
/**
 * @fileOverview Generates personalized market insights based on user input or interests.
 *
 * - generateMarketInsights - A function that generates market insights.
 * - MarketInsightsInput - The input type for the generateMarketInsights function.
 * - MarketInsightsOutput - The return type for the generateMarketInsights function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const MarketInsightsInputSchema = z.object({
  interests: z
    .string()
    .describe('The user specified interests, for example, Forex, Shares, Metals, Tech Stocks, Gold, Renewable Energy, ETFs'),
});
export type MarketInsightsInput = z.infer<typeof MarketInsightsInputSchema>;

const MarketInsightsOutputSchema = z.object({
  insights: z.string().describe('The personalized market insights. Provide a brief overview of potential opportunities, key trends, and possible risks related to these interests. Format as a few concise paragraphs.'),
});
export type MarketInsightsOutput = z.infer<typeof MarketInsightsOutputSchema>;

export async function generateMarketInsights(input: MarketInsightsInput): Promise<MarketInsightsOutput> {
  console.log('[Flow:generateMarketInsights] Received input:', input);
  return generateMarketInsightsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'marketInsightsPrompt',
  input: {schema: MarketInsightsInputSchema},
  output: {schema: MarketInsightsOutputSchema},
  prompt: `You are an expert market analyst. Generate personalized market insights based on the user's interests.

User Interests: {{{interests}}}

Provide a brief, actionable overview of potential opportunities, key trends, and notable risks related to these interests.
The insights should be suitable for someone looking to make informed trading decisions.
Be concise and focus on clarity. Output should be a few paragraphs.`,
});

const generateMarketInsightsFlow = ai.defineFlow(
  {
    name: 'generateMarketInsightsFlow',
    inputSchema: MarketInsightsInputSchema,
    outputSchema: MarketInsightsOutputSchema,
  },
  async (input: MarketInsightsInput) => {
    console.log('[Flow:generateMarketInsightsFlow] Processing input:', input);
    try {
      const {output} = await prompt(input);
      if (!output || !output.insights) {
        console.error('[Flow:generateMarketInsightsFlow] Prompt returned null or undefined output, or insights field is missing.');
        // Consider throwing a more specific error or returning a default error structure
        throw new Error('AI model returned an empty or invalid response.');
      }
      console.log('[Flow:generateMarketInsightsFlow] Prompt output received:', output);
      return output;
    } catch (error: any) {
      console.error('[Flow:generateMarketInsightsFlow] Error during prompt execution:', error);
      if (error.message) {
        console.error('[Flow:generateMarketInsightsFlow] Error message:', error.message);
      }
      if (error.stack) {
        console.error('[Flow:generateMarketInsightsFlow] Error stack:', error.stack);
      }
      // Re-throw the error so it's caught by the action layer and reported to the user
      throw new Error(`Error in AI flow: ${error.message || 'Unknown error'}`);
    }
  }
);
