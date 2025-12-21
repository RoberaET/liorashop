export interface Product {
  id: string
  sku?: string
  name: string
  description: string
  price: number
  originalPrice?: number
  image: string
  category: "clothes" | "shoes" | "cosmetics" | "perfumes"
  rating: number
  reviews: number
  inStock: boolean
  stock: number
  tags?: string[]
  images?: string[]
}

export interface CartItem {
  product: Product
  quantity: number
}

export interface WishlistItem {
  product: Product
  addedAt: Date
}

export interface User {
  id: string
  name: string
  email: string
  avatar?: string
  role: "admin" | "user"
}

export interface Order {
  id: string
  items: CartItem[]
  total: number
  status: "pending" | "confirmed" | "shipped" | "delivered"
  createdAt: Date
  shippingAddress: Address
}

export interface Address {
  fullName: string
  email: string
  street: string
  city: string
  state: string
  zipCode: string
  country: string
  phone: string
}
