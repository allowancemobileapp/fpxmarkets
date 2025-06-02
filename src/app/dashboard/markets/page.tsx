
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { LineChart as LineChartIcon, Star, Search, Loader2, AlertTriangle, Eye } from 'lucide-react';
import Image from 'next/image';
import { Input } from '@/components/ui/input';
import { useState, useEffect, useMemo } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Separator } from '@/components/ui/separator';

interface Asset {
  id: string;
  name: string;
  price: number;
  change: string;
  high: number;
  low: number;
  favorite: boolean;
  category: string; // To help with initial grouping and fetching
}

const initialMockAssets: Record<string, Asset[]> = {
  favorites: [], // Will be populated dynamically
  forex: [
    { id: 'EURUSD', name: 'EUR/USD', price: 1.0850, change: '+0.25%', high: 1.0875, low: 1.0825, favorite: true, category: 'forex' },
    { id: 'GBPUSD', name: 'GBP/USD', price: 1.2700, change: '-0.10%', high: 1.2750, low: 1.2680, favorite: false, category: 'forex' },
    { id: 'USDJPY', name: 'USD/JPY', price: 157.20, change: '+0.05%', high: 157.50, low: 156.80, favorite: false, category: 'forex' },
    { id: 'AUDUSD', name: 'AUD/USD', price: 0.6650, change: '-0.15%', high: 0.6680, low: 0.6630, favorite: true, category: 'forex' },
  ],
  crypto: [
    { id: 'BTCUSD', name: 'BTC/USD', price: 68500.00, change: '+5.80%', high: 69200.00, low: 65300.00, favorite: true, category: 'crypto' },
    { id: 'ETHUSD', name: 'ETH/USD', price: 3800.00, change: '+3.10%', high: 3850.00, low: 3700.00, favorite: false, category: 'crypto' },
    { id: 'SOLUSD', name: 'SOL/USD', price: 165.00, change: '+2.50%', high: 170.00, low: 160.00, favorite: true, category: 'crypto' },
    { id: 'DOGEUSD', name: 'DOGE/USD', price: 0.1600, change: '-1.20%', high: 0.1650, low: 0.1580, favorite: false, category: 'crypto' },
  ],
  stocks: [
    { id: 'AAPL', name: 'Apple Inc.', price: 190.50, change: '+1.20%', high: 191.00, low: 188.50, favorite: false, category: 'stocks' },
    { id: 'MSFT', name: 'Microsoft Corp.', price: 425.00, change: '+0.75%', high: 428.00, low: 422.00, favorite: true, category: 'stocks' },
    { id: 'NVDA', name: 'NVIDIA Corp.', price: 1200.00, change: '+3.50%', high: 1210.00, low: 1180.00, favorite: true, category: 'stocks' },
    { id: 'AMZN', name: 'Amazon.com Inc.', price: 185.00, change: '+0.90%', high: 186.50, low: 183.00, favorite: false, category: 'stocks' },
  ],
  commodities: [
    { id: 'XAUUSD', name: 'Gold', price: 2350.00, change: '+0.50%', high: 2360.00, low: 2340.00, favorite: true, category: 'commodities' },
    { id: 'WTIUSD', name: 'Crude Oil (WTI)', price: 78.50, change: '-1.10%', high: 79.80, low: 78.00, favorite: false, category: 'commodities' },
    { id: 'XAGUSD', name: 'Silver', price: 30.50, change: '+1.50%', high: 31.00, low: 30.00, favorite: false, category: 'commodities' },
    { id: 'NGUSD', name: 'Natural Gas', price: 2.80, change: '-2.00%', high: 2.90, low: 2.75, favorite: false, category: 'commodities' },
  ],
};

const marketCategoriesConfig = [
  { value: 'favorites', label: 'Favorites' },
  { value: 'forex', label: 'Forex', apiUrl: '/api/market-data/forex' },
  { value: 'crypto', label: 'Crypto', apiUrl: '/api/market-data/crypto' },
  { value: 'stocks', label: 'Stocks', apiUrl: '/api/market-data/stocks' },
  { value: 'commodities', label: 'Commodities', apiUrl: '/api/market-data/commodities' },
];

