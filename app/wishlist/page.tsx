import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { WishlistContent } from "@/components/wishlist-content"

export const metadata = {
  title: "Wishlist | LUXE",
  description: "View and manage your saved items.",
}

export default function WishlistPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <WishlistContent />
      </main>
      <Footer />
    </div>
  )
}
