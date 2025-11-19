"use client"

import { useState } from "react"
import { TradingView } from "./components/trading-view"
import { MarketsView } from "./components/markets-view"
import { PortfolioView } from "./components/portfolio-view"
import { Navigation } from "./components/navigation"
import { AuthModal } from "./components/auth-modal"
import { celebrityCoins } from "@/lib/data"

export default function Exchange() {
  const [currentView, setCurrentView] = useState<"trading" | "markets" | "portfolio">("trading")
  const [selectedCoin, setSelectedCoin] = useState(celebrityCoins[0])
  const [user, setUser] = useState<{ email: string; name?: string } | null>(null)
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [portfolio, setPortfolio] = useState<{ coinId: number; amount: number; avgPrice: number }[]>([])

  const handleLogin = (email: string) => {
    setUser({ email })
  }

  const handleLogout = () => {
    setUser(null)
    setPortfolio([])
  }

  const handleTrade = (coinId: number, amount: number, price: number, type: 'buy' | 'sell') => {
    setPortfolio(prev => {
      const existing = prev.find(p => p.coinId === coinId)
      if (type === 'buy') {
        if (existing) {
          const totalAmount = existing.amount + amount
          const totalValue = (existing.amount * existing.avgPrice) + (amount * price)
          return prev.map(p => p.coinId === coinId 
            ? { ...p, amount: totalAmount, avgPrice: totalValue / totalAmount }
            : p
          )
        } else {
          return [...prev, { coinId, amount, avgPrice: price }]
        }
      } else {
        if (existing) {
          const newAmount = existing.amount - amount
          if (newAmount <= 0) {
            return prev.filter(p => p.coinId !== coinId)
          }
          return prev.map(p => p.coinId === coinId ? { ...p, amount: newAmount } : p)
        }
        return prev
      }
    })
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation 
        currentView={currentView} 
        onViewChange={setCurrentView}
        user={user}
        onAuthClick={() => setShowAuthModal(true)}
        onLogout={handleLogout}
      />

      {currentView === "trading" && (
        <TradingView
          selectedCoin={selectedCoin}
          setSelectedCoin={setSelectedCoin}
          user={user}
          onTrade={handleTrade}
        />
      )}
      {currentView === "markets" && (
        <MarketsView 
          onSelectCoin={(coin) => {
            setSelectedCoin(coin)
            setCurrentView("trading")
          }}
        />
      )}
      {currentView === "portfolio" && (
        <PortfolioView 
          user={user}
          portfolio={portfolio}
          onSelectCoin={(coin) => {
            setSelectedCoin(coin)
            setCurrentView("trading")
          }}
        />
      )}

      <AuthModal 
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onLogin={handleLogin}
      />
    </div>
  )
}
