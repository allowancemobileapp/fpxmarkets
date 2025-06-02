
// src/app/api/market-data/forex/route.ts
import { NextResponse } from 'next/server';

interface ForexAsset {
  id: string;
  name: string;
  price: number;
  // Change, high, low will be added client-side from mock for now
}

const forexPairsToFetch = [
  { base: 'EUR', target: 'USD', id: 'EURUSD', name: 'EUR/USD' },
  { base: 'GBP', target: 'USD', id: 'GBPUSD', name: 'GBP/USD' },
  { base: 'USD', target: 'JPY', id: 'USDJPY', name: 'USD/JPY' },
  { base: 'AUD', target: 'USD', id: 'AUDUSD', name: 'AUD/USD' },
];

export async function GET() {
  const apiKey = process.env.EXCHANGERATE_API_KEY;

  if (!apiKey) {
    console.error('[API /market-data/forex GET] Missing EXCHANGERATE_API_KEY');
    return NextResponse.json({ message: 'API key for exchange rate service is not configured.' }, { status: 500 });
  }

  try {
    const fetchedData: ForexAsset[] = [];

    for (const pair of forexPairsToFetch) {
      const response = await fetch(`https://v6.exchangerate-api.com/v6/${apiKey}/pair/${pair.base}/${pair.target}`);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: `Failed to fetch data for ${pair.id}. Status: ${response.status}` }));
        console.error(`[API /market-data/forex GET] Error fetching ${pair.id}:`, errorData);
        // Continue to next pair if one fails, or decide to fail all
        // For now, we'll skip this pair on error.
        continue; 
      }
      
      const data = await response.json();

      if (data.result === 'success' && data.conversion_rate) {
        fetchedData.push({
          id: pair.id,
          name: pair.name,
          price: parseFloat(data.conversion_rate.toFixed(4)),
        });
      } else {
        console.warn(`[API /market-data/forex GET] Could not retrieve conversion rate for ${pair.id}. API Response:`, data);
      }
    }
    
    if (fetchedData.length === 0 && forexPairsToFetch.length > 0) {
        // This means all fetches failed or returned no valid data
        return NextResponse.json({ message: 'Failed to fetch any Forex data.' }, { status: 500 });
    }

    return NextResponse.json(fetchedData);

  } catch (error) {
    console.error('[API /market-data/forex GET] General error fetching Forex data:', error);
    return NextResponse.json({ message: 'Error fetching Forex data from external API' }, { status: 500 });
  }
}
