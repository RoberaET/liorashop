"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { User, Package, Heart, MapPin, LogOut, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { useAuth } from "@/lib/auth-context"
import { useStore } from "@/lib/store"
// import { db } from "@/lib/db"
import { getUserOrdersAction } from "@/app/actions/order"
import { formatPrice } from "@/lib/utils"
import { Order } from "@/lib/types"
import { useState } from "react"
import { Badge } from "@/components/ui/badge"

export function AccountContent() {
  const router = useRouter()
  const { user, logout, isLoading, updateProfilePicture } = useAuth()
  const [recentOrders, setRecentOrders] = useState<Order[]>([])
  const wishlist = useStore((state) => state.wishlist)

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login")
    } else if (user) {
      // Fetch recent orders
      getUserOrdersAction(user.id).then(res => {
        if (res.orders) {
          setRecentOrders(res.orders.slice(0, 3))
        }
      })
    }
  }, [user, isLoading, router])

  if (isLoading) {
    return <div className="min-h-[50vh] flex items-center justify-center">Loading...</div>
  }

  if (!user) {
    return null
  }

  const handleLogout = () => {
    logout()
  }

  const menuItems = [
    {
      icon: Package,
      title: "Orders",
      description: "View your order history",
      href: "/account/orders",
    },
    {
      icon: Heart,
      title: "Wishlist",
      description: `${wishlist.length} saved items`,
      href: "/wishlist",
    },
    {
      icon: MapPin,
      title: "Addresses",
      description: "Manage shipping addresses",
      href: "/account/addresses",
    },
    {
      icon: Settings,
      title: "Settings",
      description: "Account preferences",
      href: "/account/settings",
    },
  ]

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-8">
          <div className="relative group">
            <Avatar className="h-16 w-16">
              {user.image ? (
                <AvatarFallback className="bg-transparent">
                  <div className="relative h-full w-full">
                    <img src={user.image} alt={user.name} className="h-full w-full object-cover rounded-full" />
                  </div>
                </AvatarFallback>
              ) : (
                <AvatarFallback className="bg-primary text-primary-foreground text-xl">
                  {user.name.charAt(0).toUpperCase()}
                </AvatarFallback>
              )}
            </Avatar>
            <label htmlFor="profile-upload" className="absolute bottom-0 right-0 bg-primary text-primary-foreground p-1 rounded-full cursor-pointer hover:bg-primary/90 transition-colors shadow-sm">
              <Settings className="h-3 w-3" />
              <span className="sr-only">Upload Photo</span>
            </label>
            <input
              id="profile-upload"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0]
                if (file) {
                  const reader = new FileReader()
                  reader.onloadend = () => {
                    const base64 = reader.result as string
                    // updateProfilePicture is now available in useAuth
                    // We need to cast useAuth to include it if types aren't fully updated or just use it
                    // @ts-ignore
                    updateProfilePicture(base64)
                  }
                  reader.readAsDataURL(file)
                }
              }}
            />
          </div>
          <div className="flex-1">
            <h1 className="text-2xl font-serif font-bold">{user.name}</h1>
            <p className="text-muted-foreground">{user.email}</p>
          </div>
          <Button variant="outline" onClick={handleLogout} className="gap-2 bg-transparent">
            <LogOut className="h-4 w-4" />
            Sign Out
          </Button>
        </div>

        {/* Menu Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {menuItems.map((item) => {
            const Icon = item.icon
            return (
              <Link key={item.title} href={item.href}>
                <Card className="h-full hover:shadow-md transition-shadow cursor-pointer">
                  <CardHeader className="flex flex-row items-center gap-4 pb-2">
                    <div className="p-2 rounded-full bg-muted">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{item.title}</CardTitle>
                      <CardDescription>{item.description}</CardDescription>
                    </div>
                  </CardHeader>
                </Card>
              </Link>
            )
          })}
        </div>

        {/* Recent Activity */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Your latest orders and activity</CardDescription>
          </CardHeader>
          <CardContent>
            {recentOrders.length > 0 ? (
              <div className="space-y-4">
                {recentOrders.map((order) => (
                  <div key={order.id} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                    <div>
                      <p className="font-medium">Order #{order.id}</p>
                      <p className="text-sm text-muted-foreground">{new Date(order.createdAt).toLocaleDateString()}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <Badge variant="outline" className={
                        order.status === "delivered" ? "bg-green-100 text-green-800" :
                          order.status === "shipped" ? "bg-blue-100 text-blue-800" :
                            order.status === "cancelled" ? "bg-red-100 text-red-800" :
                              "bg-yellow-100 text-yellow-800"
                      }>
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </Badge>
                      <p className="font-semibold">{formatPrice(order.total)}</p>
                    </div>
                  </div>
                ))}
                <Button variant="link" asChild className="w-full mt-2">
                  <Link href="/account/orders">View All Orders</Link>
                </Button>
              </div>
            ) : (
              <div className="text-center py-8">
                <User className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No recent orders</p>
                <Button asChild variant="outline" className="mt-4 bg-transparent">
                  <Link href="/">Start Shopping</Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
