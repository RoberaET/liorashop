"use client"

import { useLanguage } from "@/lib/language-context"

export default function PrivacyPolicyPage() {
    const { t } = useLanguage()

    return (
        <div className="container mx-auto px-4 py-8 md:py-16 max-w-3xl">
            <h1 className="text-3xl md:text-4xl font-serif font-bold mb-2">{t.privacy.title}</h1>
            <p className="text-muted-foreground mb-8">{t.privacy.lastUpdated}</p>

            <div className="prose prose-stone dark:prose-invert max-w-none space-y-8">
                <section>
                    <p>{t.privacy.intro}</p>
                </section>

                <section>
                    <h2 className="text-xl font-bold mb-3">{t.privacy.collectionTitle}</h2>
                    <p>{t.privacy.collectionText}</p>
                </section>

                <section>
                    <h2 className="text-xl font-bold mb-3">{t.privacy.usageTitle}</h2>
                    <p>{t.privacy.usageText}</p>
                </section>

                <section>
                    <h2 className="text-xl font-bold mb-3">{t.privacy.sharingTitle}</h2>
                    <p>{t.privacy.sharingText}</p>
                </section>
            </div>
        </div>
    )
}
