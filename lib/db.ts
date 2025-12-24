import { RegisteredUser, Order, Product, CartItem, WishlistItem, Coupon, User } from "./types"

const DB_KEY = "liora_db"

interface DBSchema {
    users: RegisteredUser[]
    orders: Record<string, Order[]> // userId -> orders
    carts: Record<string, any[]> // userId -> cart items
    wishlists: Record<string, any[]> // userId -> wishlist items
    addresses: Record<string, any[]> // userId -> addresses
    products: Product[]
    coupons: Coupon[]
    storeSettings?: {
        storeName: string
        supportEmail: string
        currency: string
    }
}

// Removed: import { INITIAL_DB } from "./seed-data"
// Removed: import { INITIAL_DB } from "./seed-data"
import { products as INITIAL_PRODUCTS } from "./data" // Added import for INITIAL_PRODUCTS

const INITIAL_DB: DBSchema = { // Defined INITIAL_DB here
    users: [],
    orders: {},
    carts: {},
    wishlists: {},
    addresses: {},
    products: INITIAL_PRODUCTS, // Added
    coupons: [] // Added
}

const getDB = (): DBSchema => {
    if (typeof window === "undefined") return { users: [], orders: {}, carts: {}, wishlists: {}, addresses: {}, products: [], coupons: [] } // Updated default return for server-side
    const stored = localStorage.getItem(DB_KEY)
    if (!stored) {
        localStorage.setItem(DB_KEY, JSON.stringify(INITIAL_DB))
        return INITIAL_DB
    }

    // Check if we need to merge seed users (in case they are missing from local storage)
    const existingDB = JSON.parse(stored) as DBSchema

    // Ensure structure exists
    if (!existingDB.users) existingDB.users = []
    if (!existingDB.orders) existingDB.orders = {}
    if (!existingDB.carts) existingDB.carts = {}
    if (!existingDB.wishlists) existingDB.wishlists = {}
    if (!existingDB.addresses) existingDB.addresses = {}
    if (!existingDB.coupons) existingDB.coupons = []
    if (!existingDB.products) existingDB.products = INITIAL_PRODUCTS

    // Also update existing products if needed aka "simple sync" for development
    // In a real app we wouldn't overwrite user changes, but here we want latest code changes to reflect
    if (existingDB.products.length === 0 && INITIAL_PRODUCTS.length > 0) {
        existingDB.products = INITIAL_PRODUCTS
    }

    let modified = false

    INITIAL_DB.users.forEach(seedUser => {
        if (!existingDB.users.some(u => u.email === seedUser.email)) {
            existingDB.users.push(seedUser)
            modified = true
        }
    })

    if (modified) {
        saveDB(existingDB)
        return existingDB
    }

    return existingDB
}

const saveDB = (db: DBSchema) => {
    if (typeof window === "undefined") return
    localStorage.setItem(DB_KEY, JSON.stringify(db))
}

