"use client"

import { useLanguage } from "@/lib/language-context"

export default function CookiePolicyPage() {
    const { t } = useLanguage()

    return (
        <div className="container mx-auto px-4 py-8 md:py-16 max-w-3xl">
            <h1 className="text-3xl md:text-4xl font-serif font-bold mb-8">{t.cookie.title}</h1>

            <div className="prose prose-stone dark:prose-invert max-w-none space-y-8">
                <section>
                    <p>{t.cookie.intro}</p>
                </section>

                <section>
                    <h2 className="text-xl font-bold mb-3">{t.cookie.whatAreCookiesTitle}</h2>
                    <p>{t.cookie.whatAreCookiesText}</p>
                </section>

                <section>
                    <h2 className="text-xl font-bold mb-3">{t.cookie.usageTitle}</h2>
                    <p>{t.cookie.usageText}</p>
                </section>

                <section>
                    <h2 className="text-xl font-bold mb-3">{t.cookie.manageTitle}</h2>
                    <p>{t.cookie.manageText}</p>
                </section>
            </div>
        </div>
    )
}
