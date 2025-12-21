"use client"

import { useLanguage } from "@/lib/language-context"

export default function TermsOfServicePage() {
    const { t } = useLanguage()

    return (
        <div className="container mx-auto px-4 py-8 md:py-16 max-w-3xl">
            <h1 className="text-3xl md:text-4xl font-serif font-bold mb-8">{t.terms.title}</h1>

            <div className="prose prose-stone dark:prose-invert max-w-none space-y-8">
                <section>
                    <p>{t.terms.intro}</p>
                </section>

                <section>
                    <h2 className="text-xl font-bold mb-3">{t.terms.accountsTitle}</h2>
                    <p>{t.terms.accountsText}</p>
                </section>

                <section>
                    <h2 className="text-xl font-bold mb-3">{t.terms.purchaseTitle}</h2>
                    <p>{t.terms.purchaseText}</p>
                </section>

                <section>
                    <h2 className="text-xl font-bold mb-3">{t.terms.prohibitedTitle}</h2>
                    <p>{t.terms.prohibitedText}</p>
                </section>
            </div>
        </div>
    )
}
