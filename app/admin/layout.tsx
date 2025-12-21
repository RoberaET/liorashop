"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { AdminSidebar } from "@/components/admin-sidebar"
import { useAuth } from "@/lib/auth-context"

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
        <div className="flex min-h-screen">
            <AdminSidebar />
            <main className="flex-1 overflow-y-auto bg-muted/5 p-8">
                {children}
            </main>
        </div>
    )
}
