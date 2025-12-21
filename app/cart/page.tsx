import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { CartContent } from "@/components/cart-content"

export const metadata = {
  title: "Shopping Cart | LUXE",
  description: "Review items in your shopping cart and proceed to checkout.",
}

export default function CartPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <CartContent />
      </main>
      <Footer />
    </div>
  )
}
