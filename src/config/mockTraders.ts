
// src/config/mockTraders.ts
export interface MockTrader {
  id: string;
  username: string;
  avatarSeed: string;
  risk: 'Low' | 'Medium' | 'High';
  profit: string;
  copiers: number;
  market: string;
  strategy?: string;
  joined?: string;
  image: string;
  imageHint: string;
}

export const mockTraders: MockTrader[] = [
  { id: '1', username: 'AlphaTrader', avatarSeed: 'AT', risk: 'Medium', profit: '+25.5%', copiers: 1200, market: 'Forex & Crypto', strategy: 'Scalping & Swing Trading', joined: '2023-01-15', image: "https://placehold.co/800x400.png", imageHint: "trader profile background" },
  { id: '2', username: 'StockSavvy', avatarSeed: 'SS', risk: 'Low', profit: '+18.2%', copiers: 850, market: 'Stocks (US)', strategy: 'Value Investing & Blue Chips', joined: '2022-11-01', image: "https://placehold.co/800x401.png", imageHint: "stock market analysis" },
  { id: '3', username: 'YieldHero', avatarSeed: 'YH', risk: 'High', profit: '+45.0%', copiers: 500, market: 'Commodities', strategy: 'Trend Following & Futures', joined: '2023-05-20', image: "https://placehold.co/800x402.png", imageHint: "commodities chart" },
  { id: '4', username: 'SteadyGrowth', avatarSeed: 'SG', risk: 'Low', profit: '+12.8%', copiers: 1500, market: 'Indices & ETFs', strategy: 'Long-term Index Investing', joined: '2022-08-10', image: "https://placehold.co/800x403.png", imageHint: "etf growth chart" },
];
