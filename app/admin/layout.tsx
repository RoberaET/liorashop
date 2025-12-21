"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useStore } from "@/lib/store"
import { AdminSidebar } from "@/components/admin-sidebar"
import { useMounted } from "@/hooks/use-mounted"

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const router = useRouter()
    const user = useStore((state) => state.user)
    const mounted = useMounted()
    const [isAuthorized, setIsAuthorized] = useState(false)

    useEffect(() => {
        if (mounted) {
            if (!user || user.role !== "admin") {
                router.push("/")
            } else {
                setIsAuthorized(true)
            }
        }
    }, [mounted, user, router])

    if (!mounted || !isAuthorized) {
        return null
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
