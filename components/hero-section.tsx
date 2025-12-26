"use client"

import BlurText from "@/components/blur-text"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import { useLanguage } from "@/lib/language-context"

export function HeroSection() {
  const { t } = useLanguage()

  return (
    <section className="py-6 md:py-10">
      <div className="container mx-auto px-4">
        <div className="relative overflow-hidden rounded-[2.5rem] bg-[#F3F1EB] min-h-[600px] grid md:grid-cols-2 items-center">

          {/* Left Content */}
          <div className="relative z-10 px-8 py-12 md:pl-20 md:pr-4 order-2 md:order-1 flex flex-col items-start text-left">
            <p className="text-sm font-medium text-black/60 uppercase tracking-widest mb-6">
              {t.hero.newSeason}
            </p>
            <div className="mb-6 md:mb-8">
              <BlurText
                text={t.hero.title}
                delay={150}
                animateBy="words"
                direction="top"
                className="text-5xl md:text-7xl lg:text-8xl font-serif font-medium tracking-tight text-black leading-[0.9] text-balance"
              />
            </div>
            <p className="text-base md:text-lg text-black/70 mb-8 md:mb-10 max-w-md leading-relaxed font-light">
              {t.hero.description}
            </p>
            <div className="flex flex-wrap gap-4">
              <Button size="lg" asChild className="rounded-full px-8 py-6 text-sm tracking-wide bg-black text-white hover:bg-black/80 transition-all duration-300">
                <Link href="/category/clothes">
                  {t.hero.shopNow}
                </Link>
              </Button>
            </div>
          </div>

          {/* Right Image/Cluster */}
          <div className="relative h-full min-h-[400px] md:min-h-full w-full order-1 md:order-2 bg-[#EAE8E2]">
            {/* Main Hero Image */}
            <div
              className="absolute inset-0 bg-contain bg-no-repeat bg-center md:bg-right"
              style={{ backgroundImage: 'url("/mainbg/mainbg.jpg")' }}
            />
            {/* Overlay Gradient for text readability on mobile if needed, though we split on desktop */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#F3F1EB] to-transparent md:hidden" />
          </div>
        </div>
      </div>
    </section>
  )
}
