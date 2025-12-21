"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { LayoutDashboard, Package, ShoppingCart, LogOut, Users } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/lib/auth-context"

export function AdminSidebar() {
    const pathname = usePathname()
    const router = useRouter()
    const { logout } = useAuth()

    const handleLogout = () => {
        logout()
    }

    const routes = [
        {
            href: "/admin/dashboard",
            label: "Dashboard",
            icon: LayoutDashboard,
        },
        {
            href: "/admin/products",
            label: "Products",
            icon: Package,
        },
        {
            href: "/admin/orders",
            label: "Orders",
            icon: ShoppingCart,
        },
        {
            href: "/admin/customers",
            label: "Customers",
            icon: Users,
        },
    ]

    return (
        <div className="flex flex-col h-screen border-r bg-muted/10 w-64">
            <div className="p-6">
                <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-orange-500 bg-clip-text text-transparent animate-pulse uppercase">
                    Liora Admin
                </h1>
            </div>
            <div className="flex-1 px-4 space-y-2">
                {routes.map((route) => {
                    const Icon = route.icon
                    return (
                        <Link
                            key={route.href}
                            href={route.href}
                            className={cn(
                                "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground",
                                pathname === route.href ? "bg-accent text-accent-foreground" : "text-muted-foreground",
                            )}
                        >
                            <Icon className="h-4 w-4" />
                            {route.label}
                        </Link>
                    )
                })}
            </div>
            <div className="p-4 border-t">
                <Button variant="ghost" className="w-full justify-start gap-2 text-destructive hover:text-destructive hover:bg-destructive/10" onClick={handleLogout}>
                    <LogOut className="h-4 w-4" />
                    Logout
                </Button>
            </div>
        </div>
    )
}
