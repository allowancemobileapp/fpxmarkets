
// src/app/api/market-data/stocks/route.ts
import { NextResponse } from 'next/server';

const baseStockAssets = [
  { id: 'AAPL', name: 'Apple Inc.', price: 190.50, change: '+1.20%', high: 191.00, low: 188.50, favorite: false },
  { id: 'MSFT', name: 'Microsoft Corp.', price: 425.00, change: '+0.75%', high: 428.00, low: 422.00, favorite: true },
  { id: 'NVDA', name: 'NVIDIA Corp.', price: 1200.00, change: '+3.50%', high: 1210.00, low: 1180.00, favorite: true },
  { id: 'AMZN', name: 'Amazon.com Inc.', price: 185.00, change: '+0.90%', high: 186.50, low: 183.00, favorite: false },
];

const simulateFluctuation = (basePrice: number, percentageRange: number = 0.03) => {
  const randomFactor = (Math.random() - 0.5) * 2 * percentageRange;
  return parseFloat((basePrice * (1 + randomFactor)).toFixed(2));
};

export async function GET() {
  try {
    const simulatedData = baseStockAssets.map(asset => {
      const newPrice = simulateFluctuation(asset.price);
      const priceDiff = newPrice - asset.price;
      const changePercent = ((priceDiff / asset.price) * 100).toFixed(2);
      
      return {
        ...asset,
        price: newPrice,
        change: `${priceDiff >= 0 ? '+' : ''}${changePercent}%`,
        high: Math.max(asset.high, newPrice * 1.005),
        low: Math.min(asset.low, newPrice * 0.995),
      };
    });
    return NextResponse.json(simulatedData);
  } catch (error) {
    console.error('[API /market-data/stocks GET] Error simulating stock data:', error);
    return NextResponse.json({ message: 'Error fetching simulated stock data' }, { status: 500 });
  }
}
