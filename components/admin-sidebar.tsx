
"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import {
    LayoutDashboard,
    ShoppingBag,
    Store,
    Users,
    Settings,
    LogOut,
    TicketPercent,
    Package, // Added back
    ShoppingCart // Added back
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/lib/auth-context"

export function AdminSidebar({ className }: { className?: string }) {
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
        {
            href: "/admin/coupons",
            label: "Coupons",
            icon: TicketPercent,
        },
        {
            href: "/admin/settings",
            label: "Settings",
            icon: Settings,
        },
    ]

    return (
        <div className={cn("flex flex-col h-screen border-r bg-slate-900 text-slate-50 w-64 shadow-xl", className)}>
            <div className="p-6">
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent uppercase tracking-wider">
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
                                "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200",
                                "hover:bg-blue-800/50 hover:translate-x-1",
                                pathname === route.href
                                    ? "bg-blue-600 text-white shadow-md shadow-blue-900/20"
                                    : "text-slate-400 hover:text-slate-100",
                            )}
                        >
                            <Icon className="h-4 w-4" />
                            {route.label}
                        </Link>
                    )
                })}
            </div>
            <div className="p-4 border-t border-slate-800">
                <Button variant="ghost" className="w-full justify-start gap-2 text-red-400 hover:text-red-300 hover:bg-red-950/30" onClick={handleLogout}>
                    <LogOut className="h-4 w-4" />
                    Logout
                </Button>
            </div>
        </div>
    )
}