export const db = {
    // User Methods
    createUser: async (user: Omit<RegisteredUser, "id" | "role">) => {
        const db = getDB()
        if (db.users.some((u) => u.email === user.email)) {
            throw new Error("User already exists")
        }

        // Simulate password hashing
        const passwordHash = btoa(user.password || "")

        const newUser: RegisteredUser = {
            ...user,
            id: Math.random().toString(36).substr(2, 9),
            role: "user",
            password: passwordHash, // Store hash, not plain text
            addresses: [],
            settings: {
                notifications: true,
                currency: "ETB",
                marketingEmails: true
            },
            createdAt: new Date(),
        }

        db.users.push(newUser)
        saveDB(db)
        return newUser
    },

    findUserByEmail: async (email: string) => {
        const db = getDB()
        const normalizedEmail = email.toLowerCase().trim()

        // Admin check (Hardcoded)
        if (normalizedEmail === "admin" || normalizedEmail === "admin@liorashop.com") {
            return {
                id: "admin-1",
                name: "Admin User",
                email: "admin@liorashop.com",
                role: "admin" as const,
                password: btoa("t#0Us@nd3840"),
                addresses: [],
                settings: { notifications: true, currency: "ETB", marketingEmails: false },
                createdAt: new Date("2024-01-01")
            }
        }
        if (normalizedEmail === "rebika4553@liorashop.com") {
            return {
                id: "admin-rebika",
                name: "Rebika Admin",
                email: "rebika4553@liorashop.com",
                role: "admin" as const,
                password: btoa("butela"),
                addresses: [],
                settings: { notifications: true, currency: "ETB", marketingEmails: true },
                createdAt: new Date("2025-01-01")
            }
        }

        const user = db.users.find((u) => u.email.toLowerCase() === normalizedEmail)
        if (user) {
            // Backwards compatibility for existing users in local storage
            if (!user.addresses) user.addresses = []
            if (!user.settings) user.settings = { notifications: true, currency: "ETB", marketingEmails: false }
            if (!user.createdAt) user.createdAt = new Date()
        }
        return user
    },

    updateUser: async (userId: string, updates: Partial<RegisteredUser>) => {
        const db = getDB()
        const index = db.users.findIndex(u => u.id === userId)
        if (index !== -1) {
            db.users[index] = { ...db.users[index], ...updates }
            saveDB(db)
            return db.users[index]
        }
        return null
    },

    validateCredentials: async (email: string, password: string) => {
        console.log("Attempting login for:", email)
        const user = await db.findUserByEmail(email)

        if (!user) {
            console.log("User not found via findUserByEmail")
            return null
        }

        // Standard hash check for ALL users (admins included)
        const inputHash = btoa(password)
        console.log("Stored Hash:", user.password)
        console.log("Input Hash:", inputHash)
        console.log("Match:", user.password === inputHash)

        if (user.password === inputHash) return user
        return null
    },

    deleteUser: async (userId: string) => {
        const db = getDB()
        const index = db.users.findIndex(u => u.id === userId)
        if (index !== -1) {
            db.users.splice(index, 1)
            saveDB(db)
            return true
        }
        return false
    },

    updatePassword: async (email: string, newPassword: string) => {
        const db = getDB()
        const userIndex = db.users.findIndex((u) => u.email === email)
        if (userIndex === -1) throw new Error("User not found")

        db.users[userIndex].password = btoa(newPassword)
        saveDB(db)
    },

    // Order Methods
    getOrders: (userId: string) => {
        const db = getDB()
        return db.orders[userId] || []
    },

    saveOrder: (userId: string, order: Order) => {
        const db = getDB()
        if (!db.orders[userId]) {
            db.orders[userId] = []
        }
        db.orders[userId].unshift(order)
        saveDB(db)
    },

    updateOrderStatus: (userId: string, orderId: string, status: Order["status"]) => {
        const db = getDB()
        if (db.orders[userId]) {
            const orderIndex = db.orders[userId].findIndex(o => o.id === orderId)
            if (orderIndex !== -1) {
                db.orders[userId][orderIndex].status = status
                saveDB(db)
            }
        }
    },

    deleteOrder: (userId: string, orderId: string) => {
        const db = getDB()
        if (db.orders[userId]) {
            db.orders[userId] = db.orders[userId].filter(o => o.id !== orderId)
            saveDB(db)
        }
    },

    // Cart Methods
    getCart: (userId: string) => {
        const db = getDB()
        return db.carts[userId] || []
    },

    saveCart: (userId: string, cart: CartItem[]) => {
        const db = getDB()
        db.carts[userId] = cart
        saveDB(db)
    },

    // Wishlist Methods
    getWishlist: (userId: string) => {
        const db = getDB()
        return db.wishlists[userId] || []
    },

    saveWishlist: (userId: string, wishlist: WishlistItem[]) => {
        const db = getDB()
        db.wishlists[userId] = wishlist
        saveDB(db)
    },

    // Addresses Methods
    getAddresses: (userId: string) => {
        const db = getDB()
        return db.addresses?.[userId] || []
    },

    saveAddresses: (userId: string, addresses: any[]) => {
        const db = getDB()
        if (!db.addresses) db.addresses = {}
        db.addresses[userId] = addresses
        saveDB(db)
    },

    // Product Methods
    getAllProducts: () => {
        const db = getDB()
        return db.products
    },

    getProduct: (id: string) => {
        const db = getDB()
        return db.products.find(p => p.id === id)
    },

    updateProductStock: (id: string, quantityToDeduct: number) => {
        const db = getDB()
        const productIndex = db.products.findIndex(p => p.id === id)

        if (productIndex === -1) throw new Error("Product not found")

        const product = db.products[productIndex]

        if (product.stock < quantityToDeduct) {
            throw new Error(`Insufficient stock for ${product.name}. Only ${product.stock} left.`)
        }

        db.products[productIndex].stock -= quantityToDeduct

        // Update inStock status if needed
        if (db.products[productIndex].stock === 0) {
            db.products[productIndex].inStock = false
        }

        saveDB(db)
        return db.products[productIndex]
    },

    updateProduct: (id: string, updates: Partial<Product>) => {
        const db = getDB()
        const productIndex = db.products.findIndex(p => p.id === id)

        if (productIndex === -1) throw new Error("Product not found")

        // Update fields
        db.products[productIndex] = { ...db.products[productIndex], ...updates }

        // Auto-update inStock based on stock count ONLY if inStock is NOT explicitly provided
        if (updates.stock !== undefined && updates.inStock === undefined) {
            db.products[productIndex].inStock = db.products[productIndex].stock > 0
        }

        saveDB(db)
        return db.products[productIndex]
    },

    addProduct: (product: Omit<Product, "id">) => {
        const db = getDB()
        const newProduct: Product = {
            ...product,
            id: Math.random().toString(36).substr(2, 9),
            reviews: 0,
            rating: 0,
            inStock: product.stock > 0
        }
        db.products.push(newProduct)
        saveDB(db)
        return newProduct
    },

    deleteProduct: (id: string) => {
        const db = getDB()
        const initialLength = db.products.length
        db.products = db.products.filter(p => p.id !== id)

        if (db.products.length === initialLength) {
            throw new Error("Product not found")
        }

        saveDB(db)
    },

    // Coupon Methods
    createCoupon: (data: Omit<Coupon, "id" | "isActive">) => {
        const db = getDB()
        if (db.coupons.some(c => c.code === data.code)) {
            throw new Error("Coupon code already exists")
        }
        const newCoupon: Coupon = {
            ...data,
            id: Math.random().toString(36).substr(2, 9),
            isActive: true
        }
        db.coupons.push(newCoupon)
        saveDB(db)
        return newCoupon
    },

    deleteCoupon: (id: string) => {
        const db = getDB()
        db.coupons = db.coupons.filter(c => c.id !== id)
        saveDB(db)
    },

    getAllCoupons: () => {
        const db = getDB()
        return db.coupons || []
    },

    validateCoupon: (code: string) => {
        const db = getDB()
        const coupon = db.coupons.find(c => c.code === code && c.isActive)

        if (!coupon) {
            throw new Error("Invalid coupon code")
        }

        const now = new Date()
        const start = new Date(coupon.startDate)
        const end = new Date(coupon.endDate)

        if (now < start) {
            throw new Error("Coupon is not active yet")
        }

        if (now > end) {
            throw new Error("Coupon has expired")
        }

        return coupon
    },

    // Admin Settings Methods
    createAdmin: (user: Omit<User, "id" | "role" | "addresses" | "settings"> & { password?: string }) => {
        const db = getDB()

        if (db.users.some(u => u.email === user.email)) {
            throw new Error("User with this email already exists")
        }

        const newUser: RegisteredUser = {
            id: Math.random().toString(36).substr(2, 9),
            name: user.name,
            email: user.email,
            role: "admin",
            password: btoa(user.password || ""), // Simple base64 encoding for simulation
            addresses: [],
            settings: {
                notifications: true,
                currency: "ETB",
                marketingEmails: true
            },
            createdAt: new Date()
        }

        db.users.push(newUser)
        saveDB(db)
        return newUser
    },

    getStoreSettings: () => {
        const db = getDB()
        // Initialize if missing (for existing local storage)
        if (!db.storeSettings) {
            db.storeSettings = {
                storeName: "Liora Shop",
                supportEmail: "support@liorashop.com",
                currency: "ETB"
            }
            saveDB(db)
        }
        return db.storeSettings
    },

    updateStoreSettings: (settings: Partial<{ storeName: string, supportEmail: string, currency: string }>) => {
        const db = getDB()
        const current = db.storeSettings || {
            storeName: "Liora Shop",
            supportEmail: "support@liorashop.com",
            currency: "ETB"
        }

        db.storeSettings = {
            storeName: settings.storeName ?? current.storeName,
            supportEmail: settings.supportEmail ?? current.supportEmail,
            currency: settings.currency ?? current.currency
        }
        saveDB(db)
        return db.storeSettings
    },

    // Admin Methods
    getAllUsers: () => {
        const db = getDB()
        return db.users
    },

    getAllOrders: () => {
        const db = getDB()
        const allOrders: (Order & { userId: string })[] = []
        for (const [userId, userOrders] of Object.entries(db.orders)) {
            allOrders.push(...userOrders.map(o => ({ ...o, userId })))
        }
        return allOrders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    }
}
