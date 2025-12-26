"use client"

import type React from "react"
import Link from "next/link"
import { useState } from "react"
import { ShoppingBag, Heart, User, Search, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useStore } from "@/lib/store"
import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import { useLanguage } from "@/lib/language-context"
import { useMounted } from "@/hooks/use-mounted"
import { searchProducts } from "@/lib/data"
import { formatPrice } from "@/lib/utils"
import { useRef, useEffect } from "react"
import type { Product } from "@/lib/types"
import Image from "next/image"
import dynamic from "next/dynamic"
import { db } from "@/lib/db"

// Dynamically import components to avoid hydration mismatch with Radix UI IDs
const LanguageSwitcher = dynamic(() => import("./language-switcher").then(mod => mod.LanguageSwitcher), { ssr: false })
const MobileMenu = dynamic(() => import("./mobile-menu").then(mod => mod.MobileMenu), { ssr: false })
const ModeToggle = dynamic(() => import("./mode-toggle").then(mod => mod.ModeToggle), { ssr: false })

export function Navbar() {
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<Product[]>([])
  const searchRef = useRef<HTMLDivElement>(null)
  const router = useRouter()
  const cart = useStore((state) => state.cart)
  const wishlist = useStore((state) => state.wishlist)
  const { user, logout } = useAuth()
  const { t } = useLanguage()
  const mounted = useMounted()

  const cartCount = mounted ? cart.reduce((count, item) => count + item.quantity, 0) : 0
  const wishlistCount = mounted ? wishlist.length : 0
  const currentUser = mounted ? user : null

  const navLinks = [
    { href: "/category/clothes", label: t.navbar.clothes },
    { href: "/category/shoes", label: t.navbar.shoes },
    { href: "/category/cosmetics", label: t.navbar.cosmetics },
    { href: "/category/perfumes", label: t.navbar.perfumes },
  ]



  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setSearchOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`)
      setSearchQuery("")
      setSearchOpen(false)
      setSearchResults([])
    }
  }

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value
    setSearchQuery(query)
    if (query.trim()) {
      // Search from dynamic DB instead of static file
      const allProducts = db.getAllProducts();
      const filtered = allProducts.filter(p =>
        p.name.toLowerCase().includes(query.toLowerCase()) ||
        p.category.toLowerCase().includes(query.toLowerCase())
      );
      setSearchResults(filtered)
    } else {
      setSearchResults([])
    }
  }

  const handleProductClick = () => {
    setSearchOpen(false)
    setSearchQuery("")
    setSearchResults([])
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        {/* Main Header Row */}
        <div className="grid grid-cols-3 items-center h-20">

          {/* Left: Search */}
          <div className="flex items-center justify-start">
            <div className="relative" ref={searchRef}>
              {searchOpen ? (
                <form onSubmit={handleSearch} className="flex items-center gap-2 relative">
                  <div className="relative">
                    <Input
                      type="search"
                      placeholder={t.navbar.searchPlaceholder}
                      value={searchQuery}
                      onChange={handleSearchChange}
                      className="w-40 md:w-64 border-none bg-muted/30 focus-visible:ring-1 focus-visible:ring-primary/20 rounded-full px-4 h-9"
                      autoFocus
                    />
                    {/* Search Results Dropdown */}
                    {searchQuery && searchResults.length > 0 && (
                      <div className="absolute top-full left-0 w-full mt-2 bg-background border border-border rounded-md shadow-lg z-50 max-h-80 overflow-y-auto">
                        <div className="p-2 space-y-1">
                          {searchResults.map((product) => (
                            <Link
                              key={product.id}
                              href={`/product/${product.id}`}
                              className="flex items-center gap-3 p-2 hover:bg-muted rounded-sm transition-colors"
                              onClick={handleProductClick}
                            >
                              <div className="relative h-10 w-10 rounded overflow-hidden flex-shrink-0 bg-muted">
                                <Image
                                  src={product.image || "/placeholder.svg"}
                                  alt={product.name}
                                  fill
                                  className="object-cover"
                                />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium line-clamp-1">{product.name}</p>
                                <p className="text-xs text-muted-foreground">{formatPrice(product.price)}</p>
                              </div>
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}
                    {searchQuery && searchResults.length === 0 && (
                      <div className="absolute top-full left-0 w-full mt-2 bg-background border border-border rounded-md shadow-lg z-50 p-4 text-center text-sm text-muted-foreground">
                        {t.navbar.noResults}
                      </div>
                    )}
                  </div>
                  <Button type="button" variant="ghost" size="icon" onClick={() => setSearchOpen(false)} className="rounded-full h-8 w-8 hover:bg-transparent">
                    <X className="h-4 w-4 text-muted-foreground" />
                    <span className="sr-only">{t.navbar.close}</span>
                  </Button>
                </form>
              ) : (
                <Button variant="ghost" size="sm" className="gap-2 px-0 hover:bg-transparent text-muted-foreground hover:text-foreground font-light text-sm tracking-wide" onClick={() => setSearchOpen(true)}>
                  <Search className="h-4 w-4" />
                  <span className="hidden md:inline-block">Search</span>
                </Button>
              )}
            </div>
          </div>

          {/* Center: Logo */}
          <div className="flex items-center justify-center">
            <Link href="/" className="flex items-center gap-2 group">
              <span className="text-3xl font-serif font-bold tracking-tight group-hover:opacity-80 transition-opacity">LIORA SHOP</span>
            </Link>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center justify-end gap-1 md:gap-4">
            <LanguageSwitcher />
            <ModeToggle />

            {/* Wishlist */}
            <Button variant="ghost" size="icon" className="relative hidden md:flex hover:bg-transparent" id="nav-wishlist-icon" asChild>
              <Link href="/wishlist">
                <Heart className="h-5 w-5 stroke-1" />
                {wishlistCount > 0 && (
                  <Badge
                    className="absolute -top-1 -right-1 h-4 w-4 rounded-full p-0 flex items-center justify-center text-[10px] bg-black text-white border-none"
                  >
                    {wishlistCount}
                  </Badge>
                )}
                <span className="sr-only">{t.navbar.wishlist}</span>
              </Link>
            </Button>

            {/* Cart */}
            <Button variant="ghost" size="icon" className="relative hidden md:flex hover:bg-transparent" id="nav-cart-icon" asChild>
              <Link href="/cart">
                <ShoppingBag className="h-5 w-5 stroke-1" />
                {cartCount > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-4 w-4 rounded-full p-0 flex items-center justify-center text-[10px] bg-black text-white border-none">
                    {cartCount}
                  </Badge>
                )}
                <span className="sr-only">{t.navbar.cart}</span>
              </Link>
            </Button>

            {/* User */}
            {currentUser ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="hidden md:flex rounded-full hover:bg-transparent">
                    <Avatar className="h-8 w-8 hover:opacity-80 transition-opacity border border-border/50">
                      {currentUser.image ? (
                        <AvatarImage src={currentUser.image} alt={currentUser.name} className="object-cover" />
                      ) : (
                        <AvatarFallback className="bg-muted text-xs font-light">
                          {currentUser.name.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      )}
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuItem asChild>
                    <Link href="/account" className="cursor-pointer">{t.navbar.myAccount}</Link>
                  </DropdownMenuItem>
                  {currentUser.role === 'admin' && (
                    <DropdownMenuItem asChild>
                      <Link href="/admin/dashboard" className="cursor-pointer">{t.navbar.adminDashboard}</Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem onClick={logout} className="cursor-pointer text-red-500 focus:text-red-500">
                    {t.navbar.logout}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button variant="ghost" size="icon" className="hidden md:flex hover:bg-transparent" asChild>
                <Link href="/login">
                  <User className="h-5 w-5 stroke-1" />
                  <span className="sr-only">{t.navbar.account}</span>
                </Link>
              </Button>
            )}

            {/* Mobile Menu */}
            <div className="md:hidden">
              <MobileMenu />
            </div>
          </div>
        </div>

        {/* Bottom Row: Navigation */}
        <nav className="hidden md:flex items-center justify-center py-4 border-t border-border/30">
          <ul className="flex items-center gap-10">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-sm font-light uppercase tracking-wider text-muted-foreground hover:text-foreground transition-all hover:tracking-widest duration-300"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  )
}
