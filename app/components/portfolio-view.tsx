"use client"

import { useState } from "react"
import { Wallet, TrendingUp, TrendingDown, DollarSign, PieChart, Activity, AlertTriangle } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { celebrityCoins } from "@/lib/data"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface PortfolioViewProps {
  user: { email: string; name?: string } | null
  portfolio: { coinId: number; amount: number; avgPrice: number }[]
  onSelectCoin: (coin: typeof celebrityCoins[0]) => void
}

export function PortfolioView({ user, portfolio, onSelectCoin }: PortfolioViewProps) {
  if (!user) {
    return (
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-12">
        <Card className="max-w-md mx-auto">
          <CardContent className="pt-12 pb-12 text-center">
            <Wallet className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
            <h2 className="text-2xl font-bold mb-2">Login Required</h2>
            <p className="text-muted-foreground mb-6">
              Please login to view your portfolio and track your investments
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  const portfolioWithDetails = portfolio.map(p => {
    const coin = celebrityCoins.find(c => c.id === p.coinId)!
    const currentValue = p.amount * coin.price
    const initialValue = p.amount * p.avgPrice
    const profitLoss = currentValue - initialValue
    const profitLossPercent = ((profitLoss / initialValue) * 100).toFixed(2)
    
    return { ...p, coin, currentValue, initialValue, profitLoss, profitLossPercent }
  })

  const totalValue = portfolioWithDetails.reduce((sum, p) => sum + p.currentValue, 0)
  const totalInvested = portfolioWithDetails.reduce((sum, p) => sum + p.initialValue, 0)
  const totalProfitLoss = totalValue - totalInvested
  const totalProfitLossPercent = totalInvested > 0 ? ((totalProfitLoss / totalInvested) * 100).toFixed(2) : "0.00"

  return (
    <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-6">
      <div className="mb-4 md:mb-6">
        <h1 className="text-2xl md:text-3xl font-bold mb-2">Portfolio</h1>
        <p className="text-sm md:text-base text-muted-foreground">Track your investments</p>
      </div>

      {/* Portfolio Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4 md:mb-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2 mb-2">
              <Wallet className="h-4 w-4 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">Total Value</p>
            </div>
            <p className="text-2xl md:text-3xl font-bold">${totalValue.toFixed(2)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2 mb-2">
              <DollarSign className="h-4 w-4 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">Total Invested</p>
            </div>
            <p className="text-2xl md:text-3xl font-bold">${totalInvested.toFixed(2)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2 mb-2">
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">Total P&L</p>
            </div>
            <p className={`text-2xl md:text-3xl font-bold ${totalProfitLoss >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              ${Math.abs(totalProfitLoss).toFixed(2)}
            </p>
            <p className={`text-sm ${totalProfitLoss >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              {totalProfitLoss >= 0 ? '+' : '-'}{Math.abs(parseFloat(totalProfitLossPercent))}%
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2 mb-2">
              <PieChart className="h-4 w-4 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">Holdings</p>
            </div>
            <p className="text-2xl md:text-3xl font-bold">{portfolio.length}</p>
            <p className="text-sm text-muted-foreground">Coins</p>
          </CardContent>
        </Card>
      </div>

      {/* Holdings List */}
      <Card>
        <CardHeader>
          <CardTitle>Your Holdings</CardTitle>
          <CardDescription>Detailed view of your investments</CardDescription>
        </CardHeader>
        <CardContent>
          {portfolio.length === 0 ? (
            <div className="text-center py-12">
              <Activity className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">No holdings yet</h3>
              <p className="text-muted-foreground mb-6">
                Start trading to build your portfolio
              </p>
              <Button onClick={() => onSelectCoin(celebrityCoins[0])}>
                Start Trading
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {portfolioWithDetails.map((holding) => (
                <div
                  key={holding.coinId}
                  className="p-3 md:p-4 rounded-lg border border-border hover:bg-accent/50 cursor-pointer transition-colors"
                  onClick={() => onSelectCoin(holding.coin)}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    {/* Coin Info */}
                    <div className="flex items-center space-x-3 min-w-0 flex-1">
                      <Avatar className="h-10 w-10 md:h-12 md:w-12 flex-shrink-0">
                        <AvatarImage src={holding.coin.image || "/placeholder.svg"} alt={holding.coin.celebrity} />
                        <AvatarFallback className="text-sm font-bold bg-gradient-to-br from-primary to-purple-600 text-primary-foreground">
                          {holding.coin.name.substring(0, 2)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center space-x-2">
                          <p className="font-bold text-sm md:text-base">{holding.coin.name}</p>
                          <Badge variant="outline" className="text-xs">{holding.coin.category}</Badge>
                        </div>
                        <p className="text-xs md:text-sm text-muted-foreground truncate">{holding.coin.celebrity}</p>
                        <p className="text-xs text-muted-foreground font-mono mt-1">
                          {holding.amount.toFixed(2)} tokens @ ${holding.avgPrice.toFixed(6)}
                        </p>
                      </div>
                    </div>

                    {/* Values - Mobile Optimized */}
                    <div className="grid grid-cols-2 sm:flex sm:space-x-6 gap-3 sm:gap-0">
                      <div className="text-left sm:text-right">
                        <p className="text-xs text-muted-foreground">Current Value</p>
                        <p className="text-sm md:text-base font-bold">${holding.currentValue.toFixed(2)}</p>
                      </div>
                      <div className="text-left sm:text-right">
                        <p className="text-xs text-muted-foreground">P&L</p>
                        <p className={`text-sm md:text-base font-bold ${holding.profitLoss >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                          {holding.profitLoss >= 0 ? '+' : '-'}${Math.abs(holding.profitLoss).toFixed(2)}
                        </p>
                        <p className={`text-xs ${holding.profitLoss >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                          {holding.profitLoss >= 0 ? '+' : '-'}{Math.abs(parseFloat(holding.profitLossPercent))}%
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
