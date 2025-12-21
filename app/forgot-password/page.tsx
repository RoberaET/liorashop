"use client"

import Link from "next/link"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Send } from "lucide-react"

export default function ForgotPasswordPage() {
    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-1 flex items-center justify-center py-12 px-4">
                <Card className="w-full max-w-md shadow-lg border-slate-200">
                    <CardHeader className="space-y-1">
                        <CardTitle className="text-2xl font-bold text-center text-slate-900">Forgot password?</CardTitle>
                        <CardDescription className="text-center text-slate-500">
                            Contact our support team to recover your account
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-col gap-6">
                        <div className="text-center text-sm text-slate-600">
                            <p>If you have forgotten your password or username, please contact our customer service team on Telegram.</p>
                            <p className="mt-2 text-muted-foreground">They will assist you in verifying your identity and resetting your password.</p>
                        </div>

                        <Button asChild className="w-full bg-[#0088cc] hover:bg-[#0077b5] gap-2 h-12 text-lg">
                            <Link href="https://t.me/Rebika_abebe" target="_blank" rel="noopener noreferrer">
                                <Send className="h-5 w-5" />
                                Contact Support on Telegram
                            </Link>
                        </Button>

                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <span className="w-full border-t" />
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                                <span className="bg-white px-2 text-muted-foreground">
                                    Or
                                </span>
                            </div>
                        </div>

                        <div className="text-center">
                            <Link
                                href="/login"
                                className="inline-flex items-center text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
                            >
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Back to Login
                            </Link>
                        </div>
                    </CardContent>
                </Card>
            </main>
            <Footer />
        </div>
    )
}
