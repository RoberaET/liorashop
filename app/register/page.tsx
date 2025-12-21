import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { RegisterView } from "@/components/register-view"
import Link from "next/link"

export const metadata = {
  title: "Create Account | LUXE",
  description: "Create a LUXE account to track orders, save favorites, and more.",
}

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 flex items-center justify-center py-12 px-4">
        <RegisterView />
      </main>
      <Footer />
    </div>
  )
}
