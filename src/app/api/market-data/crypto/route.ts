
// src/app/api/market-data/crypto/route.ts
import { NextResponse } from 'next/server';

const baseCryptoAssets = [
  { id: 'BTCUSD', name: 'BTC/USD', price: 68500.00, change: '+5.80%', high: 69200.00, low: 65300.00, favorite: true },
  { id: 'ETHUSD', name: 'ETH/USD', price: 3800.00, change: '+3.10%', high: 3850.00, low: 3700.00, favorite: false },
  { id: 'SOLUSD', name: 'SOL/USD', price: 165.00, change: '+2.50%', high: 170.00, low: 160.00, favorite: true },
  { id: 'DOGEUSD', name: 'DOGE/USD', price: 0.1600, change: '-1.20%', high: 0.1650, low: 0.1580, favorite: false },
];

// Function to simulate price fluctuations
const simulateFluctuation = (basePrice: number, percentageRange: number = 0.05) => {
  const randomFactor = (Math.random() - 0.5) * 2 * percentageRange; // -range to +range
  return parseFloat((basePrice * (1 + randomFactor)).toFixed(basePrice > 100 ? 2 : 4));
};

export async function GET() {
  try {
    const simulatedData = baseCryptoAssets.map(asset => {
      const newPrice = simulateFluctuation(asset.price);
      const priceDiff = newPrice - asset.price;
      const changePercent = ((priceDiff / asset.price) * 100).toFixed(2);
      
      return {
        ...asset,
        price: newPrice,
        change: `${priceDiff >= 0 ? '+' : ''}${changePercent}%`,
        // For simplicity, high/low can be slightly adjusted based on new price
        high: Math.max(asset.high, newPrice * 1.01),
        low: Math.min(asset.low, newPrice * 0.99),
      };
    });

    return NextResponse.json(simulatedData);
  } catch (error) {
    console.error('[API /market-data/crypto GET] Error simulating crypto data:', error);
    return NextResponse.json({ message: 'Error fetching simulated crypto data' }, { status: 500 });
  }
}
