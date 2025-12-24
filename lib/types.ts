export interface Product {
  id: string
  sku?: string
  name: string
  description: string
  price: number
  originalPrice?: number | null
  image: string
  category: string
  rating: number
  reviews: number
  inStock: boolean
  stock: number
  tags?: string[]
  images?: string[]
}

export interface Category {
  id: string
  name: string
  icon: string
  count: number
  image: string
}

export interface Coupon {
  id: string
  code: string
  discountType: "percentage" | "fixed"
  discountValue: number // e.g., 0.10 for 10% or 100 for 100 ETB
  startDate: string
  endDate: string
  isActive: boolean
}

export interface CartItem {
  product: Product
  quantity: number
}

export interface WishlistItem {
  product: Product
  addedAt: Date
}

export interface UserSettings {
  notifications: boolean
  currency: string
  marketingEmails: boolean
}

export interface User {
  id: string
  name: string
  email: string
  image?: string | null
  avatar?: string
  role: "admin" | "user"
  addresses: Address[]
  settings: UserSettings
  mustChangePassword?: boolean
}

export interface RegisteredUser extends User {
  password?: string
  createdAt: Date
}

export interface Order {
  id: string
  items: CartItem[]
  total: number
  status: "pending" | "confirmed" | "shipped" | "delivered" | "cancelled"
  createdAt: Date
  shippingAddress: Address
}

export interface Address {
  id?: string
  fullName: string
  email: string
  street: string
  city: string
  state: string
  zipCode: string
  country: string
  phone: string
}
