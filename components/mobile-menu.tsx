"use client"

import Link from "next/link"
import { Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { useLanguage } from "@/lib/language-context"
import { useStore } from "@/lib/store"
import { useAuth } from "@/lib/auth-context"
import { useMounted } from "@/hooks/use-mounted"

export function MobileMenu() {
    const { t } = useLanguage()
    const cart = useStore((state) => state.cart)
    const wishlist = useStore((state) => state.wishlist)
    const { user } = useAuth()
    const mounted = useMounted()

    const cartCount = mounted ? cart.reduce((count, item) => count + item.quantity, 0) : 0
    const wishlistCount = mounted ? wishlist.length : 0
    const currentUser = mounted ? user : null

    const navLinks = [
        { href: "/category/clothes", label: t.navbar.clothes },
        { href: "/category/shoes", label: t.navbar.shoes },
        { href: "/category/cosmetics", label: t.navbar.cosmetics },
        { href: "/category/perfumes", label: t.navbar.perfumes },
    ]

    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                    <Menu className="h-5 w-5" />
                    <span className="sr-only">{t.navbar.menu}</span>
                </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px]">
                <nav className="flex flex-col gap-4 mt-8">
                    {navLinks.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className="text-lg font-medium hover:text-primary transition-colors"
                        >
                            {link.label}
                        </Link>
                    ))}
                    <hr className="my-4" />
                    <Link href="/wishlist" className="text-lg font-medium hover:text-primary transition-colors">
                        {t.navbar.wishlist} ({wishlistCount})
                    </Link>
                    <Link href="/cart" className="text-lg font-medium hover:text-primary transition-colors">
                        {t.navbar.cart} ({cartCount})
                    </Link>
                    <Link
                        href={currentUser ? "/account" : "/login"}
                        className="text-lg font-medium hover:text-primary transition-colors"
                    >
                        {currentUser ? t.navbar.myAccount : t.navbar.signIn}
                    </Link>
                </nav>
            </SheetContent>
        </Sheet>
    )
}
