"use client"

import { useState } from "react"
import { Search, Filter, TrendingUp, TrendingDown, Flame } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { celebrityCoins } from "@/lib/data"

interface MarketsViewProps {
  onSelectCoin: (coin: typeof celebrityCoins[0]) => void
}

export function MarketsView({ onSelectCoin }: MarketsViewProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")

  const categories = [...new Set(celebrityCoins.map((coin) => coin.category))]

  const filteredCoins = celebrityCoins
    .filter((coin) => {
      const matchesSearch =
        coin.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        coin.celebrity.toLowerCase().includes(searchQuery.toLowerCase()) ||
        coin.fullName.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesCategory = selectedCategory === "all" || coin.category === selectedCategory
      return matchesSearch && matchesCategory
    })
    .sort((a, b) => b.marketCap - a.marketCap)

  const getTrendColor = (change: string) => {
    return change.startsWith("+") ? "text-green-500" : change.startsWith("-") ? "text-red-500" : "text-gray-500"
  }

  const getTrendIcon = (change: string) => {
    return change.startsWith("+") ? (
      <TrendingUp className="h-3 w-3 md:h-4 md:w-4" />
    ) : change.startsWith("-") ? (
      <TrendingDown className="h-3 w-3 md:h-4 md:w-4" />
    ) : null
  }

  return (
    <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-6">
      <div className="mb-4 md:mb-6">
        <h1 className="text-2xl md:text-3xl font-bold mb-2">All Markets</h1>
        <p className="text-sm md:text-base text-muted-foreground">Explore all coins and trading pairs</p>
      </div>

      {/* Search & Category Tabs */}
      <Card className="mb-4 md:mb-6">
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <CardTitle className="flex items-center text-base md:text-lg">
              <Filter className="h-4 w-4 md:h-5 md:w-5 mr-2" />
              Search & Filters
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search coins..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Category Tabs */}
          <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="w-full">
            <TabsList className="w-full grid grid-cols-3 sm:grid-cols-5 h-auto gap-1">
              <TabsTrigger value="all" className="text-xs md:text-sm">All</TabsTrigger>
              {categories.map((category) => (
                <TabsTrigger key={category} value={category} className="text-xs md:text-sm">
                  {category}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </CardContent>
      </Card>

      {/* Stats Cards - Mobile Optimized */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-4 md:mb-6">
        <Card>
          <CardContent className="pt-4 md:pt-6">
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-primary">{filteredCoins.length}</div>
              <div className="text-xs md:text-sm text-muted-foreground">Total Coins</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 md:pt-6">
            <div className="text-center">
              <div className="text-xl md:text-3xl font-bold text-green-500">
                ${(filteredCoins.reduce((sum, c) => sum + c.marketCap, 0) / 1000000000).toFixed(2)}B
              </div>
              <div className="text-xs md:text-sm text-muted-foreground">Market Cap</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 md:pt-6">
            <div className="text-center">
              <div className="text-xl md:text-3xl font-bold text-blue-500">
                ${(filteredCoins.reduce((sum, c) => sum + c.volume24h, 0) / 1000000).toFixed(1)}M
              </div>
              <div className="text-xs md:text-sm text-muted-foreground">24h Volume</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 md:pt-6">
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-purple-500">
                {filteredCoins.filter((c) => c.trend === "rising").length}
              </div>
              <div className="text-xs md:text-sm text-muted-foreground">Trending Up</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Markets List - Mobile Optimized */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base md:text-lg">Market Overview</CardTitle>
          <CardDescription className="text-xs md:text-sm">Real-time price data for all coins</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {/* Desktop Table Header */}
            <div className="hidden md:grid grid-cols-12 gap-4 p-4 bg-muted/30 rounded-lg text-sm font-semibold text-muted-foreground">
              <div className="col-span-1">#</div>
              <div className="col-span-3">Coin</div>
              <div className="col-span-2 text-right">Price</div>
              <div className="col-span-2 text-right">24h Change</div>
              <div className="col-span-2 text-right">Market Cap</div>
              <div className="col-span-2 text-right">Volume 24h</div>
            </div>

            {/* Coin Cards/Rows */}
            {filteredCoins.map((coin, index) => (
              <div
                key={coin.id}
                className="p-3 md:p-4 rounded-lg border border-border hover:bg-accent/50 cursor-pointer transition-colors"
                onClick={() => onSelectCoin(coin)}
              >
                {/* Mobile Layout */}
                <div className="md:hidden space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3 flex-1 min-w-0">
                      <span className="text-sm text-muted-foreground w-6">{index + 1}</span>
                      <Avatar className="h-10 w-10 flex-shrink-0">
                        <AvatarImage src={coin.image || "/placeholder.svg"} alt={coin.celebrity} />
                        <AvatarFallback className="text-sm font-bold bg-gradient-to-br from-primary to-purple-600 text-primary-foreground">
                          {coin.name.substring(0, 2)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center space-x-1">
                          <p className="font-bold text-sm">{coin.name}</p>
                          {parseFloat(coin.change24h) > 50 && <Flame className="h-3 w-3 text-orange-500" />}
                        </div>
                        <p className="text-xs text-muted-foreground truncate">{coin.celebrity}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-mono font-semibold text-sm">${coin.price.toFixed(6)}</p>
                      <div className={`flex items-center justify-end space-x-1 text-xs font-semibold ${getTrendColor(coin.change24h)}`}>
                        {getTrendIcon(coin.change24h)}
                        <span>{coin.change24h}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-between text-xs px-3">
                    <div>
                      <p className="text-muted-foreground">MCap</p>
                      <p className="font-semibold">${(coin.marketCap / 1000000).toFixed(1)}M</p>
                    </div>
                    <div className="text-right">
                      <p className="text-muted-foreground">Vol</p>
                      <p className="font-semibold">${(coin.volume24h / 1000000).toFixed(1)}M</p>
                    </div>
                    <Badge variant="outline" className="self-center">{coin.category}</Badge>
                  </div>
                </div>

                {/* Desktop Layout */}
                <div className="hidden md:grid grid-cols-12 gap-4">
                  <div className="col-span-1 flex items-center">
                    <span className="text-muted-foreground">{index + 1}</span>
                    {parseFloat(coin.change24h) > 50 && <Flame className="h-3 w-3 text-orange-500 ml-2" />}
                  </div>

                  <div className="col-span-3 flex items-center space-x-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={coin.image || "/placeholder.svg"} alt={coin.celebrity} />
                      <AvatarFallback className="text-sm font-bold bg-gradient-to-br from-primary to-purple-600 text-primary-foreground">
                        {coin.name.substring(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-bold">{coin.name}</div>
                      <div className="text-sm text-muted-foreground">{coin.celebrity}</div>
                    </div>
                    <Badge variant="outline" className="ml-2">
                      {coin.category}
                    </Badge>
                  </div>

                  <div className="col-span-2 flex items-center justify-end">
                    <span className="font-mono font-semibold">${coin.price.toFixed(6)}</span>
                  </div>

                  <div className="col-span-2 flex items-center justify-end">
                    <div className={`flex items-center space-x-1 font-semibold ${getTrendColor(coin.change24h)}`}>
                      {getTrendIcon(coin.change24h)}
                      <span>{coin.change24h}</span>
                    </div>
                  </div>

                  <div className="col-span-2 flex items-center justify-end">
                    <span className="font-semibold">${(coin.marketCap / 1000000).toFixed(2)}M</span>
                  </div>

                  <div className="col-span-2 flex items-center justify-end">
                    <span className="font-semibold">${(coin.volume24h / 1000000).toFixed(2)}M</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
