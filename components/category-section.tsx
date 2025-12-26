import Link from "next/link"
import { Shirt, Footprints, Sparkles, SprayCan } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

const categories = [
  {
    id: "clothes",
    name: "Clothes",
    description: "Curated fashion essentials",
    icon: Shirt,
    image: "/category-clothes.png",
  },
  {
    id: "shoes",
    name: "Shoes",
    description: "Footwear for every occasion",
    icon: Footprints,
    image: "/category-shoes.png",
  },
  {
    id: "cosmetics",
    name: "Cosmetics",
    description: "Beauty & skincare",
    icon: Sparkles,
    image: "/category-cosmetics.png",
  },
  {
    id: "perfumes",
    name: "Perfumes",
    description: "Signature fragrances",
    icon: SprayCan,
    image: "/su1.jpg",
  },
]

export function CategorySection() {
  return (
    <section id="categories" className="py-16 md:py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          {/* Minimal Header */}
        </div>

        <div className="flex overflow-x-auto pb-8 gap-8 md:gap-12 justify-start md:justify-center scrollbar-hide">
          {categories.map((category) => {
            return (
              <Link key={category.id} href={`/category/${category.id}`} className="group flex flex-col items-center flex-shrink-0">
                <div className="relative h-24 w-24 md:h-32 md:w-32 rounded-full overflow-hidden mb-4 border border-border/50 group-hover:border-black/50 transition-colors duration-300">
                  <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                    style={{ backgroundImage: `url(${category.image})` }}
                  />
                  {/* Light overlay on hover */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
                </div>
                <h3 className="font-sans text-sm font-medium tracking-wide uppercase text-center group-hover:text-black/70 transition-colors">{category.name}</h3>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}
