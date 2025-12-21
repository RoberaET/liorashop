import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { AccountContent } from "@/components/account-content"

export const metadata = {
  title: "My Account | LUXE",
  description: "Manage your LUXE account, orders, and preferences.",
}

export default function AccountPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <AccountContent />
      </main>
      <Footer />
    </div>
  )
}
