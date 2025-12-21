"use client"

import { useLanguage } from "@/lib/language-context"
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"

export default function FAQPage() {
    const { t } = useLanguage()

    return (
        <div className="container mx-auto px-4 py-8 md:py-16 max-w-4xl">
            <h1 className="text-3xl md:text-4xl font-serif font-bold mb-8 text-center">{t.faq.title}</h1>

            <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1">
                    <AccordionTrigger>{t.faq.q1}</AccordionTrigger>
                    <AccordionContent>
                        {t.faq.a1}
                    </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-2">
                    <AccordionTrigger>{t.faq.q2}</AccordionTrigger>
                    <AccordionContent>
                        {t.faq.a2}
                    </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-3">
                    <AccordionTrigger>{t.faq.q3}</AccordionTrigger>
                    <AccordionContent>
                        {t.faq.a3}
                    </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-4">
                    <AccordionTrigger>{t.faq.q4}</AccordionTrigger>
                    <AccordionContent>
                        {t.faq.a4}
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
        </div>
    )
}
