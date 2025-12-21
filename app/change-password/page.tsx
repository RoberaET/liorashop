"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { changePasswordAction } from "@/app/actions/auth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"

export default function ChangePasswordPage() {
    const [newPassword, setNewPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const router = useRouter()
    const { user } = useAuth()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (newPassword !== confirmPassword) {
            toast.error("Passwords do not match")
            return
        }

        if (newPassword.length < 6) {
            toast.error("Password must be at least 6 characters")
            return
        }

        if (!user) {
            toast.error("You must be logged in to change your password")
            router.push("/login")
            return
        }

        setIsLoading(true)

        const result = await changePasswordAction(user.id, newPassword)

        if (result.success) {
            // Update local storage to prevent redirect loop
            const updatedUser = { ...user, mustChangePassword: false }
            localStorage.setItem("liora_user", JSON.stringify(updatedUser))

            toast.success("Password changed successfully")
            // Optionally force refresh or update auth context if needed
            // But redirection to home is usually enough as simple navigation
            window.location.href = "/"
        } else {
            toast.error("Failed to change password")
        }

        setIsLoading(false)
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
            <Card className="w-full max-w-md shadow-lg">
                <CardHeader>
                    <CardTitle className="text-2xl font-bold text-center">Change Password</CardTitle>
                    <CardDescription className="text-center">
                        Please enter a new password for your account.
                        <br />
                        <span className="text-amber-600 font-medium text-xs">
                            Secure your account with a strong password.
                        </span>
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="new-password">New Password</Label>
                            <Input
                                id="new-password"
                                type="password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                required
                                minLength={6}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="confirm-password">Confirm Password</Label>
                            <Input
                                id="confirm-password"
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                                minLength={6}
                            />
                        </div>
                        <Button type="submit" className="w-full" disabled={isLoading}>
                            {isLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Updating...
                                </>
                            ) : (
                                "Update Password"
                            )}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}
