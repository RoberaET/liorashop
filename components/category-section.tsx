import Link from "next/link"
import { Shirt, Footprints, Sparkles, SprayCan } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

const categories = [
  {
    id: "clothes",
    name: "Clothes",
    description: "Curated fashion essentials",
    icon: Shirt,
    image: "/placeholder.svg?height=300&width=400",
  },
  {
    id: "shoes",
    name: "Shoes",
    description: "Footwear for every occasion",
    icon: Footprints,
    image: "/placeholder.svg?height=300&width=400",
  },
  {
    id: "cosmetics",
    name: "Cosmetics",
    description: "Beauty & skincare",
    icon: Sparkles,
    image: "/placeholder.svg?height=300&width=400",
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
    <section id="categories" className="py-16 md:py-24 bg-secondary">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4">Shop by Category</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Explore our carefully curated collections designed to elevate your everyday style
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {categories.map((category) => {
            const Icon = category.icon
            return (
              <Link key={category.id} href={`/category/${category.id}`}>
                <Card className="group relative overflow-hidden border-0 shadow-sm hover:shadow-lg transition-all duration-300 h-64 md:h-80">
                  <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                    style={{ backgroundImage: `url(${category.image})` }}
                  />
                  <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors" />
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4 text-white">
                    <Icon className="h-10 w-10 mb-3 opacity-90" />
                    <h3 className="font-serif text-2xl font-bold mb-2">{category.name}</h3>
                    <p className="text-sm font-medium opacity-90 tracking-wide uppercase">{category.description}</p>
                  </div>
                </Card>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}
