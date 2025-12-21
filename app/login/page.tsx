import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { LoginView } from "@/components/login-view"
import Link from "next/link"

export const metadata = {
  title: "Sign In | LUXE",
  description: "Sign in to your LUXE account to access your orders, wishlist, and more.",
}

export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 flex items-center justify-center py-12 px-4">
        <LoginView />
      </main>
      <Footer />
    </div>
  )
}
