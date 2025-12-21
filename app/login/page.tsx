import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { LoginForm } from "@/components/login-form"
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
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <h1 className="text-3xl font-serif font-bold">Welcome Back</h1>
            <p className="text-muted-foreground mt-2">Sign in to your account to continue</p>
          </div>

          <LoginForm />

          <p className="text-center text-sm text-muted-foreground">
            Don't have an account?{" "}
            <Link href="/register" className="font-medium text-foreground hover:underline">
              Create one
            </Link>
          </p>
        </div>
      </main>
      <Footer />
    </div>
  )
}
