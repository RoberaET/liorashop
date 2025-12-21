"use server"

import { globalForPrisma } from "@/lib/prisma"

const prisma = globalForPrisma.prisma || new (require("@prisma/client").PrismaClient)()

export async function getProductsAction() {
    try {
        const products = await prisma.product.findMany()
        return { products }
    } catch (error) {
        console.error("Error fetching products:", error)
        return { error: "Failed to fetch products" }
    }
}

export async function getProductByIdAction(id: string) {
    try {
        const product = await prisma.product.findUnique({
            where: { id },
        })
        return { product }
    } catch (error) {
        console.error("Error fetching product:", error)
        return { error: "Failed to fetch product" }
    }
}

export async function getProductsByCategoryAction(category: string) {
    try {
        const products = await prisma.product.findMany({
            where: { category },
        })
        return { products }
    } catch (error) {
        console.error("Error fetching products by category:", error)
        return { error: "Failed to fetch products" }
    }
}

export async function getFeaturedProductsAction() {
    try {
        const products = await prisma.product.findMany({
            where: {
                tags: {
                    has: "bestseller",
                },
            },
        })
        return { products }
    } catch (error) {
        console.error("Error fetching featured products:", error)
        return { error: "Failed to fetch featured products" }
    }
}

export async function searchProductsAction(query: string) {
    try {
        const products = await prisma.product.findMany({
            where: {
                OR: [
                    { name: { contains: query, mode: "insensitive" } },
                    { description: { contains: query, mode: "insensitive" } },
                    { category: { contains: query, mode: "insensitive" } },
                ],
            },
        })
        return { products }
    } catch (error) {
        console.error("Error searching products:", error)
        return { error: "Failed to search products" }
    }
}
