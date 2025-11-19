"use client"

import { useState } from 'react'
import { TrendingUp, LayoutGrid, Wallet, Bell, User, LogOut, Menu, X } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

interface NavigationProps {
  currentView: "trading" | "markets" | "portfolio"
  onViewChange: (view: "trading" | "markets" | "portfolio") => void
  user: { email: string; name?: string } | null
  onAuthClick: () => void
  onLogout: () => void
}

export function Navigation({ currentView, onViewChange, user, onAuthClick, onLogout }: NavigationProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const NavButtons = () => (
    <>
      <Button
        variant={currentView === "trading" ? "default" : "ghost"}
        onClick={() => {
          onViewChange("trading")
          setMobileMenuOpen(false)
        }}
        className="flex items-center space-x-2 w-full md:w-auto justify-start"
      >
        <TrendingUp className="h-4 w-4" />
        <span>Trading</span>
      </Button>

      <Button
        variant={currentView === "markets" ? "default" : "ghost"}
        onClick={() => {
          onViewChange("markets")
          setMobileMenuOpen(false)
        }}
        className="flex items-center space-x-2 w-full md:w-auto justify-start"
      >
        <LayoutGrid className="h-4 w-4" />
        <span>Markets</span>
      </Button>

      <Button
        variant={currentView === "portfolio" ? "default" : "ghost"}
        onClick={() => {
          onViewChange("portfolio")
          setMobileMenuOpen(false)
        }}
        className="flex items-center space-x-2 w-full md:w-auto justify-start"
      >
        <Wallet className="h-4 w-4" />
        <span>Portfolio</span>
      </Button>
    </>
  )

  return (
    <header className="bg-card border-b border-border shadow-sm sticky top-0 z-50">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-3 md:py-4">
          {/* Logo */}
          <div className="flex items-center space-x-2 md:space-x-3">
            <div className="bg-primary p-1.5 md:p-2 rounded-lg">
              <TrendingUp className="h-5 w-5 md:h-6 md:w-6 text-primary-foreground" />
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-2">
            <NavButtons />
          </nav>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-2 md:space-x-4">
            <Badge variant="outline" className="text-primary border-primary/50 bg-primary/10 hidden sm:flex">
              <div className="w-2 h-2 rounded-full bg-primary mr-2 animate-pulse" />
              Live
            </Badge>
            
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="flex items-center space-x-2">
                    <Avatar className="h-6 w-6">
                      <AvatarFallback className="text-xs">
                        {user.name?.charAt(0).toUpperCase() || user.email.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <span className="hidden sm:inline">{user.email.split('@')[0]}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => onViewChange("portfolio")}>
                    <Wallet className="mr-2 h-4 w-4" />
                    Portfolio
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={onLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button size="sm" className="bg-primary hover:bg-primary/90" onClick={onAuthClick}>
                <User className="h-4 w-4 md:mr-2" />
                <span className="hidden md:inline">Login</span>
              </Button>
            )}

            {/* Mobile Menu Button */}
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild className="md:hidden">
                <Button variant="ghost" size="sm">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[250px] sm:w-[300px]">
                <div className="flex flex-col space-y-4 mt-8">
                  <NavButtons />
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  )
}
