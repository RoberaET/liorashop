import { notFound } from "next/navigation"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { getProductsByCategory, categories } from "@/lib/data"
import { CategoryPageContent } from "@/components/category-page-content"

interface CategoryPageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: CategoryPageProps) {
  const { slug } = await params
  const category = categories.find((c) => c.id === slug)

  if (!category) {
    return { title: "Category Not Found" }
  }

  return {
    title: category.name,
    description: `Shop our curated collection of ${category.name.toLowerCase()}. Premium quality products with timeless design.`,
    openGraph: {
      title: category.name,
      description: `Shop our curated collection of ${category.name.toLowerCase()}.`,
      images: [category.image || "/placeholder.svg"],
    },
  }
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params
  const category = categories.find((c) => c.id === slug)

  if (!category) {
    notFound()
  }

  const products = getProductsByCategory(slug)

  // JSON-LD for Breadcrumbs
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://liorashop.com"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": category.name,
        "item": `https://liorashop.com/category/${slug}`
      }
    ]
  }

  return (
    <div className="min-h-screen flex flex-col">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Navbar />
      <main className="flex-1">
        <CategoryPageContent initialProducts={products} category={category} slug={slug} />
      </main>
      <Footer />
    </div>
  )
}
