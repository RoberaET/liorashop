"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { db } from "@/lib/db"
import { Shield, Save, UserPlus, Store } from "lucide-react"

export default function AdminSettingsPage() {
    const { toast } = useToast()
    const [isLoading, setIsLoading] = useState(true)

    // Store Settings State
    const [storeSettings, setStoreSettings] = useState({
        storeName: "",
        supportEmail: "",
        currency: "ETB"
    })

    // New Admin State
    const [newAdmin, setNewAdmin] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: ""
    })

    useEffect(() => {
        const settings = db.getStoreSettings()
        setStoreSettings(settings)
        setIsLoading(false)
    }, [])

    const handleSaveSettings = (e: React.FormEvent) => {
        e.preventDefault()
        try {
            db.updateStoreSettings(storeSettings)
            toast({
                title: "Settings Saved",
                description: "Store settings have been updated successfully."
            })
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to save settings.",
                variant: "destructive"
            })
        }
    }

    const handleCreateAdmin = (e: React.FormEvent) => {
        e.preventDefault()

        if (newAdmin.password !== newAdmin.confirmPassword) {
            toast({
                title: "Passwords do not match",
                description: "Please ensure both passwords match.",
                variant: "destructive"
            })
            return
        }

        if (newAdmin.password.length < 6) {
            toast({
                title: "Password too short",
                description: "Password must be at least 6 characters.",
                variant: "destructive"
            })
            return
        }

        try {
            db.createAdmin({
                name: newAdmin.name,
                email: newAdmin.email,
                password: newAdmin.password
            })

            setNewAdmin({
                name: "",
                email: "",
                password: "",
                confirmPassword: ""
            })

            toast({
                title: "Admin Created",
                description: `${newAdmin.name} has been added as an administrator.`
            })
        } catch (error: any) {
            toast({
                title: "Error",
                description: error.message || "Failed to create admin.",
                variant: "destructive"
            })
        }
    }

    if (isLoading) return <div className="p-8 text-center text-slate-500">Loading settings...</div>

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-3xl font-bold tracking-tight text-slate-900">Settings</h2>
                <p className="text-slate-600">Manage store configuration and admin access.</p>
            </div>

            <div className="grid gap-6">
                {/* General Settings */}
                <Card className="border-slate-200 shadow-sm">
                    <CardHeader>
                        <div className="flex items-center gap-2">
                            <Store className="h-5 w-5 text-emerald-600" />
                            <CardTitle>General Settings</CardTitle>
                        </div>
                        <CardDescription>
                            Basic information for your store.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSaveSettings} className="space-y-4">
                            <div className="grid gap-2">
                                <Label htmlFor="storeName">Store Name</Label>
                                <Input
                                    id="storeName"
                                    value={storeSettings.storeName}
                                    onChange={(e) => setStoreSettings({ ...storeSettings, storeName: e.target.value })}
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="supportEmail">Support Email</Label>
                                <Input
                                    id="supportEmail"
                                    type="email"
                                    value={storeSettings.supportEmail}
                                    onChange={(e) => setStoreSettings({ ...storeSettings, supportEmail: e.target.value })}
                                />
                            </div>
                            <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700">
                                <Save className="mr-2 h-4 w-4" /> Save Settings
                            </Button>
                        </form>
                    </CardContent>
                </Card>

                {/* Admin Management */}
                <Card className="border-slate-200 shadow-sm">
                    <CardHeader>
                        <div className="flex items-center gap-2">
                            <Shield className="h-5 w-5 text-purple-600" />
                            <CardTitle>Admin Management</CardTitle>
                        </div>
                        <CardDescription>
                            Add another administrator to manage the store.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleCreateAdmin} className="space-y-4">
                            <div className="grid gap-2">
                                <Label htmlFor="adminName">Full Name</Label>
                                <Input
                                    id="adminName"
                                    value={newAdmin.name}
                                    onChange={(e) => setNewAdmin({ ...newAdmin, name: e.target.value })}
                                    placeholder="Jane Doe"
                                    required
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="adminEmail">Email Address</Label>
                                <Input
                                    id="adminEmail"
                                    type="email"
                                    value={newAdmin.email}
                                    onChange={(e) => setNewAdmin({ ...newAdmin, email: e.target.value })}
                                    placeholder="admin@example.com"
                                    required
                                />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="adminPass">Password</Label>
                                    <Input
                                        id="adminPass"
                                        type="password"
                                        value={newAdmin.password}
                                        onChange={(e) => setNewAdmin({ ...newAdmin, password: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="adminConfirm">Confirm Password</Label>
                                    <Input
                                        id="adminConfirm"
                                        type="password"
                                        value={newAdmin.confirmPassword}
                                        onChange={(e) => setNewAdmin({ ...newAdmin, confirmPassword: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>
                            <Button type="submit" className="bg-purple-600 hover:bg-purple-700 text-white">
                                <UserPlus className="mr-2 h-4 w-4" /> Create Admin
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
