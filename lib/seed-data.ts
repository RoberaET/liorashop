import { RegisteredUser } from "./types"

export const INITIAL_DB = {
    users: [
        {
            id: "admin-1",
            name: "Admin User",
            email: "admin@liorashop.com",
            role: "admin" as const,
            password: btoa("t#0Us@nd3840"),
            addresses: [],
            settings: { notifications: true, currency: "ETB", marketingEmails: false },
            createdAt: new Date("2024-01-01")
        },
        {
            id: "demo-user-1",
            name: "Demo Customer",
            email: "customer@liorashop.com",
            role: "user" as const,
            password: btoa("password123"),
            addresses: [
                {
                    fullName: "Demo Customer",
                    email: "customer@liorashop.com",
                    street: "Bole Road",
                    city: "Addis Ababa",
                    state: "Addis Ababa",
                    zipCode: "1000",
                    country: "Ethiopia",
                    phone: "+251911234567"
                }
            ],
            settings: { notifications: true, currency: "ETB", marketingEmails: true },
            createdAt: new Date("2024-01-01")
        }
    ] as RegisteredUser[],
    orders: {},
    carts: {},
    wishlists: {},
    addresses: {}
}
