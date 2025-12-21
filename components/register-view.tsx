"use client"

import { RegisterForm } from "@/components/register-form"
import Link from "next/link"
import { useLanguage } from "@/lib/language-context"

export function RegisterView() {
    const { t } = useLanguage()

    return (
        <div className="w-full max-w-md space-y-8">
            <div className="text-center">
                <h1 className="text-3xl font-serif font-bold">{t.auth.registerTitle}</h1>
                <p className="text-muted-foreground mt-2">{t.auth.registerTitle}</p>
            </div>

            <RegisterForm />

            <p className="text-center text-sm text-muted-foreground">
                {t.auth.alreadyHaveAccount}{" "}
                <Link href="/login" className="font-medium text-foreground hover:underline">
                    {t.auth.signIn}
                </Link>
            </p>
        </div>
    )
}
