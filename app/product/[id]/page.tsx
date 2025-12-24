import { notFound } from "next/navigation"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
// import { getProductById, products } from "@/lib/data"
import { getProductByIdAction, getProductsByCategoryAction } from "@/app/actions/product"
import { ProductDetails } from "@/components/product-details"

interface ProductPageProps {
  params: Promise<{ id: string }>
}

// ... imports

export async function generateMetadata({ params }: ProductPageProps) {
  const { id } = await params
  const { product } = await getProductByIdAction(id).catch(() => ({ product: null }))

  if (!product) {
    // If server fetch fails, we can't generate specific metadata easily.
    // We'll return generic metadata and let the client render the product details.
    return {
      title: "Product Details - Liora Shop",
      description: "View product details."
    }
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

  // Attempt to fetch from server, but don't fail if not found (might be client-only product)
  const { product } = await getProductByIdAction(id).catch(() => ({ product: null }))

  let relatedProducts: any[] = []
  if (product) {
    const { products: categoryProducts } = await getProductsByCategoryAction(product.category).catch(() => ({ products: [] }))
    relatedProducts = categoryProducts?.filter((p: any) => p.id !== product.id).slice(0, 4) || []
  }

  // Calculate discount only if product exists
  const discount = product?.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0

  // Only render JSON-LD if product is found on server
  const jsonLd = product ? {
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
  } : null

  return (
    <div className="min-h-screen flex flex-col">
      {jsonLd && <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />}
      <Navbar />
      <main className="flex-1">
        <ProductDetails
          productId={id}
          product={product}
          relatedProducts={relatedProducts}
          discount={discount}
        />
      </main>
      <Footer />
    </div>
  )
}
