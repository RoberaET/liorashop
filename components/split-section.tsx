"use client"

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"

export function SplitSection() {
    return (
        <section className="py-20 md:py-32">
            <div className="container mx-auto px-4">
                <div className="grid md:grid-cols-2 gap-12 md:gap-24 items-center">
                    {/* Left Text */}
                    <div className="order-2 md:order-1">
                        <p className="text-sm font-medium text-black/60 uppercase tracking-widest mb-4">
                            New Alternatives
                        </p>
                        <h2 className="text-4xl md:text-5xl font-serif mb-6 leading-tight">Our Skin Care Products</h2>
                        <p className="text-muted-foreground mb-8 text-lg font-light leading-relaxed max-w-md">
                            We gathered a unique collection of skin care products to suite your skin type.
                        </p>
                        <Button asChild className="rounded-full px-8 py-6 bg-black text-white hover:bg-black/80 transition-all shadow-md">
                            <Link href="/category/cosmetics">Shop Now</Link>
                        </Button>
                    </div>
                    {/* Right Image */}
                    <div className="relative aspect-[4/3] bg-[#F3F1EB] rounded-[2rem] overflow-hidden order-1 md:order-2 shadow-sm">
                        <Image
                            src="/category-cosmetics.png"
                            alt="Skin Care Collection"
                            fill
                            className="object-cover hover:scale-105 transition-transform duration-700"
                        />
                    </div>
                </div>

                {/* Pagination Dots decoration (visual only as per design) */}
                <div className="flex gap-2 mt-12 md:mt-0 md:absolute md:left-1/2 md:-translate-x-1/2 justify-center">
                    <div className="h-2 w-2 rounded-full bg-black/80"></div>
                    <div className="h-2 w-2 rounded-full bg-black/20"></div>
                    <div className="h-2 w-2 rounded-full bg-black/20"></div>
                </div>
            </div>
        </section>
    )
}
