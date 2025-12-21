import { RegisteredUser, Order, Product, CartItem, WishlistItem } from "./types"

const DB_KEY = "liora_db"

interface DBSchema {
    users: RegisteredUser[]
    orders: Record<string, Order[]> // userId -> orders
    carts: Record<string, any[]> // userId -> cart items
    wishlists: Record<string, any[]> // userId -> wishlist items
    addresses: Record<string, any[]> // userId -> addresses
}

const getDB = (): DBSchema => {
    if (typeof window === "undefined") return { users: [], orders: {}, carts: {}, wishlists: {}, addresses: {} }
    const stored = localStorage.getItem(DB_KEY)
    if (!stored) {
        const initial: DBSchema = { users: [], orders: {}, carts: {}, wishlists: {}, addresses: {} }
        localStorage.setItem(DB_KEY, JSON.stringify(initial))
        return initial
    }
    return JSON.parse(stored)
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
        }

        db.users.push(newUser)
        saveDB(db)
        return newUser
    },

    findUserByEmail: async (email: string) => {
        const db = getDB()
        // Admin check
        if (email === "admin" || email === "admin@liorashop.com") {
            return {
                id: "admin-1",
                name: "Admin User",
                email: "admin@liorashop.com",
                role: "admin" as const,
                password: btoa("t#0Us@nd3840")
            }
        }
        return db.users.find((u) => u.email === email)
    },

    validateCredentials: async (email: string, password: string) => {
        const user = await db.findUserByEmail(email)
        if (!user) return null

        // specific check for hardcoded admin
        if (user.role === 'admin') {
            if (password === "t#0Us@nd3840") return user
            return null
        }

        const inputHash = btoa(password)
        if (user.password === inputHash) return user
        return null
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
