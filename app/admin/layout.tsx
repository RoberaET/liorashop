"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { AdminSidebar } from "@/components/admin-sidebar"
import { useAuth } from "@/lib/auth-context"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const router = useRouter()
    const { user, isLoading } = useAuth()
    const [isAuthorized, setIsAuthorized] = useState(false)

    useEffect(() => {
        if (!isLoading) {
            if (!user || user.role !== "admin") {
                router.push("/")
            } else {
                setIsAuthorized(true)
            }
        }
    }, [isLoading, user, router])

    if (isLoading || !isAuthorized) {
        return <div className="min-h-screen flex items-center justify-center">Loading...</div>
    }

    return (
        <div className="flex min-h-screen flex-col md:flex-row">
            {/* Mobile Header */}
            <div className="md:hidden flex items-center p-4 border-b bg-slate-900 text-white">
                <Sheet>
                    <SheetTrigger asChild>
                        <Button variant="ghost" size="icon" className="text-white hover:bg-slate-800">
                            <Menu className="h-6 w-6" />
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="p-0 border-r-slate-800 bg-slate-900 w-64 text-white">
                        <AdminSidebar className="w-full border-none shadow-none" />
                    </SheetContent>
                </Sheet>
                <div className="ml-4 font-bold text-lg">Liora Admin</div>
            </div>

            {/* Desktop Sidebar */}
            <AdminSidebar className="hidden md:flex" />

            <main className="flex-1 overflow-y-auto bg-slate-50/50 p-4 md:p-8">
                {children}
            </main>
        </div>
    )
}
