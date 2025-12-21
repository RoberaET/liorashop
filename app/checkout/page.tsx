import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { CheckoutContent } from "@/components/checkout-content"

export const metadata = {
  title: "Checkout | LUXE",
  description: "Complete your purchase securely.",
}

export default function CheckoutPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 bg-muted/30">
        <CheckoutContent />
      </main>
      <Footer />
    </div>
  )
}
