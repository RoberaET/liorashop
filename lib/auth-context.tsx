"use client"

import React, { createContext, useContext, useEffect, useState } from "react"
import { RegisteredUser } from "./types"
import { db } from "./db"
import { useRouter } from "next/navigation"
import { useStore } from "./store"

interface AuthContextType {
    user: RegisteredUser | null
    login: (email: string, password: string) => Promise<void>
    register: (data: Omit<RegisteredUser, "id" | "role">) => Promise<void>
    logout: () => void
    isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<RegisteredUser | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const router = useRouter()

    const { cart, wishlist, setCart, setWishlist, clearCart } = useStore()

    // Sync Cart & Wishlist with DB when they change
    useEffect(() => {
        if (user) {
            db.saveCart(user.id, cart)
        }
    }, [cart, user])

    useEffect(() => {
        if (user) {
            db.saveWishlist(user.id, wishlist)
        }
    }, [wishlist, user])

    useEffect(() => {
        const initAuth = async () => {
            const storedUser = localStorage.getItem("liora_user")
            if (storedUser) {
                const parsedUser = JSON.parse(storedUser)
                setUser(parsedUser)

                // Load data
                const userCart = db.getCart(parsedUser.id)
                const userWishlist = db.getWishlist(parsedUser.id)
                setCart(userCart)
                setWishlist(userWishlist)
            }
            setIsLoading(false)
        }
        initAuth()
    }, [])

    const login = async (email: string, password: string) => {
        setIsLoading(true)
        try {
            const user = await db.validateCredentials(email, password)
            if (!user) throw new Error("Invalid credentials")

            setUser(user)
            localStorage.setItem("liora_user", JSON.stringify(user))

            // Load data
            const userCart = db.getCart(user.id)
            const userWishlist = db.getWishlist(user.id)
            setCart(userCart)
            setWishlist(userWishlist)

            if (user.role === 'admin') router.push('/admin/dashboard')
            else router.push('/')

        } catch (error) {
            throw error
        } finally {
            setIsLoading(false)
        }
    }

    const register = async (data: Omit<RegisteredUser, "id" | "role">) => {
        setIsLoading(true)
        try {
            const newUser = await db.createUser(data)
            setUser(newUser)
            localStorage.setItem("liora_user", JSON.stringify(newUser))
            router.push('/')
        } catch (error) {
            throw error
        } finally {
            setIsLoading(false)
        }
    }

    const logout = () => {
        setUser(null)
        localStorage.removeItem("liora_user")
        clearCart()
        setWishlist([])
        router.push("/login")
    }

    return (
        <AuthContext.Provider value={{ user, login, register, logout, isLoading }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => {
    const context = useContext(AuthContext)
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider")
    }
    return context
}
