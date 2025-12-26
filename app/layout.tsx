import type React from "react"
import type { Metadata, Viewport } from "next"
import { Inter, Playfair_Display } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { SpeedInsights } from "@vercel/speed-insights/next"
import "./globals.css"
import { LanguageProvider } from "@/lib/language-context"
import { AuthProvider } from "@/lib/auth-context"
import { FlyAnimationProvider } from "@/components/fly-animation-provider"
import { Toaster } from "@/components/ui/toaster"
import { ThemeProvider } from "@/components/theme-provider"

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" })
const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-serif"
})

export const metadata: Metadata = {
  metadataBase: new URL("https://liorashop.com"), // Replace with actual domain when live
  title: {
    default: "LIORA SHOP | Premium Fashion & Lifestyle",
    template: "%s | LIORA SHOP"
  },
  description:
    "Discover curated fashion, beauty, and lifestyle products. Shop clothes, shoes, cosmetics, and perfumes with premium quality and timeless design.",
  keywords: ["fashion", "clothing", "shoes", "cosmetics", "perfumes", "online shopping", "luxury", "ethiopia", "addis ababa"],
  authors: [{ name: "Liora Shop" }],
  creator: "Liora Shop",
  publisher: "Liora Shop",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://liorashop.com",
    title: "LIORA SHOP | Premium Fashion & Lifestyle",
    description: "Discover curated fashion, beauty, and lifestyle products.",
    siteName: "LIORA SHOP",
  },
  twitter: {
    card: "summary_large_image",
    title: "LIORA SHOP | Premium Fashion & Lifestyle",
    description: "Discover curated fashion, beauty, and lifestyle products.",
    creator: "@liorashop",
  },
  icons: {
    icon: "/weblogo.png",
    shortcut: "/weblogo.png",
    apple: "/weblogo.png",
  },
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
      <body className={`${inter.variable} ${playfair.variable} font-sans antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <LanguageProvider>
            <AuthProvider>
              <FlyAnimationProvider>
                {children}
                <Analytics />
                <SpeedInsights />
                <Toaster />
              </FlyAnimationProvider>
            </AuthProvider>
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
