import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { SuccessContent } from "@/components/success-content"

export const metadata = {
  title: "Order Confirmed | LUXE",
  description: "Your order has been successfully placed.",
}

export default function CheckoutSuccessPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 flex items-center justify-center py-12 px-4">
        <SuccessContent />
      </main>
      <Footer />
    </div>
  )
}
