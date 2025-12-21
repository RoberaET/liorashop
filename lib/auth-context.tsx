"use client"

import React, { createContext, useContext, useEffect, useState } from "react"
import { RegisteredUser, User, Address, UserSettings } from "./types"
import { db } from "./db"
import { useRouter } from "next/navigation"
import { useStore } from "./store"

interface AuthContextType {
    user: User | null
    login: (email: string, password: string) => Promise<void>
    register: (data: Pick<RegisteredUser, "name" | "email" | "password">) => Promise<void>
    logout: () => void
    isLoading: boolean
    addAddress: (address: Address) => Promise<void>
    removeAddress: (index: number) => Promise<void>
    editAddress: (index: number, address: Address) => Promise<void>
    updateSettings: (settings: Partial<UserSettings>) => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<RegisteredUser | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const router = useRouter()

    const { cart, wishlist, setCart, setWishlist, clearCart, setOrders, addresses, setAddresses } = useStore()

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
        if (user) {
            db.saveAddresses(user.id, addresses)
        }
    }, [addresses, user])

    useEffect(() => {
        const initAuth = async () => {
            const storedUser = localStorage.getItem("liora_user")
            if (storedUser) {
                const parsedUser = JSON.parse(storedUser)
                setUser(parsedUser)

                // Load data
                const userCart = db.getCart(parsedUser.id)
                const userWishlist = db.getWishlist(parsedUser.id)
                const userOrders = db.getOrders(parsedUser.id)
                const userAddresses = db.getAddresses(parsedUser.id)
                setCart(userCart)
                setWishlist(userWishlist)
                setOrders(userOrders)
                setAddresses(userAddresses)
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
            const userOrders = db.getOrders(user.id)
            const userAddresses = db.getAddresses(user.id)
            setCart(userCart)
            setWishlist(userWishlist)
            setOrders(userOrders)
            setAddresses(userAddresses)

            if (user.role === 'admin') router.push('/admin/dashboard')
            else router.push('/')

        } catch (error) {
            throw error
        } finally {
            setIsLoading(false)
        }
    }

    const register = async (data: any) => {
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
        setOrders([])
        setAddresses([])
        router.push("/login")
    }

    const addAddress = async (address: Address) => {
        if (!user) return
        const updatedAddresses = [...user.addresses, address]
        const updatedUser = await db.updateUser(user.id, { addresses: updatedAddresses })
        if (updatedUser) setUser(updatedUser)
    }

    const removeAddress = async (index: number) => {
        if (!user) return
        const updatedAddresses = user.addresses.filter((_, i) => i !== index)
        const updatedUser = await db.updateUser(user.id, { addresses: updatedAddresses })
        if (updatedUser) setUser(updatedUser)
    }

    const editAddress = async (index: number, address: Address) => {
        if (!user) return
        const updatedAddresses = [...user.addresses]
        updatedAddresses[index] = address
        const updatedUser = await db.updateUser(user.id, { addresses: updatedAddresses })
        if (updatedUser) setUser(updatedUser)
    }

    const updateSettings = async (settings: Partial<UserSettings>) => {
        if (!user) return
        const updatedSettings = { ...user.settings, ...settings }
        const updatedUser = await db.updateUser(user.id, { settings: updatedSettings })
        if (updatedUser) setUser(updatedUser)
    }

    return (
        <AuthContext.Provider value={{ user, login, register, logout, isLoading, addAddress, removeAddress, editAddress, updateSettings }}>
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
