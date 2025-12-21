import { notFound } from "next/navigation"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
// import { getProductById, products } from "@/lib/data"
import { getProductByIdAction, getProductsByCategoryAction } from "@/app/actions/product"
import { ProductDetails } from "@/components/product-details"

interface ProductPageProps {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: ProductPageProps) {
  const { id } = await params
  const { product } = await getProductByIdAction(id)

  if (!product) {
    return { title: "Product Not Found" }
  }

  return {
    title: product.name,
    description: product.description,
    openGraph: {
      images: product.images && product.images.length > 0 ? product.images : [product.image],
    },
  }
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = await params
  const { product } = await getProductByIdAction(id)

  if (!product) {
    notFound()
  }

  const { products: categoryProducts } = await getProductsByCategoryAction(product.category)
  const relatedProducts = categoryProducts?.filter((p: any) => p.id !== product.id).slice(0, 4) || []

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0

  // JSON-LD for Product
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": product.name,
    "image": product.images || [product.image],
    "description": product.description,
    "sku": `LX-${product.id}`,
    "brand": {
      "@type": "Brand",
      "name": "Liora Shop"
    },
    "offers": {
      "@type": "Offer",
      "url": `https://liorashop.com/product/${product.id}`,
      "priceCurrency": "ETB",
      "price": product.price,
      "availability": product.inStock ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      "itemCondition": "https://schema.org/NewCondition"
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Navbar />
      <main className="flex-1">
        <ProductDetails
          product={product}
          relatedProducts={relatedProducts}
          discount={discount}
        />
      </main>
      <Footer />
    </div>
  )
}
