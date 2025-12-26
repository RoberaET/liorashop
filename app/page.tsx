import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { HeroSection } from "@/components/hero-section"
import { FeaturedProducts } from "@/components/featured-products"
import { SplitSection } from "@/components/split-section"

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col relative bg-white">
      <Navbar />
      <main className="flex-1">
        <HeroSection />
        <FeaturedProducts />
        <SplitSection />
      </main>
      <Footer />
    </div>
  )
}
