
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

const baseSupabaseUrl = 'https://yosjqhioxjfywkdaaflv.supabase.co/storage/v1/object/public/copy-traders';

export const mockTraders: MockTrader[] = [
  { id: '1', username: 'AlphaTrader', avatarSeed: 'AT', risk: 'Medium', profit: '+25.5%', copiers: 1200, market: 'Forex & Crypto', strategy: 'Scalping & Swing Trading', joined: '2023-01-15', image: `${baseSupabaseUrl}/images%20(20).jpg`, imageHint: "trader profile" },
  { id: '2', username: 'StockSavvy', avatarSeed: 'SS', risk: 'Low', profit: '+18.2%', copiers: 850, market: 'Stocks (US)', strategy: 'Value Investing & Blue Chips', joined: '2022-11-01', image: `${baseSupabaseUrl}/images%20(1).jpg`, imageHint: "stock market" },
  { id: '3', username: 'YieldHero', avatarSeed: 'YH', risk: 'High', profit: '+45.0%', copiers: 500, market: 'Commodities', strategy: 'Trend Following & Futures', joined: '2023-05-20', image: `${baseSupabaseUrl}/5eeee52d-ce8e-4d5b-b362-eac191a33d9e_rw_1200.jpg`, imageHint: "commodities chart" },
  { id: '4', username: 'SteadyGrowth', avatarSeed: 'SG', risk: 'Low', profit: '+12.8%', copiers: 1500, market: 'Indices & ETFs', strategy: 'Long-term Index Investing', joined: '2022-08-10', image: `${baseSupabaseUrl}/images%20(2).jpg`, imageHint: "etf growth" },
  { id: '5', username: 'CryptoKing', avatarSeed: 'CK', risk: 'High', profit: '+75.2%', copiers: 2200, market: 'Cryptocurrencies', strategy: 'Altcoin Specialist, HODLing', joined: '2021-07-01', image: `${baseSupabaseUrl}/images%20(12).jpg`, imageHint: "crypto network" },
  // ForexMaster (id: '6') removed
  { id: '7', username: 'SafeBets', avatarSeed: 'SB', risk: 'Low', profit: '+9.5%', copiers: 1800, market: 'Bonds & ETFs', strategy: 'Capital Preservation', joined: '2023-02-28', image: `${baseSupabaseUrl}/images%20(4).jpg`, imageHint: "investment safety" },
  { id: '8', username: 'GlobalMacro', avatarSeed: 'GM', risk: 'Medium', profit: '+21.7%', copiers: 600, market: 'Global Indices, Forex', strategy: 'Macroeconomic Analysis', joined: '2021-12-05', image: `${baseSupabaseUrl}/images%20(11).jpg`, imageHint: "global markets" },
  { id: '9', username: 'TechTrend', avatarSeed: 'TT', risk: 'Medium', profit: '+29.9%', copiers: 750, market: 'Tech Stocks (NASDAQ)', strategy: 'Growth Stocks, Momentum', joined: '2023-08-01', image: `${baseSupabaseUrl}/images%20(16).jpg`, imageHint: "tech stocks" },
  { id: '10', username: 'SwingStar', avatarSeed: 'SW', risk: 'Medium', profit: '+19.5%', copiers: 1100, market: 'Forex, Stocks', strategy: 'Multi-day Swing Trades', joined: '2022-06-18', image: `${baseSupabaseUrl}/images%20(15).jpg`, imageHint: "trading graph" },
  { id: '11', username: 'DividendDiva', avatarSeed: 'DD', risk: 'Low', profit: '+15.3%', copiers: 900, market: 'Dividend Stocks', strategy: 'Income Investing', joined: '2023-04-10', image: `${baseSupabaseUrl}/38416202-1708337736299-d25c5b672d737.jpg`, imageHint: "financial growth" },
  { id: '12', username: 'FutureFocus', avatarSeed: 'FF', risk: 'High', profit: '+52.1%', copiers: 400, market: 'Emerging Markets, Crypto', strategy: 'High Growth Potential', joined: '2023-10-01', image: `${baseSupabaseUrl}/images%20(17).jpg`, imageHint: "future technology" },
  { id: '13', username: 'OilBaron', avatarSeed: 'OB', risk: 'Medium', profit: '+22.5%', copiers: 300, market: 'Oil & Gas Futures', strategy: 'Energy Sector Specialist', joined: '2022-09-15', image: `${baseSupabaseUrl}/images%20(13).jpg`, imageHint: "oil rig" },
  { id: '14', username: 'GoldGuard', avatarSeed: 'GG', risk: 'Low', profit: '+11.0%', copiers: 1300, market: 'Precious Metals', strategy: 'Safe Haven Assets', joined: '2023-03-01', image: `${baseSupabaseUrl}/images%20(19).jpg`, imageHint: "gold bars" },
  { id: '15', username: 'ScalperPro', avatarSeed: 'SP', risk: 'High', profit: '+60.7%', copiers: 700, market: 'Forex Minors', strategy: 'High-Frequency Scalping', joined: '2022-01-20', image: `${baseSupabaseUrl}/360_F_115344994_gzifZFyOLMHv5qPfok19GkohXupFGZSn.jpg`, imageHint: "fast trading" },
  { id: '16', username: 'ETFExplorer', avatarSeed: 'EE', risk: 'Low', profit: '+14.2%', copiers: 1600, market: 'Global ETFs', strategy: 'Diversified Index Tracking', joined: '2021-11-11', image: `${baseSupabaseUrl}/images%20(5).jpg`, imageHint: "diversified portfolio" },
  { id: '17', username: 'MomentumMan', avatarSeed: 'MM', risk: 'Medium', profit: '+38.5%', copiers: 880, market: 'Growth Stocks', strategy: 'Catching Market Trends', joined: '2023-07-25', image: `${baseSupabaseUrl}/images%20(18).jpg`, imageHint: "arrow up" },
  { id: '18', username: 'ValueSeeker', avatarSeed: 'VS', risk: 'Low', profit: '+16.9%', copiers: 1050, market: 'Undervalued Stocks', strategy: 'Fundamental Analysis', joined: '2022-05-05', image: `${baseSupabaseUrl}/images%20(10).jpg`, imageHint: "magnifying glass" },
  { id: '19', username: 'CryptoWhale', avatarSeed: 'CW', risk: 'High', profit: '+88.0%', copiers: 1900, market: 'Bitcoin & Ethereum', strategy: 'Large Cap Crypto Plays', joined: '2020-10-10', image: `${baseSupabaseUrl}/images%20(6).jpg`, imageHint: "bitcoin ethereum" },
  { id: '20', username: 'BalancedPortfolio', avatarSeed: 'BP', risk: 'Low', profit: '+10.5%', copiers: 2500, market: 'Mixed Assets', strategy: 'Conservative Diversification', joined: '2023-06-01', image: `${baseSupabaseUrl}/images%20(7).jpg`, imageHint: "portfolio balance" },
  { id: '21', username: 'OptionsOracle', avatarSeed: 'OO', risk: 'High', profit: '+42.3%', copiers: 650, market: 'Stock Options', strategy: 'Complex Options Strategies', joined: '2022-04-12', image: `${baseSupabaseUrl}/images%20(14).jpg`, imageHint: "options trading" },
  // New Traders (6 of them)
  { id: '22', username: 'TrendRiderFX', avatarSeed: 'TR', risk: 'Medium', profit: '+10.0%', copiers: 100, market: 'Forex', strategy: 'Trend Following', joined: '2024-01-01', image: `${baseSupabaseUrl}/images%20(8).jpg`, imageHint: "forex trend" },
  { id: '23', username: 'DividendYield', avatarSeed: 'DY', risk: 'Low', profit: '+5.0%', copiers: 50, market: 'Stocks', strategy: 'Dividend Investing', joined: '2024-01-05', image: `${baseSupabaseUrl}/images%20(9).jpg`, imageHint: "dividend stock" },
  { id: '24', username: 'CryptoPulse', avatarSeed: 'CP', risk: 'High', profit: '+30.0%', copiers: 200, market: 'Crypto', strategy: 'Day Trading Altcoins', joined: '2024-01-10', image: `${baseSupabaseUrl}/istockphoto-1082483460-612x612.jpg`, imageHint: "altcoin chart" },
  { id: '25', username: 'IndexSwing', avatarSeed: 'IS', risk: 'Medium', profit: '+15.5%', copiers: 150, market: 'Indices', strategy: 'Swing Trading SPX', joined: '2024-01-15', image: `${baseSupabaseUrl}/istockphoto-1410538853-612x612.jpg`, imageHint: "index fund" },
  // New Trader 5 (image: istockphoto-517696839-612x612.jpg) was removed
  { id: '26', username: 'MetalMover', avatarSeed: 'MMo', risk: 'Medium', profit: '+12.3%', copiers: 90, market: 'Commodities', strategy: 'Gold & Silver', joined: '2024-01-25', image: `${baseSupabaseUrl}/istockphoto-928023890-612x612.jpg`, imageHint: "gold silver" },
  { id: '27', username: 'TechMomentum', avatarSeed: 'TM', risk: 'High', profit: '+22.7%', copiers: 250, market: 'Tech Stocks', strategy: 'Momentum Plays', joined: '2024-02-01', image: `${baseSupabaseUrl}/photo_1241590_450_450.jpg`, imageHint: "tech graph" },
];
    

    