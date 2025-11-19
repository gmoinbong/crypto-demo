"use client"

import { useState } from "react"
import { TrendingUp, TrendingDown, ArrowUp, ArrowDown, DollarSign, Users, Activity, Flame, AlertTriangle, ChevronLeft } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer } from "recharts"
import { celebrityCoins } from "@/lib/data"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useToast } from "@/hooks/use-toast"

const generatePriceHistory = (basePrice: number) => {
  const data = []
  let price = basePrice * 0.7
  for (let i = 0; i < 30; i++) {
    price = price * (1 + (Math.random() - 0.45) * 0.1)
    data.push({
      time: `${i}h`,
      price: price,
      volume: Math.random() * 1000000 + 500000,
    })
  }
  return data
}

interface TradingViewProps {
  selectedCoin: typeof celebrityCoins[0]
  setSelectedCoin: (coin: typeof celebrityCoins[0]) => void
  user: { email: string; name?: string } | null
  onTrade: (coinId: number, amount: number, price: number, type: 'buy' | 'sell') => void
}

export function TradingView({ selectedCoin, setSelectedCoin, user, onTrade }: TradingViewProps) {
  const [buyAmount, setBuyAmount] = useState("")
  const [sellAmount, setSellAmount] = useState("")
  const [chartTimeframe, setChartTimeframe] = useState("24h")
  const [showCoinList, setShowCoinList] = useState(false)
  const { toast } = useToast()

  const priceHistory = generatePriceHistory(selectedCoin.price)

  const handleBuy = () => {
    if (!user) {
      toast({
        title: "Login Required",
        description: "Please login to start trading",
        variant: "destructive"
      })
      return
    }
    
    const amount = parseFloat(buyAmount)
    if (!amount || amount <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid amount",
        variant: "destructive"
      })
      return
    }

    const tokens = amount / selectedCoin.price
    onTrade(selectedCoin.id, tokens, selectedCoin.price, 'buy')
    
    toast({
      title: "Trade Executed",
      description: `Successfully bought ${tokens.toFixed(2)} ${selectedCoin.name}`,
    })
    
    setBuyAmount("")
  }

  const handleSell = () => {
    if (!user) {
      toast({
        title: "Login Required",
        description: "Please login to start trading",
        variant: "destructive"
      })
      return
    }
    
    const tokens = parseFloat(sellAmount)
    if (!tokens || tokens <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid amount",
        variant: "destructive"
      })
      return
    }

    const usdtAmount = tokens * selectedCoin.price
    onTrade(selectedCoin.id, tokens, selectedCoin.price, 'sell')
    
    toast({
      title: "Trade Executed",
      description: `Successfully sold ${tokens.toFixed(2)} ${selectedCoin.name} for $${usdtAmount.toFixed(2)}`,
    })
    
    setSellAmount("")
  }

  const getTrendIcon = (trend: string) => {
    return trend === "rising" ? (
      <ArrowUp className="h-4 w-4 text-green-500" />
    ) : trend === "declining" ? (
      <ArrowDown className="h-4 w-4 text-red-500" />
    ) : null
  }

  const getTrendColor = (change: string) => {
    return change.startsWith("+") ? "text-green-500" : change.startsWith("-") ? "text-red-500" : "text-gray-500"
  }

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "low":
        return "text-green-500 bg-green-500/10"
      case "medium":
        return "text-yellow-500 bg-yellow-500/10"
      case "high":
        return "text-red-500 bg-red-500/10"
      default:
        return "text-gray-500 bg-gray-500/10"
    }
  }

  return (
    <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-6">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 md:gap-6">
        {/* Coin List Sidebar - Hidden on mobile by default */}
        <div className={`lg:col-span-1 space-y-4 ${showCoinList ? 'block' : 'hidden lg:block'}`}>
          {/* Mobile back button */}
          <Button 
            variant="ghost" 
            className="lg:hidden mb-2"
            onClick={() => setShowCoinList(false)}
          >
            <ChevronLeft className="h-4 w-4 mr-2" />
            Back to Trading
          </Button>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-base md:text-lg flex items-center">
                <Flame className="h-5 w-5 mr-2 text-primary" />
                Top Movers
              </CardTitle>
              <CardDescription className="text-xs md:text-sm">Trending coins</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {celebrityCoins
                .sort((a, b) => parseFloat(b.change24h) - parseFloat(a.change24h))
                .map((coin) => (
                  <div
                    key={coin.id}
                    className={`p-3 rounded-lg border cursor-pointer transition-all hover:border-primary/50 ${
                      selectedCoin.id === coin.id ? "border-primary bg-primary/5" : "border-border"
                    }`}
                    onClick={() => {
                      setSelectedCoin(coin)
                      setShowCoinList(false)
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2 flex-1 min-w-0">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={coin.image || "/placeholder.svg"} alt={coin.celebrity} />
                          <AvatarFallback className="text-xs font-bold bg-gradient-to-br from-primary to-purple-600 text-primary-foreground">
                            {coin.name.substring(0, 2)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-1">
                            <p className="font-bold text-sm">{coin.name}</p>
                            {coin.trend === "rising" && parseFloat(coin.change24h) > 50 && (
                              <Flame className="h-3 w-3 text-orange-500" />
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground truncate">{coin.celebrity}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xs font-mono">${coin.price.toFixed(6)}</p>
                        <p className={`text-xs font-semibold ${getTrendColor(coin.change24h)}`}>
                          {coin.change24h}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
            </CardContent>
          </Card>
        </div>

        {/* Main Trading Area */}
        <div className={`lg:col-span-2 space-y-4 ${showCoinList ? 'hidden lg:block' : 'block'}`}>
          {/* Mobile: Show other coins button */}
          <Button 
            variant="outline" 
            className="lg:hidden w-full mb-2"
            onClick={() => setShowCoinList(true)}
          >
            View All Coins
          </Button>

          {/* Coin Header - Mobile Optimized */}
          <Card className="border-2 border-primary/20">
            <CardContent className="pt-4 md:pt-6">
              <div className="flex flex-col md:flex-row md:items-start justify-between mb-4 gap-4">
                <div className="flex items-center space-x-3 md:space-x-4">
                  <Avatar className="h-12 w-12 md:h-16 md:w-16 border-2 border-primary flex-shrink-0">
                    <AvatarImage src={selectedCoin.image || "/placeholder.svg"} alt={selectedCoin.celebrity} />
                    <AvatarFallback className="text-lg md:text-xl font-bold bg-gradient-to-br from-primary to-purple-600 text-primary-foreground">
                      {selectedCoin.name.substring(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="text-lg md:text-2xl font-bold">{selectedCoin.fullName}</h2>
                      <Badge variant="outline" className="text-xs">{selectedCoin.name}</Badge>
                      <Badge className="bg-secondary text-secondary-foreground text-xs">{selectedCoin.category}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">{selectedCoin.celebrity}</p>
                    <div className="flex flex-wrap items-center gap-2 mt-2">
                      <Badge className={getRiskColor(selectedCoin.riskLevel)}>
                        {selectedCoin.riskLevel} risk
                      </Badge>
                      {selectedCoin.recommendation === "buy" && (
                        <Badge className="bg-green-500/10 text-green-500">
                          <TrendingUp className="h-3 w-3 mr-1" />
                          Strong Buy
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
                <div className="text-left md:text-right">
                  <div className="text-2xl md:text-3xl font-bold font-mono">${selectedCoin.price.toFixed(6)}</div>
                  <div className={`text-base md:text-lg font-semibold flex items-center md:justify-end ${getTrendColor(selectedCoin.change24h)}`}>
                    {selectedCoin.change24h}
                    {getTrendIcon(selectedCoin.trend)}
                  </div>
                  <div className="text-xs md:text-sm text-muted-foreground">24h Change</div>
                </div>
              </div>

              {/* Alerts */}
              {selectedCoin.alerts && selectedCoin.alerts.length > 0 && (
                <div className="space-y-2">
                  {selectedCoin.alerts.map((alert, index) => (
                    <Alert key={index} className="border-primary/50 bg-primary/5">
                      <AlertTriangle className="h-4 w-4 text-primary" />
                      <AlertDescription className="text-xs md:text-sm">{alert}</AlertDescription>
                    </Alert>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Price Chart - Mobile Optimized */}
          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <CardTitle className="text-base md:text-lg">Price Chart</CardTitle>
                <div className="flex space-x-2">
                  {["1h", "24h", "7d", "30d"].map((tf) => (
                    <Button
                      key={tf}
                      size="sm"
                      variant={chartTimeframe === tf ? "default" : "ghost"}
                      onClick={() => setChartTimeframe(tf)}
                      className="h-7 text-xs flex-1 sm:flex-none"
                    >
                      {tf}
                    </Button>
                  ))}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  price: { label: "Price", color: "hsl(var(--primary))" },
                }}
                className="h-[250px] md:h-[400px]"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={priceHistory}>
                    <defs>
                      <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="time" stroke="hsl(var(--muted-foreground))" fontSize={10} />
                    <YAxis
                      stroke="hsl(var(--muted-foreground))"
                      fontSize={10}
                      tickFormatter={(value) => `$${value.toFixed(6)}`}
                    />
                    <ChartTooltip
                      content={<ChartTooltipContent />}
                      formatter={(value: any) => [`$${value.toFixed(6)}`, "Price"]}
                    />
                    <Area
                      type="monotone"
                      dataKey="price"
                      stroke="hsl(var(--primary))"
                      strokeWidth={2}
                      fill="url(#colorPrice)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>

          {/* Stats Grid - Mobile Optimized */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
            <Card>
              <CardContent className="pt-4 md:pt-6">
                <div className="flex items-center space-x-2 mb-2">
                  <DollarSign className="h-3 w-3 md:h-4 md:w-4 text-muted-foreground" />
                  <p className="text-xs text-muted-foreground">Market Cap</p>
                </div>
                <p className="text-lg md:text-2xl font-bold">${(selectedCoin.marketCap / 1000000).toFixed(1)}M</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-4 md:pt-6">
                <div className="flex items-center space-x-2 mb-2">
                  <Activity className="h-3 w-3 md:h-4 md:w-4 text-muted-foreground" />
                  <p className="text-xs text-muted-foreground">24h Volume</p>
                </div>
                <p className="text-lg md:text-2xl font-bold">${(selectedCoin.volume24h / 1000000).toFixed(1)}M</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-4 md:pt-6">
                <div className="flex items-center space-x-2 mb-2">
                  <Users className="h-3 w-3 md:h-4 md:w-4 text-muted-foreground" />
                  <p className="text-xs text-muted-foreground">Holders</p>
                </div>
                <p className="text-lg md:text-2xl font-bold">{(selectedCoin.holders / 1000).toFixed(1)}K</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-4 md:pt-6">
                <div className="flex items-center space-x-2 mb-2">
                  <TrendingUp className="h-3 w-3 md:h-4 md:w-4 text-muted-foreground" />
                  <p className="text-xs text-muted-foreground">7d Change</p>
                </div>
                <p className={`text-lg md:text-2xl font-bold ${getTrendColor(selectedCoin.change7d)}`}>
                  {selectedCoin.change7d}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Trading Panel - Mobile Optimized */}
        <div className={`lg:col-span-1 space-y-4 ${showCoinList ? 'hidden lg:block' : 'block'}`}>
          <Card>
            <CardHeader>
              <CardTitle className="text-base md:text-lg">Trade {selectedCoin.name}</CardTitle>
              <CardDescription className="text-xs md:text-sm">Buy or sell instantly</CardDescription>
            </CardHeader>
            <CardContent>
              {!user ? (
                <div className="text-center py-6 md:py-8 space-y-4">
                  <AlertTriangle className="h-10 w-10 md:h-12 md:w-12 mx-auto text-muted-foreground" />
                  <div>
                    <p className="font-semibold mb-2 text-sm md:text-base">Login Required</p>
                    <p className="text-xs md:text-sm text-muted-foreground">
                      Please login or create an account to start trading
                    </p>
                  </div>
                </div>
              ) : (
                <Tabs defaultValue="buy" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="buy" className="data-[state=active]:bg-green-500/20 data-[state=active]:text-green-500 text-xs md:text-sm">
                      Buy
                    </TabsTrigger>
                    <TabsTrigger value="sell" className="data-[state=active]:bg-red-500/20 data-[state=active]:text-red-500 text-xs md:text-sm">
                      Sell
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="buy" className="space-y-4 mt-4">
                    <div className="space-y-2">
                      <label className="text-xs md:text-sm font-medium">Amount (USDT)</label>
                      <Input
                        type="number"
                        placeholder="0.00"
                        value={buyAmount}
                        onChange={(e) => setBuyAmount(e.target.value)}
                        className="font-mono"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs md:text-sm font-medium">You'll receive</label>
                      <div className="p-3 rounded-lg bg-secondary text-secondary-foreground">
                        <p className="text-base md:text-lg font-mono font-bold">
                          {buyAmount ? (parseFloat(buyAmount) / selectedCoin.price).toFixed(2) : "0.00"} {selectedCoin.name}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {[25, 50, 75, 100].map((percent) => (
                        <Button
                          key={percent}
                          size="sm"
                          variant="outline"
                          onClick={() => setBuyAmount(((1000 * percent) / 100).toString())}
                          className="flex-1 text-xs"
                        >
                          {percent}%
                        </Button>
                      ))}
                    </div>
                    <Button 
                      className="w-full bg-green-500 hover:bg-green-600 text-white"
                      onClick={handleBuy}
                    >
                      Buy {selectedCoin.name}
                    </Button>
                  </TabsContent>

                  <TabsContent value="sell" className="space-y-4 mt-4">
                    <div className="space-y-2">
                      <label className="text-xs md:text-sm font-medium">Amount ({selectedCoin.name})</label>
                      <Input
                        type="number"
                        placeholder="0.00"
                        value={sellAmount}
                        onChange={(e) => setSellAmount(e.target.value)}
                        className="font-mono"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs md:text-sm font-medium">You'll receive</label>
                      <div className="p-3 rounded-lg bg-secondary text-secondary-foreground">
                        <p className="text-base md:text-lg font-mono font-bold">
                          ${sellAmount ? (parseFloat(sellAmount) * selectedCoin.price).toFixed(2) : "0.00"} USDT
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {[25, 50, 75, 100].map((percent) => (
                        <Button
                          key={percent}
                          size="sm"
                          variant="outline"
                          onClick={() => setSellAmount(((10000 * percent) / 100).toString())}
                          className="flex-1 text-xs"
                        >
                          {percent}%
                        </Button>
                      ))}
                    </div>
                    <Button 
                      className="w-full bg-red-500 hover:bg-red-600 text-white"
                      onClick={handleSell}
                    >
                      Sell {selectedCoin.name}
                    </Button>
                  </TabsContent>
                </Tabs>
              )}
            </CardContent>
          </Card>

          {/* Token Details - Collapsible on mobile */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm md:text-lg">Token Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-xs md:text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">ATH</span>
                <span className="font-mono font-semibold">${selectedCoin.allTimeHigh.toFixed(6)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">ATL</span>
                <span className="font-mono font-semibold">${selectedCoin.allTimeLow.toFixed(6)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Circulating Supply</span>
                <span className="font-mono font-semibold">{(selectedCoin.circulatingSupply / 1000000000).toFixed(0)}B</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Max Supply</span>
                <span className="font-mono font-semibold">{(selectedCoin.maxSupply / 1000000000).toFixed(0)}B</span>
              </div>
            </CardContent>
          </Card>

          {/* Social Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm md:text-lg">Social Metrics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-xs md:text-sm">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Twitter Followers</span>
                <span className="font-semibold">{(selectedCoin.social.twitter / 1000).toFixed(0)}K</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Telegram Members</span>
                <span className="font-semibold">{(selectedCoin.social.telegram / 1000).toFixed(0)}K</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Reddit Members</span>
                <span className="font-semibold">{(selectedCoin.social.reddit / 1000).toFixed(0)}K</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
