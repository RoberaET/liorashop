"use client"

import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Bell, Globe, Mail } from "lucide-react"
import Link from "next/link"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

export default function SettingsPage() {
    const { user, updateSettings, isLoading } = useAuth()
    const router = useRouter()

    if (isLoading) return <div>Loading...</div>
    if (!user) {
        router.push("/login")
        return null
    }

    const { settings } = user

    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl">
            <Button variant="ghost" asChild className="mb-6 pl-0 hover:bg-transparent">
                <Link href="/account" className="flex items-center gap-2 text-muted-foreground hover:text-foreground">
                    <ArrowLeft className="h-4 w-4" />
                    Back to Account
                </Link>
            </Button>

            <div className="mb-8">
                <h1 className="text-3xl font-serif font-bold">Settings</h1>
                <p className="text-muted-foreground">Manage your account preferences</p>
            </div>

            <div className="space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Bell className="h-5 w-5" />
                            Notifications
                        </CardTitle>
                        <CardDescription>Manage how we communicate with you</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <Label htmlFor="notifications">Push Notifications</Label>
                                <p className="text-sm text-muted-foreground">Receive updates about your order status</p>
                            </div>
                            <Switch
                                id="notifications"
                                checked={settings?.notifications ?? true}
                                onCheckedChange={(checked) => updateSettings({ notifications: checked })}
                            />
                        </div>
                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <Label htmlFor="emails">Marketing Emails</Label>
                                <p className="text-sm text-muted-foreground">Receive emails about new products and sales</p>
                            </div>
                            <Switch
                                id="emails"
                                checked={settings?.marketingEmails ?? false}
                                onCheckedChange={(checked) => updateSettings({ marketingEmails: checked })}
                            />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Globe className="h-5 w-5" />
                            Localization
                        </CardTitle>
                        <CardDescription>Set your region and currency preferences</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label>Currency</Label>
                            <Select
                                value={settings?.currency ?? "ETB"}
                                onValueChange={(val) => updateSettings({ currency: val })}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select currency" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="ETB">Ethiopian Birr (ETB)</SelectItem>
                                    <SelectItem value="USD">US Dollar (USD)</SelectItem>
                                    <SelectItem value="EUR">Euro (EUR)</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
