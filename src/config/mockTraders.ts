
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
  { id: '1', username: 'AlphaTrader', avatarSeed: 'AT', risk: 'Medium', profit: '+25.5%', copiers: 1200, market: 'Forex & Crypto', strategy: 'Scalping & Swing Trading', joined: '2023-01-15', image: "https://placehold.co/800x400.png?text=AlphaT", imageHint: "trader profile" },
  { id: '2', username: 'StockSavvy', avatarSeed: 'SS', risk: 'Low', profit: '+18.2%', copiers: 850, market: 'Stocks (US)', strategy: 'Value Investing & Blue Chips', joined: '2022-11-01', image: "https://placehold.co/800x401.png?text=StockS", imageHint: "stock market" },
  { id: '3', username: 'YieldHero', avatarSeed: 'YH', risk: 'High', profit: '+45.0%', copiers: 500, market: 'Commodities', strategy: 'Trend Following & Futures', joined: '2023-05-20', image: "https://placehold.co/800x402.png?text=YieldH", imageHint: "commodities chart" },
  { id: '4', username: 'SteadyGrowth', avatarSeed: 'SG', risk: 'Low', profit: '+12.8%', copiers: 1500, market: 'Indices & ETFs', strategy: 'Long-term Index Investing', joined: '2022-08-10', image: "https://placehold.co/800x403.png?text=SteadyG", imageHint: "etf growth" },
  { id: '5', username: 'CryptoKing', avatarSeed: 'CK', risk: 'High', profit: '+75.2%', copiers: 2200, market: 'Cryptocurrencies', strategy: 'Altcoin Specialist, HODLing', joined: '2021-07-01', image: "https://placehold.co/800x404.png?text=CryptoK", imageHint: "crypto network" },
  { id: '6', username: 'ForexMaster', avatarSeed: 'FM', risk: 'Medium', profit: '+33.1%', copiers: 950, market: 'Forex Majors', strategy: 'Day Trading, Price Action', joined: '2022-03-12', image: "https://placehold.co/800x405.png?text=ForexM", imageHint: "forex charts" },
  { id: '7', username: 'SafeBets', avatarSeed: 'SB', risk: 'Low', profit: '+9.5%', copiers: 1800, market: 'Bonds & ETFs', strategy: 'Capital Preservation', joined: '2023-02-28', image: "https://placehold.co/800x406.png?text=SafeB", imageHint: "investment safety" },
  { id: '8', username: 'GlobalMacro', avatarSeed: 'GM', risk: 'Medium', profit: '+21.7%', copiers: 600, market: 'Global Indices, Forex', strategy: 'Macroeconomic Analysis', joined: '2021-12-05', image: "https://placehold.co/800x407.png?text=GlobalM", imageHint: "global markets" },
  { id: '9', username: 'TechTrend', avatarSeed: 'TT', risk: 'Medium', profit: '+29.9%', copiers: 750, market: 'Tech Stocks (NASDAQ)', strategy: 'Growth Stocks, Momentum', joined: '2023-08-01', image: "https://placehold.co/800x408.png?text=TechT", imageHint: "tech stocks" },
  { id: '10', username: 'SwingStar', avatarSeed: 'SW', risk: 'Medium', profit: '+19.5%', copiers: 1100, market: 'Forex, Stocks', strategy: 'Multi-day Swing Trades', joined: '2022-06-18', image: "https://placehold.co/800x409.png?text=SwingS", imageHint: "trading graph" },
  { id: '11', username: 'DividendDiva', avatarSeed: 'DD', risk: 'Low', profit: '+15.3%', copiers: 900, market: 'Dividend Stocks', strategy: 'Income Investing', joined: '2023-04-10', image: "https://placehold.co/800x410.png?text=DivD", imageHint: "financial growth" },
  { id: '12', username: 'FutureFocus', avatarSeed: 'FF', risk: 'High', profit: '+52.1%', copiers: 400, market: 'Emerging Markets, Crypto', strategy: 'High Growth Potential', joined: '2023-10-01', image: "https://placehold.co/800x411.png?text=FutureF", imageHint: "future technology" },
  { id: '13', username: 'OilBaron', avatarSeed: 'OB', risk: 'Medium', profit: '+22.5%', copiers: 300, market: 'Oil & Gas Futures', strategy: 'Energy Sector Specialist', joined: '2022-09-15', image: "https://placehold.co/800x412.png?text=OilB", imageHint: "oil rig" },
  { id: '14', username: 'GoldGuard', avatarSeed: 'GG', risk: 'Low', profit: '+11.0%', copiers: 1300, market: 'Precious Metals', strategy: 'Safe Haven Assets', joined: '2023-03-01', image: "https://placehold.co/800x413.png?text=GoldG", imageHint: "gold bars" },
  { id: '15', username: 'ScalperPro', avatarSeed: 'SP', risk: 'High', profit: '+60.7%', copiers: 700, market: 'Forex Minors', strategy: 'High-Frequency Scalping', joined: '2022-01-20', image: "https://placehold.co/800x414.png?text=ScalperP", imageHint: "fast trading" },
  { id: '16', username: 'ETFExplorer', avatarSeed: 'EE', risk: 'Low', profit: '+14.2%', copiers: 1600, market: 'Global ETFs', strategy: 'Diversified Index Tracking', joined: '2021-11-11', image: "https://placehold.co/800x415.png?text=ETFExp", imageHint: "diversified portfolio" },
  { id: '17', username: 'MomentumMan', avatarSeed: 'MM', risk: 'Medium', profit: '+38.5%', copiers: 880, market: 'Growth Stocks', strategy: 'Catching Market Trends', joined: '2023-07-25', image: "https://placehold.co/800x416.png?text=MomentumM", imageHint: "arrow up" },
  { id: '18', username: 'ValueSeeker', avatarSeed: 'VS', risk: 'Low', profit: '+16.9%', copiers: 1050, market: 'Undervalued Stocks', strategy: 'Fundamental Analysis', joined: '2022-05-05', image: "https://placehold.co/800x417.png?text=ValueS", imageHint: "magnifying glass" },
  { id: '19', username: 'CryptoWhale', avatarSeed: 'CW', risk: 'High', profit: '+88.0%', copiers: 1900, market: 'Bitcoin & Ethereum', strategy: 'Large Cap Crypto Plays', joined: '2020-10-10', image: "https://placehold.co/800x418.png?text=CryptoW", imageHint: "bitcoin ethereum" },
  { id: '20', username: 'BalancedPortfolio', avatarSeed: 'BP', risk: 'Low', profit: '+10.5%', copiers: 2500, market: 'Mixed Assets', strategy: 'Conservative Diversification', joined: '2023-06-01', image: "https://placehold.co/800x419.png?text=BalancedP", imageHint: "portfolio balance" },
  { id: '21', username: 'OptionsOracle', avatarSeed: 'OO', risk: 'High', profit: '+42.3%', copiers: 650, market: 'Stock Options', strategy: 'Complex Options Strategies', joined: '2022-04-12', image: "https://placehold.co/800x420.png?text=OptionsO", imageHint: "options trading" },
];

