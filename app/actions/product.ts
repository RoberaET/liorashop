"use server"

import { globalForPrisma } from "@/lib/prisma"
import {
    getProductsByCategory,
    getProductById,
    getFeaturedProducts,
    searchProducts,
    products as staticProducts
} from "@/lib/data"

// const prisma = globalForPrisma.prisma || new (require("@prisma/client").PrismaClient)()

export async function getProductsAction() {
    // Force static data due to DB connection issues
    return { products: staticProducts }
}

export async function getProductByIdAction(id: string) {
    const product = getProductById(id)
    return { product: product || null }
}

export async function getProductsByCategoryAction(category: string) {
    const products = getProductsByCategory(category)
    return { products }
}

export async function getFeaturedProductsAction() {
    const products = getFeaturedProducts()
    return { products }
}

export async function searchProductsAction(query: string) {
    const products = searchProducts(query)
    return { products }
}
