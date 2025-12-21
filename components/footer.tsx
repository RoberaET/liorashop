"use client"

import Link from "next/link"
import { useLanguage } from "@/lib/language-context"

export function Footer() {
  const { t } = useLanguage()

  return (
    <footer className="border-t border-border bg-muted/30">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <span className="text-2xl font-serif font-bold tracking-tight">LIORA SHOP</span>
            <p className="text-sm text-muted-foreground">
              {t.footer.description}
            </p>
          </div>

          {/* Shop */}
          <div className="space-y-4">
            <h3 className="font-semibold">{t.footer.shop}</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/category/clothes" className="hover:text-foreground transition-colors">
                  {t.navbar.clothes}
                </Link>
              </li>
              <li>
                <Link href="/category/shoes" className="hover:text-foreground transition-colors">
                  {t.navbar.shoes}
                </Link>
              </li>
              <li>
                <Link href="/category/cosmetics" className="hover:text-foreground transition-colors">
                  {t.navbar.cosmetics}
                </Link>
              </li>
              <li>
                <Link href="/category/perfumes" className="hover:text-foreground transition-colors">
                  {t.navbar.perfumes}
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div className="space-y-4">
            <h3 className="font-semibold">{t.footer.support}</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="#" className="hover:text-foreground transition-colors">
                  {t.footer.contactUs}
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-foreground transition-colors">
                  {t.footer.faqs}
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-foreground transition-colors">
                  {t.footer.shippingInfo}
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-foreground transition-colors">
                  {t.footer.returns}
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal & Contact */}
          <div className="space-y-8">
            <div>
              <h3 className="font-serif text-lg font-bold mb-4">{t.footer.legal}</h3>
              <ul className="space-y-2 text-sm text-neutral-400">
                <li><Link href="/privacy-policy" className="hover:text-white transition-colors">{t.footer.privacyPolicy}</Link></li>
                <li><Link href="/terms-of-service" className="hover:text-white transition-colors">{t.footer.termsOfService}</Link></li>
                <li><Link href="/cookie-policy" className="hover:text-white transition-colors">{t.footer.cookiePolicy}</Link></li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h3 className="font-serif text-lg font-bold mb-4">{t.footer.contactUs}</h3>
              <ul className="space-y-2 text-sm text-neutral-400">
                <li><Link href="/faq" className="hover:text-white transition-colors">{t.footer.faqs}</Link></li>
                <li><Link href="/contact" className="hover:text-white transition-colors">info@liorashop.com</Link></li>
                <li><a href="tel:+251911234567" className="hover:text-white transition-colors">+251 911 234 567</a></li>
                <li>Addis Ababa, Ethiopia</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-neutral-500">
          <p>&copy; {new Date().getFullYear()} LIORA SHOP. {t.footer.rightsReserved}</p>
        </div>
      </div>
    </footer>
  )
}
