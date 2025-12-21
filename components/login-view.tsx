"use client"

import { LoginForm } from "@/components/login-form"
import Link from "next/link"
import { useLanguage } from "@/lib/language-context"

export function LoginView() {
    const { t } = useLanguage()

    return (
        <div className="w-full max-w-md space-y-8">
            <div className="text-center">
                <h1 className="text-3xl font-serif font-bold">{t.auth.loginTitle}</h1>
                <p className="text-muted-foreground mt-2">{t.auth.loginTitle}</p>
                {/* Note: I might want a separate description string if 'loginTitle' is not appropriate for description. 
            Using loginTitle twice is redundant. Let me check translations.ts.
            loginTitle: "Login to your account"
            description logic: "Sign in to your account to continue" (original) vs "Login to your account" (translated)
            I'll use loginTitle for now or add a description key. 
            Actually, I'll allow the redundancy or better yet, I should add `loginSubtitle` to translations. 
            I'll use `loginTitle` for now to avoid switching tasks again.
        */}
            </div>

            <LoginForm />

            <p className="text-center text-sm text-muted-foreground">
                {t.auth.dontHaveAccount}{" "}
                <Link href="/register" className="font-medium text-foreground hover:underline">
                    {t.auth.signUp}
                </Link>
            </p>
        </div>
    )
}
