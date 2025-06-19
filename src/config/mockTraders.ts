
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
  image: string; // This will now be a Supabase URL
  imageHint: string; // Kept for potential future use or reference
}

// IMPORTANT: You will need to update the '.png' extension and filenames below
// to match your actual uploaded images in the 'copy-traders' Supabase bucket.
const baseSupabaseUrl = 'https://yosjqhioxjfywkdaaflv.supabase.co/storage/v1/object/public/copy-traders';

export const mockTraders: MockTrader[] = [
  { id: '1', username: 'AlphaTrader', avatarSeed: 'AT', risk: 'Medium', profit: '+25.5%', copiers: 1200, market: 'Forex & Crypto', strategy: 'Scalping & Swing Trading', joined: '2023-01-15', image: `${baseSupabaseUrl}/alphatrader.png`, imageHint: "trader profile" },
  { id: '2', username: 'StockSavvy', avatarSeed: 'SS', risk: 'Low', profit: '+18.2%', copiers: 850, market: 'Stocks (US)', strategy: 'Value Investing & Blue Chips', joined: '2022-11-01', image: `${baseSupabaseUrl}/stocksavvy.png`, imageHint: "stock market" },
  { id: '3', username: 'YieldHero', avatarSeed: 'YH', risk: 'High', profit: '+45.0%', copiers: 500, market: 'Commodities', strategy: 'Trend Following & Futures', joined: '2023-05-20', image: `${baseSupabaseUrl}/yieldhero.png`, imageHint: "commodities chart" },
  { id: '4', username: 'SteadyGrowth', avatarSeed: 'SG', risk: 'Low', profit: '+12.8%', copiers: 1500, market: 'Indices & ETFs', strategy: 'Long-term Index Investing', joined: '2022-08-10', image: `${baseSupabaseUrl}/steadygrowth.png`, imageHint: "etf growth" },
  { id: '5', username: 'CryptoKing', avatarSeed: 'CK', risk: 'High', profit: '+75.2%', copiers: 2200, market: 'Cryptocurrencies', strategy: 'Altcoin Specialist, HODLing', joined: '2021-07-01', image: `${baseSupabaseUrl}/cryptoking.png`, imageHint: "crypto network" },
  { id: '6', username: 'ForexMaster', avatarSeed: 'FM', risk: 'Medium', profit: '+33.1%', copiers: 950, market: 'Forex Majors', strategy: 'Day Trading, Price Action', joined: '2022-03-12', image: `${baseSupabaseUrl}/forexmaster.png`, imageHint: "forex charts" },
  { id: '7', username: 'SafeBets', avatarSeed: 'SB', risk: 'Low', profit: '+9.5%', copiers: 1800, market: 'Bonds & ETFs', strategy: 'Capital Preservation', joined: '2023-02-28', image: `${baseSupabaseUrl}/safebets.png`, imageHint: "investment safety" },
  { id: '8', username: 'GlobalMacro', avatarSeed: 'GM', risk: 'Medium', profit: '+21.7%', copiers: 600, market: 'Global Indices, Forex', strategy: 'Macroeconomic Analysis', joined: '2021-12-05', image: `${baseSupabaseUrl}/globalmacro.png`, imageHint: "global markets" },
  { id: '9', username: 'TechTrend', avatarSeed: 'TT', risk: 'Medium', profit: '+29.9%', copiers: 750, market: 'Tech Stocks (NASDAQ)', strategy: 'Growth Stocks, Momentum', joined: '2023-08-01', image: `${baseSupabaseUrl}/techtrend.png`, imageHint: "tech stocks" },
  { id: '10', username: 'SwingStar', avatarSeed: 'SW', risk: 'Medium', profit: '+19.5%', copiers: 1100, market: 'Forex, Stocks', strategy: 'Multi-day Swing Trades', joined: '2022-06-18', image: `${baseSupabaseUrl}/swingstar.png`, imageHint: "trading graph" },
  { id: '11', username: 'DividendDiva', avatarSeed: 'DD', risk: 'Low', profit: '+15.3%', copiers: 900, market: 'Dividend Stocks', strategy: 'Income Investing', joined: '2023-04-10', image: `${baseSupabaseUrl}/dividenddiva.png`, imageHint: "financial growth" },
  { id: '12', username: 'FutureFocus', avatarSeed: 'FF', risk: 'High', profit: '+52.1%', copiers: 400, market: 'Emerging Markets, Crypto', strategy: 'High Growth Potential', joined: '2023-10-01', image: `${baseSupabaseUrl}/futurefocus.png`, imageHint: "future technology" },
  { id: '13', username: 'OilBaron', avatarSeed: 'OB', risk: 'Medium', profit: '+22.5%', copiers: 300, market: 'Oil & Gas Futures', strategy: 'Energy Sector Specialist', joined: '2022-09-15', image: `${baseSupabaseUrl}/oilbaron.png`, imageHint: "oil rig" },
  { id: '14', username: 'GoldGuard', avatarSeed: 'GG', risk: 'Low', profit: '+11.0%', copiers: 1300, market: 'Precious Metals', strategy: 'Safe Haven Assets', joined: '2023-03-01', image: `${baseSupabaseUrl}/goldguard.png`, imageHint: "gold bars" },
  { id: '15', username: 'ScalperPro', avatarSeed: 'SP', risk: 'High', profit: '+60.7%', copiers: 700, market: 'Forex Minors', strategy: 'High-Frequency Scalping', joined: '2022-01-20', image: `${baseSupabaseUrl}/scalperpro.png`, imageHint: "fast trading" },
  { id: '16', username: 'ETFExplorer', avatarSeed: 'EE', risk: 'Low', profit: '+14.2%', copiers: 1600, market: 'Global ETFs', strategy: 'Diversified Index Tracking', joined: '2021-11-11', image: `${baseSupabaseUrl}/etfexplorer.png`, imageHint: "diversified portfolio" },
  { id: '17', username: 'MomentumMan', avatarSeed: 'MM', risk: 'Medium', profit: '+38.5%', copiers: 880, market: 'Growth Stocks', strategy: 'Catching Market Trends', joined: '2023-07-25', image: `${baseSupabaseUrl}/momentumman.png`, imageHint: "arrow up" },
  { id: '18', username: 'ValueSeeker', avatarSeed: 'VS', risk: 'Low', profit: '+16.9%', copiers: 1050, market: 'Undervalued Stocks', strategy: 'Fundamental Analysis', joined: '2022-05-05', image: `${baseSupabaseUrl}/valueseeker.png`, imageHint: "magnifying glass" },
  { id: '19', username: 'CryptoWhale', avatarSeed: 'CW', risk: 'High', profit: '+88.0%', copiers: 1900, market: 'Bitcoin & Ethereum', strategy: 'Large Cap Crypto Plays', joined: '2020-10-10', image: `${baseSupabaseUrl}/cryptowhale.png`, imageHint: "bitcoin ethereum" },
  { id: '20', username: 'BalancedPortfolio', avatarSeed: 'BP', risk: 'Low', profit: '+10.5%', copiers: 2500, market: 'Mixed Assets', strategy: 'Conservative Diversification', joined: '2023-06-01', image: `${baseSupabaseUrl}/balancedportfolio.png`, imageHint: "portfolio balance" },
  { id: '21', username: 'OptionsOracle', avatarSeed: 'OO', risk: 'High', profit: '+42.3%', copiers: 650, market: 'Stock Options', strategy: 'Complex Options Strategies', joined: '2022-04-12', image: `${baseSupabaseUrl}/optionsoracle.png`, imageHint: "options trading" },
];

    