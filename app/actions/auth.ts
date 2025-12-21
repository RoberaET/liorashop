"use server"

import { prisma } from "@/lib/prisma"
import { RegisteredUser } from "@/lib/types"
import bcrypt from "bcryptjs"

export async function loginAction(email: string, password: string) {
    try {
        const user = await prisma.user.findUnique({
            where: { email },
            include: {
                addresses: true,
                cart: { include: { product: true } },
                wishlist: { include: { product: true } },
                orders: true,
            }
        })

        if (!user || !user.password) {
            return { error: "Invalid credentials" }
        }

        const isValid = await bcrypt.compare(password, user.password)

        if (!isValid) {
            return { error: "Invalid credentials" }
        }

        // Convert Prisma User to our App User type (some fields might slightly differ in types like Date)
        // We need to be careful with Dates. Client components don't like Date objects passed directly unless serialized.
        // However, for now we will return it and see, or serialize.
        // Next.js Server Actions can return complex objects but Dates are sometimes tricky.
        // Let's rely on basic serialization.

        // Remove password from response and structure settings
        const { password: _, currency, notifications, marketingEmails, ...userWithoutPasswordAndSettings } = user

        const userWithSettings = {
            ...userWithoutPasswordAndSettings,
            settings: {
                currency,
                notifications,
                marketingEmails
            }
        }

        return { user: userWithSettings }

    } catch (error) {
        console.error("Login error:", error)
        return { error: "Something went wrong" }
    }
}

export async function registerAction(data: Pick<RegisteredUser, "name" | "email" | "password">) {
    try {
        const existingUser = await prisma.user.findUnique({
            where: { email: data.email }
        })

        if (existingUser) {
            return { error: "User already exists" }
        }

        const hashedPassword = await bcrypt.hash(data.password || "", 10)

        const user = await prisma.user.create({
            data: {
                name: data.name,
                email: data.email,
                password: hashedPassword,
                role: "user",
                // Default settings
                currency: "ETB",
                notifications: true,
                marketingEmails: true
            },
            include: {
                addresses: true,
                // no cart or wishlist yet
            }
        })

        const { password: _, currency, notifications, marketingEmails, ...userWithoutPasswordAndSettings } = user

        const userWithSettings = {
            ...userWithoutPasswordAndSettings,
            settings: {
                currency,
                notifications,
                marketingEmails
            }
        }

        return { user: userWithSettings }

    } catch (error) {
        console.error("Register error:", error)
        return { error: "Something went wrong" }
    }
}