export default function MarketsPage() {
  const [assets, setAssets] = useState<Record<string, Asset[]>>(initialMockAssets);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('forex');
  const [selectedAssetForChart, setSelectedAssetForChart] = useState<Asset | null>(null);
  const { toast } = useToast();
  const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>({
    forex: true, crypto: true, stocks: true, commodities: true,
  });
  const [errorStates, setErrorStates] = useState<Record<string, string | null>>({});

  useEffect(() => {
    const fetchMarketData = async (category: string, apiUrl: string) => {
      try {
        const response = await fetch(apiUrl);
        if (!response.ok) throw new Error(`Failed to fetch ${category} data. Status: ${response.status}`);
        const data: Asset[] = await response.json();
        
        setAssets(prevAssets => {
          const currentFavorites = new Set(Object.values(prevAssets).flat().filter(a => a.favorite).map(a => a.id));
          const updatedCategoryAssets = data.map(newAsset => ({
            ...initialMockAssets[category]?.find(mock => mock.id === newAsset.id), // Get other static fields like name, initial favorite from mock
            ...newAsset, // Overwrite with fetched data (id, price, etc.)
            favorite: currentFavorites.has(newAsset.id), // Preserve favorite status across fetches
            category: category,
          }));
          return { ...prevAssets, [category]: updatedCategoryAssets };
        });
        setErrorStates(prev => ({ ...prev, [category]: null }));
      } catch (error: any) {
        console.error(`Error fetching ${category} data:`, error);
        setErrorStates(prev => ({ ...prev, [category]: error.message || `Failed to load ${category} data.` }));
      } finally {
        setLoadingStates(prev => ({ ...prev, [category]: false }));
      }
    };

    marketCategoriesConfig.forEach(cat => {
      if (cat.apiUrl) {
        fetchMarketData(cat.value, cat.apiUrl);
      } else if (cat.value === 'favorites') {
         // Favorites are derived, no fetch needed, but set loading to false if it was ever set.
        setLoadingStates(prev => ({ ...prev, favorites: false}));
      }
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const toggleFavorite = (assetId: string, assetCategory: string) => {
    setAssets(prevAssets => {
      const updatedAssets = { ...prevAssets };
      // Toggle in its specific category
      if (updatedAssets[assetCategory]) {
        updatedAssets[assetCategory] = updatedAssets[assetCategory].map(asset =>
          asset.id === assetId ? { ...asset, favorite: !asset.favorite } : asset
        );
      }
      // Also ensure all_assets (used for favorites tab derivation) reflects this
      // This might need a rethink if 'all_assets' is not directly in state.
      // For now, we'll rebuild favorites tab dynamically.
      return updatedAssets;
    });
  };

  const handleViewAsset = (asset: Asset) => {
    setSelectedAssetForChart(asset);
    toast({
      title: "Chart Updated",
      description: `Displaying chart and details for ${asset.name}.`,
    });
  };

  const filteredAssets = useMemo(() => {
    let sourceAssets: Asset[] = [];
    if (activeTab === 'favorites') {
      sourceAssets = Object.values(assets)
        .flat()
        .filter(asset => asset.favorite && asset.id); // Ensure asset.id is defined
    } else if (assets[activeTab]) {
      sourceAssets = assets[activeTab];
    }
    
    if (!searchTerm) return sourceAssets;
    return sourceAssets.filter(asset =>
      asset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      asset.id.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [assets, activeTab, searchTerm]);


  const isLoadingCurrentTab = loadingStates[activeTab] && activeTab !== 'favorites';
  const errorCurrentTab = errorStates[activeTab]  && activeTab !== 'favorites';

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-3xl font-bold tracking-tight text-primary flex items-center">
          <LineChartIcon className="mr-3 h-8 w-8" /> Markets Overview
        </h1>
        <div className="relative w-full sm:w-auto">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search markets..." className="pl-8 w-full sm:w-64 md:w-80" onChange={handleSearchChange} value={searchTerm} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Asset List and Tabs Section */}
        <Card className="lg:col-span-3 shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl">Explore Trading Instruments</CardTitle>
            <CardDescription>View different market categories and their assets.</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="forex" className="w-full" onValueChange={setActiveTab} value={activeTab}>
              <TabsList className="grid w-full grid-cols-3 sm:grid-cols-5 mb-6">
                {marketCategoriesConfig.map(cat => (
                  <TabsTrigger key={cat.value} value={cat.value}>{cat.label}</TabsTrigger>
                ))}
              </TabsList>
              
              {marketCategoriesConfig.map(cat => (
                <TabsContent key={cat.value} value={cat.value}>
                  {isLoadingCurrentTab && cat.value === activeTab && (
                    <div className="text-center py-10">
                      <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-2" />
                      <p className="text-muted-foreground">Loading {cat.label} data...</p>
                    </div>
                  )}
                  {errorCurrentTab && cat.value === activeTab && (
                     <div className="text-center py-10 text-destructive">
                      <AlertTriangle className="h-8 w-8 mx-auto mb-2" />
                      <p>{errorCurrentTab}</p>
                    </div>
                  )}
                  {!isLoadingCurrentTab && !errorCurrentTab && cat.value === activeTab && (
                    filteredAssets.length > 0 ? (
                      <div className="overflow-x-auto">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Asset</TableHead>
                              <TableHead className="text-right">Price</TableHead>
                              <TableHead className="text-right">Change</TableHead>
                              <TableHead className="text-center hidden sm:table-cell">Favorite</TableHead>
                              <TableHead className="text-right">Action</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {filteredAssets.map(asset => (
                              <TableRow key={asset.id} onClick={() => handleViewAsset(asset)} className="cursor-pointer hover:bg-muted/50">
                                <TableCell className="font-medium py-3">{asset.name}</TableCell>
                                <TableCell className="text-right py-3">
                                  ${typeof asset.price === 'number' ? asset.price.toFixed(asset.id === 'DOGEUSD' ? 4 : 2) : asset.price}
                                </TableCell>
                                <TableCell className={`text-right py-3 ${asset.change.startsWith('+') ? 'text-positive' : 'text-destructive'}`}>
                                  {asset.change}
                                </TableCell>
                                <TableCell className="text-center hidden sm:table-cell py-3">
                                  <Button 
                                    variant="ghost" 
                                    size="icon" 
                                    className={asset.favorite ? "text-accent hover:text-accent/80" : "text-muted-foreground hover:text-muted-foreground/80"}
                                    onClick={(e) => { e.stopPropagation(); toggleFavorite(asset.id, asset.category); }}
                                    aria-label={asset.favorite ? "Remove from favorites" : "Add to favorites"}
                                  >
                                    <Star className={`h-5 w-5 ${asset.favorite ? 'fill-current' : ''}`} />
                                  </Button>
                                </TableCell>
                                <TableCell className="text-right py-3">
                                  <Button variant="outline" size="sm" onClick={(e) => { e.stopPropagation(); handleViewAsset(asset);}}>
                                    <Eye className="mr-1.5 h-4 w-4" /> View
                                  </Button>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    ) : (
                       <p className="text-center py-10 text-muted-foreground">No assets found for "{searchTerm}" in {cat.label}.</p>
                    )
                  )}
                </TabsContent>
              ))}
            </Tabs>
          </CardContent>
        </Card>

        {/* Chart and Details Section */}
        <Card className="lg:col-span-2 shadow-lg h-fit sticky top-20">
          <CardHeader>
            <CardTitle className="text-xl truncate">
              {selectedAssetForChart ? `${selectedAssetForChart.name} Details` : 'Asset Details'}
            </CardTitle>
            <CardDescription>
              {selectedAssetForChart ? `Live data for ${selectedAssetForChart.id}` : 'Select an asset to view its chart and details.'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {selectedAssetForChart ? (
              <div className="space-y-4">
                <div className="aspect-video bg-muted/30 rounded-md flex items-center justify-center">
                  <Image 
                    src={`https://placehold.co/600x300.png?text=${selectedAssetForChart.id}+Chart`} 
                    alt={`${selectedAssetForChart.name} Chart`} 
                    width={600} 
                    height={300}
                    data-ai-hint="market chart graph"
                    className="opacity-70 rounded-md" 
                  />
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                        <p className="text-muted-foreground">Price</p>
                        <p className="font-semibold text-lg">${selectedAssetForChart.price.toFixed(selectedAssetForChart.id === 'DOGEUSD' ? 4 : 2)}</p>
                    </div>
                    <div className="text-right">
                        <p className="text-muted-foreground">Change</p>
                        <p className={`font-semibold text-lg ${selectedAssetForChart.change.startsWith('+') ? 'text-positive' : 'text-destructive'}`}>
                            {selectedAssetForChart.change}
                        </p>
                    </div>
                    <div>
                        <p className="text-muted-foreground">24h High</p>
                        <p className="font-semibold">${selectedAssetForChart.high.toFixed(selectedAssetForChart.id === 'DOGEUSD' ? 4 : 2)}</p>
                    </div>
                     <div className="text-right">
                        <p className="text-muted-foreground">24h Low</p>
                        <p className="font-semibold">${selectedAssetForChart.low.toFixed(selectedAssetForChart.id === 'DOGEUSD' ? 4 : 2)}</p>
                    </div>
                </div>
                <Separator />
                 <Button 
                    variant="accent" 
                    className="w-full"
                    onClick={() => toast({ title: "Trade Action", description: `Initiating trade for ${selectedAssetForChart.name}... (UI Demo)`})}
                >
                    Trade {selectedAssetForChart.name}
                </Button>
              </div>
            ) : (
              <div className="text-center py-10 text-muted-foreground">
                <LineChartIcon className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Select an asset from the list to view its chart and detailed information here.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
