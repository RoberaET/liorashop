"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowLeft, User, Mail, Bell, Shield, Wallet } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { useStore } from "@/lib/store"
import { useMounted } from "@/hooks/use-mounted"
import { useToast } from "@/hooks/use-toast"

export function SettingsContent() {
    const router = useRouter()
    const user = useStore((state) => state.user)
    const setUser = useStore((state) => state.setUser)
    const mounted = useMounted()
    const { toast } = useToast()

    const [formData, setFormData] = useState({
        name: "",
        email: "",
    })

    const [notifications, setNotifications] = useState({
        emailParams: true,
        orderUpdates: true,
        promotions: false
    })

    useEffect(() => {
        if (mounted) {
            if (!user) {
                router.push("/login")
            } else {
                setFormData({
                    name: user.name,
                    email: user.email
                })
            }
        }
    }, [mounted, user, router])

    if (!mounted || !user) {
        return null
    }

    const handleUpdateProfile = (e: React.FormEvent) => {
        e.preventDefault()
        if (user) {
            setUser({
                ...user,
                name: formData.name,
                email: formData.email
            })
            toast({
                title: "Profile Updated",
                description: "Your profile information has been saved successfully.",
            })
        }
    }

    return (
        <div className="container mx-auto px-4 py-8 md:py-12">
            <div className="max-w-4xl mx-auto space-y-8">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" asChild>
                        <Link href="/account">
                            <ArrowLeft className="h-4 w-4" />
                        </Link>
                    </Button>
                    <h1 className="text-2xl font-serif font-bold">Account Settings</h1>
                </div>

                <div className="grid gap-8">
                    {/* Profile Settings */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <User className="h-5 w-5" />
                                Profile Information
                            </CardTitle>
                            <CardDescription>Update your personal details.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleUpdateProfile} className="space-y-4">
                                <div className="grid gap-4 sm:grid-cols-2">
                                    <div className="space-y-2">
                                        <Label htmlFor="name">Full Name</Label>
                                        <Input
                                            id="name"
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="email">Email Address</Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        />
                                    </div>
                                </div>
                                <Button type="submit">Save Changes</Button>
                            </form>
                        </CardContent>
                    </Card>

                    {/* Notifications */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Bell className="h-5 w-5" />
                                Notifications
                            </CardTitle>
                            <CardDescription>Manage your email notification preferences.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label className="text-base">Order Updates</Label>
                                    <p className="text-sm text-muted-foreground">Receive emails about your order status.</p>
                                </div>
                                <Switch
                                    checked={notifications.orderUpdates}
                                    onCheckedChange={(c) => setNotifications({ ...notifications, orderUpdates: c })}
                                />
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label className="text-base">Promotions & Offers</Label>
                                    <p className="text-sm text-muted-foreground">Receive emails about new products and sales.</p>
                                </div>
                                <Switch
                                    checked={notifications.promotions}
                                    onCheckedChange={(c) => setNotifications({ ...notifications, promotions: c })}
                                />
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
