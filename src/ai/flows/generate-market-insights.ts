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
    .describe('The user specified interests, for example, Forex, Shares, Metals'),
});
export type MarketInsightsInput = z.infer<typeof MarketInsightsInputSchema>;

const MarketInsightsOutputSchema = z.object({
  insights: z.string().describe('The personalized market insights.'),
});
export type MarketInsightsOutput = z.infer<typeof MarketInsightsOutputSchema>;

export async function generateMarketInsights(input: MarketInsightsInput): Promise<MarketInsightsOutput> {
  return generateMarketInsightsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'marketInsightsPrompt',
  input: {schema: MarketInsightsInputSchema},
  output: {schema: MarketInsightsOutputSchema},
  prompt: `You are an expert market analyst. Generate personalized market insights based on the user's interests.

User Interests: {{{interests}}}
\nProvide a brief overview of potential opportunities related to these interests.`,
});

const generateMarketInsightsFlow = ai.defineFlow(
  {
    name: 'generateMarketInsightsFlow',
    inputSchema: MarketInsightsInputSchema,
    outputSchema: MarketInsightsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
