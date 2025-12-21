"use client"

import { useState } from "react"
import Link from "next/link"
import { Menu, Shirt, Footprints, Palette, Wind, Heart, ShoppingBag, User, LogIn, LogOut, LayoutDashboard } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetDescription } from "@/components/ui/sheet"
import { useLanguage } from "@/lib/language-context"
import { useStore } from "@/lib/store"
import { useAuth } from "@/lib/auth-context"
import { useMounted } from "@/hooks/use-mounted"
import { VisuallyHidden } from "@radix-ui/react-visually-hidden"

export function MobileMenu() {
    const { t } = useLanguage()
    const cart = useStore((state) => state.cart)
    const wishlist = useStore((state) => state.wishlist)
    const { user, logout } = useAuth()
    const mounted = useMounted()
    const [open, setOpen] = useState(false)

    const cartCount = mounted ? cart.reduce((count, item) => count + item.quantity, 0) : 0
    const wishlistCount = mounted ? wishlist.length : 0
    const currentUser = mounted ? user : null

    const navLinks = [
        { href: "/category/clothes", label: t.navbar.clothes, icon: Shirt },
        { href: "/category/shoes", label: t.navbar.shoes, icon: Footprints },
        { href: "/category/cosmetics", label: t.navbar.cosmetics, icon: Palette },
        { href: "/category/perfumes", label: t.navbar.perfumes, icon: Wind },
    ]

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                    <Menu className="h-5 w-5" />
                    <span className="sr-only">{t.navbar.menu}</span>
                </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[350px]">
                <VisuallyHidden>
                    <SheetTitle>Mobile Menu</SheetTitle>
                    <SheetDescription>Navigation menu for mobile devices</SheetDescription>
                </VisuallyHidden>
                <nav className="flex flex-col gap-6 mt-10 px-2">
                    {navLinks.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className="flex items-center gap-6 text-lg font-medium hover:text-primary transition-colors group"
                            onClick={() => setOpen(false)}
                        >
                            <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                                <link.icon className="h-5 w-5 text-slate-600 dark:text-slate-400 group-hover:text-primary" />
                            </div>
                            {link.label}
                        </Link>
                    ))}

                    <div className="h-px bg-slate-200 dark:bg-slate-800 my-2" />

                    <Link
                        href="/wishlist"
                        className="flex items-center gap-6 text-lg font-medium hover:text-primary transition-colors group"
                        onClick={() => setOpen(false)}
                    >
                        <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center group-hover:bg-primary/10 transition-colors relative">
                            <Heart className="h-5 w-5 text-slate-600 dark:text-slate-400 group-hover:text-primary" />
                            {wishlistCount > 0 && (
                                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-600 text-[10px] text-white">
                                    {wishlistCount}
                                </span>
                            )}
                        </div>
                        {t.navbar.wishlist}
                    </Link>

                    <Link
                        href="/cart"
                        className="flex items-center gap-6 text-lg font-medium hover:text-primary transition-colors group"
                        onClick={() => setOpen(false)}
                    >
                        <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center group-hover:bg-primary/10 transition-colors relative">
                            <ShoppingBag className="h-5 w-5 text-slate-600 dark:text-slate-400 group-hover:text-primary" />
                            {cartCount > 0 && (
                                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-600 text-[10px] text-white">
                                    {cartCount}
                                </span>
                            )}
                        </div>
                        {t.navbar.cart}
                    </Link>

                    <div className="h-px bg-slate-200 dark:bg-slate-800 my-2" />

                    {currentUser ? (
                        <>
                            <Link
                                href="/account"
                                className="flex items-center gap-6 text-lg font-medium hover:text-primary transition-colors group"
                                onClick={() => setOpen(false)}
                            >
                                <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                                    <User className="h-5 w-5 text-slate-600 dark:text-slate-400 group-hover:text-primary" />
                                </div>
                                {t.navbar.myAccount}
                            </Link>
                            {currentUser.role === 'admin' && (
                                <Link
                                    href="/admin/dashboard"
                                    className="flex items-center gap-6 text-lg font-medium hover:text-primary transition-colors group"
                                    onClick={() => setOpen(false)}
                                >
                                    <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                                        <LayoutDashboard className="h-5 w-5 text-slate-600 dark:text-slate-400 group-hover:text-primary" />
                                    </div>
                                    {t.navbar.adminDashboard}
                                </Link>
                            )}
                            <button
                                className="flex items-center gap-6 text-lg font-medium hover:text-red-600 transition-colors group text-left w-full"
                                onClick={() => {
                                    logout()
                                    setOpen(false)
                                }}
                            >
                                <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center group-hover:bg-red-50 dark:group-hover:bg-red-900/10 transition-colors">
                                    <LogOut className="h-5 w-5 text-slate-600 dark:text-slate-400 group-hover:text-red-600" />
                                </div>
                                {t.navbar.logout}
                            </button>
                        </>
                    ) : (
                        <Link
                            href="/login"
                            className="flex items-center gap-6 text-lg font-medium hover:text-primary transition-colors group"
                            onClick={() => setOpen(false)}
                        >
                            <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                                <LogIn className="h-5 w-5 text-slate-600 dark:text-slate-400 group-hover:text-primary" />
                            </div>
                            {t.navbar.signIn}
                        </Link>
                    )}
                </nav>
            </SheetContent>
        </Sheet>
    )
}
