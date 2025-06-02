
// src/app/api/market-data/commodities/route.ts
import { NextResponse } from 'next/server';

const baseCommodityAssets = [
  { id: 'XAUUSD', name: 'Gold', price: 2350.00, change: '+0.50%', high: 2360.00, low: 2340.00, favorite: true },
  { id: 'WTIUSD', name: 'Crude Oil (WTI)', price: 78.50, change: '-1.10%', high: 79.80, low: 78.00, favorite: false },
  { id: 'XAGUSD', name: 'Silver', price: 30.50, change: '+1.50%', high: 31.00, low: 30.00, favorite: false },
  { id: 'NGUSD', name: 'Natural Gas', price: 2.80, change: '-2.00%', high: 2.90, low: 2.75, favorite: false },
];

const simulateFluctuation = (basePrice: number, percentageRange: number = 0.02) => {
  const randomFactor = (Math.random() - 0.5) * 2 * percentageRange;
  return parseFloat((basePrice * (1 + randomFactor)).toFixed(2));
};

export async function GET() {
  try {
    const simulatedData = baseCommodityAssets.map(asset => {
      const newPrice = simulateFluctuation(asset.price);
      const priceDiff = newPrice - asset.price;
      const changePercent = ((priceDiff / asset.price) * 100).toFixed(2);
      
      return {
        ...asset,
        price: newPrice,
        change: `${priceDiff >= 0 ? '+' : ''}${changePercent}%`,
        high: Math.max(asset.high, newPrice * 1.003),
        low: Math.min(asset.low, newPrice * 0.997),
      };
    });
    return NextResponse.json(simulatedData);
  } catch (error) {
    console.error('[API /market-data/commodities GET] Error simulating commodity data:', error);
    return NextResponse.json({ message: 'Error fetching simulated commodity data' }, { status: 500 });
  }
}
