"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Eye, EyeOff, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { useStore } from "@/lib/store"
import Link from "next/link"

export function LoginForm() {
  const [isRegistering, setIsRegistering] = useState(false)
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const router = useRouter()
  const setUser = useStore((state) => state.setUser)
  const registeredUsers = useStore((state) => state.registeredUsers)
  const registerUser = useStore((state) => state.registerUser)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    // Mock network delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // 1. Admin Login
    if (email === "admin" && password === "t#0Us@nd3840") {
      setUser({
        id: "admin-1",
        name: "Admin User",
        email: "admin@liorashop.com",
        role: "admin",
      })
      router.push("/admin/dashboard")
      return
    }

    if (isRegistering) {
      // Registration Logic
      if (registeredUsers.some(u => u.email === email)) {
        setError("Account with this email already exists.")
        setIsLoading(false)
        return
      }

      const newUser = {
        id: Math.random().toString(36).substr(2, 9),
        name,
        email,
        role: "user" as const,
        password
      }
      registerUser(newUser)
      setUser(newUser)
      router.push("/account")

    } else {
      // Login Verification Logic
      const existingUser = registeredUsers.find(u => u.email === email)

      if (!existingUser) {
        setError("No account found with this email. Please create an account.")
      } else if (existingUser.password !== password) {
        setError("Incorrect password.")
      } else {
        setUser(existingUser)
        router.push("/account")
      }
    }
    setIsLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="p-3 text-sm text-destructive bg-destructive/10 rounded-md border border-destructive/20">
          {error}
        </div>
      )}

      {isRegistering && (
        <div className="space-y-2">
          <Label htmlFor="name">Full Name</Label>
          <Input
            id="name"
            type="text"
            placeholder="John Doe"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            disabled={isLoading}
          />
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="email">Email or Username</Label>
        <Input
          id="email"
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          disabled={isLoading}
        />
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="password">Password</Label>
          <Link href="/forgot-password" className="text-sm text-muted-foreground hover:text-foreground">
            Forgot password?
          </Link>
        </div>
        <div className="relative">
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={isLoading}
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4 text-muted-foreground" />
            ) : (
              <Eye className="h-4 w-4 text-muted-foreground" />
            )}
            <span className="sr-only">{showPassword ? "Hide password" : "Show password"}</span>
          </Button>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox id="remember" checked={rememberMe} onCheckedChange={(checked) => setRememberMe(checked as boolean)} />
        <Label htmlFor="remember" className="text-sm font-normal">
          Remember me for 30 days
        </Label>
      </div>

      <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Signing in...
          </>
        ) : (
          isRegistering ? "Create Account" : "Sign In"
        )}
      </Button>

      <div className="text-center text-sm">
        <span className="text-muted-foreground">
          {isRegistering ? "Already have an account? " : "Don't have an account? "}
        </span>
        <button
          type="button"
          className="font-medium hover:underline"
          onClick={() => {
            setIsRegistering(!isRegistering)
            setError("")
          }}
        >
          {isRegistering ? "Sign In" : "Create Account"}
        </button>
      </div>
    </form>
  )
}
