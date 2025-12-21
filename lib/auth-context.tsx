"use client"

import React, { createContext, useContext, useEffect, useState } from "react"
import { RegisteredUser, User, Address, UserSettings } from "./types"
import { db } from "./db"
import { useRouter } from "next/navigation"
import { useStore } from "./store"
import { loginAction, registerAction } from "@/app/actions/auth"
import { addAddressAction, removeAddressAction, editAddressAction, updateSettingsAction } from "@/app/actions/user"

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
    updateProfilePicture: (image: string) => Promise<void>
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
            const result = await loginAction(email, password)
            if (result.error || !result.user) throw new Error(result.error || "Login failed")

            const user = result.user as RegisteredUser // Type assertion as Date might be string
            setUser(user)
            localStorage.setItem("liora_user", JSON.stringify(user))

            // Load data from user object (Prisma includes these)
            // We need to map Prisma relations to Client state
            setAddresses(user.addresses || [])
            // Cart/Wishlist from Prisma (if we loaded them)
            // For now, we trust Prisma return
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
            const result = await registerAction(data)
            if (result.error || !result.user) throw new Error(result.error || "Registration failed")

            const newUser = result.user as RegisteredUser
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
        // Optimistic update could go here, but let's wait for server
        try {
            const result = await addAddressAction(user.id, address)
            if (result.error || !result.address) throw new Error(result.error)

            const updatedAddresses = [...user.addresses, result.address]
            const updatedUser = { ...user, addresses: updatedAddresses }
            setUser(updatedUser)
            saveUserToLocal(updatedUser)
        } catch (error) {
            console.error(error)
        }
    }

    const removeAddress = async (index: number) => {
        if (!user) return
        const addressToRemove = user.addresses[index]
        if (!addressToRemove.id) return // Cannot delete unsaved address

        try {
            const result = await removeAddressAction(addressToRemove.id)
            if (result.error) throw new Error(result.error)

            const updatedAddresses = user.addresses.filter((_, i) => i !== index)
            const updatedUser = { ...user, addresses: updatedAddresses }
            setUser(updatedUser)
            saveUserToLocal(updatedUser)
        } catch (error) {
            console.error(error)
        }
    }

    const editAddress = async (index: number, address: Address) => {
        if (!user) return
        const addressToEdit = user.addresses[index]
        if (!addressToEdit.id) return

        try {
            const result = await editAddressAction(addressToEdit.id, address)
            if (result.error || !result.address) throw new Error(result.error)

            const updatedAddresses = [...user.addresses]
            updatedAddresses[index] = result.address
            const updatedUser = { ...user, addresses: updatedAddresses }
            setUser(updatedUser)
            saveUserToLocal(updatedUser)
        } catch (error) {
            console.error(error)
        }
    }

    const updateSettings = async (settings: Partial<UserSettings>) => {
        if (!user) return
        try {
            const result = await updateSettingsAction(user.id, settings)
            if (result.error) throw new Error(result.error)

            const updatedSettings = { ...user.settings, ...settings }
            const updatedUser = { ...user, settings: updatedSettings }
            setUser(updatedUser)
            saveUserToLocal(updatedUser)
        } catch (error) {
            console.error(error)
        }
    }

    const updateProfilePicture = async (image: string) => {
        if (!user) return
        try {
            // Lazy import or duplicate import to avoid circular dependency if needed, 
            // but we can import at top.
            // We need to import updateProfilePictureAction at top.
            const { updateProfilePictureAction } = await import("@/app/actions/user")
            const result = await updateProfilePictureAction(user.id, image)
            if (result.error) throw new Error(result.error)

            const updatedUser = { ...user, image }
            setUser(updatedUser)
            saveUserToLocal(updatedUser)
        } catch (error) {
            console.error(error)
            throw error
        }
    }

    const saveUserToLocal = (u: RegisteredUser) => {
        localStorage.setItem("liora_user", JSON.stringify(u))
    }

    return (
        <AuthContext.Provider value={{ user, login, register, logout, isLoading, addAddress, removeAddress, editAddress, updateSettings, updateProfilePicture }}>
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
