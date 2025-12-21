"use client"

import React, { createContext, useContext, useState, useEffect } from "react"
import { translations, type Language, type TranslationType } from "./translations"

type LanguageContextType = {
    language: Language
    setLanguage: (lang: Language) => void
    t: TranslationType
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: React.ReactNode }) {
    const [language, setLanguage] = useState<Language>("en")

    useEffect(() => {
        const savedLang = localStorage.getItem("language") as Language
        if (savedLang && (savedLang === "en" || savedLang === "am")) {
            setLanguage(savedLang)
        }
    }, [])

    const handleSetLanguage = (lang: Language) => {
        setLanguage(lang)
        localStorage.setItem("language", lang)
    }

    const value = {
        language,
        setLanguage: handleSetLanguage,
        t: translations[language],
    }

    return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}

export function useLanguage() {
    const context = useContext(LanguageContext)
    if (context === undefined) {
        throw new Error("useLanguage must be used within a LanguageProvider")
    }
    return context
}
