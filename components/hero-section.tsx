"use client"

import BlurText from "@/components/blur-text"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import { useLanguage } from "@/lib/language-context"

export function HeroSection() {
  const { t } = useLanguage()

  return (
    <section className="relative overflow-hidden min-h-[600px] flex items-center">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center z-0"
        style={{ backgroundImage: 'url("/mainbg/mainbg.jpg")' }}
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/40 z-0" />

      {/* Content */}
      <div className="container relative z-10 mx-auto px-4 py-12 md:py-32 text-white">
        <div className="max-w-3xl">
          <p className="text-sm font-medium text-white/90 uppercase tracking-wider mb-4">
            {t.hero.newSeason}
          </p>
          <div className="mb-4 md:mb-6">
            <BlurText
              text={t.hero.title}
              delay={150}
              animateBy="words"
              direction="top"
              className="text-4xl md:text-6xl lg:text-7xl font-serif font-bold tracking-tight text-white text-balance"
            />
          </div>
          <p className="text-base md:text-xl text-white/90 mb-6 md:mb-8 max-w-xl leading-relaxed">
            {t.hero.description}
          </p>
          <div className="flex flex-wrap gap-4">
            <Button size="lg" asChild className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90">
              <Link href="/category/clothes">
                {t.hero.shopNow}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" asChild className="bg-secondary text-secondary-foreground hover:bg-secondary/80 border-none">
              <Link href="#categories">{t.hero.browseCategories}</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
