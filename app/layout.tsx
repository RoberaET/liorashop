import type React from "react"
import type { Metadata, Viewport } from "next"
import { Geist, Geist_Mono, Playfair_Display } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import { LanguageProvider } from "@/lib/language-context"
import { FlyAnimationProvider } from "@/components/fly-animation-provider"
import { Toaster } from "@/components/ui/toaster"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })
const _playfair = Playfair_Display({ subsets: ["latin"], weight: ["400", "500", "600", "700"] })

export const metadata: Metadata = {
  title: "LIORA SHOP | Premium Fashion & Lifestyle",
  description:
    "Discover curated fashion, beauty, and lifestyle products. Shop clothes, shoes, cosmetics, and perfumes with premium quality and timeless design.",
  keywords: ["fashion", "clothing", "shoes", "cosmetics", "perfumes", "online shopping", "luxury"],
  generator: 'v0.app'
}

export const viewport: Viewport = {
  themeColor: "#1a1a1a",
  width: "device-width",
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`font-sans antialiased`}>
        <LanguageProvider>
          <FlyAnimationProvider>
            {children}
            <Analytics />
            <Toaster />
          </FlyAnimationProvider>
        </LanguageProvider>
      </body>
    </html>
  )
}
