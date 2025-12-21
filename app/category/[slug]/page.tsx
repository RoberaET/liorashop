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
    title: `${category.name} | LUXE`,
    description: `Shop our curated collection of ${category.name.toLowerCase()}. Premium quality products with timeless design.`,
  }
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params
  const category = categories.find((c) => c.id === slug)

  if (!category) {
    notFound()
  }

  const products = getProductsByCategory(slug)

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <CategoryPageContent initialProducts={products} category={category} slug={slug} />
      </main>
      <Footer />
    </div>
  )
}
