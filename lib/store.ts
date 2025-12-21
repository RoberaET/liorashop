"use client"

import { create } from "zustand"
import type { CartItem, WishlistItem, Product, Address, Order } from "./types"

interface StoreState {
  // Cart
  cart: CartItem[]
  addToCart: (product: Product, quantity?: number) => void
  removeFromCart: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  clearCart: () => void
  getCartTotal: () => number
  getCartCount: () => number
  setCart: (cart: CartItem[]) => void

  // Wishlist
  wishlist: WishlistItem[]
  addToWishlist: (product: Product) => void
  removeFromWishlist: (productId: string) => void
  isInWishlist: (productId: string) => boolean
  setWishlist: (wishlist: WishlistItem[]) => void

  // Checkout
  shippingAddress: Address | null
  setShippingAddress: (address: Address) => void

  // Orders
  orders: Order[]
  setOrders: (orders: Order[]) => void
  addOrder: (order: Order) => void
  updateOrderStatus: (orderId: string, status: Order["status"]) => void
  removeOrder: (orderId: string) => void

  // Addresses
  addresses: Address[]
  setAddresses: (addresses: Address[]) => void
  addAddress: (address: Address) => void
  removeAddress: (index: number) => void
}

export const useStore = create<StoreState>((set, get) => ({
  // Cart
  cart: [],
  setCart: (cart) => set({ cart }),
  addToCart: (product, quantity = 1) => {
    const cart = get().cart
    const existingItem = cart.find((item) => item.product.id === product.id)

    if (existingItem) {
      set({
        cart: cart.map((item) =>
          item.product.id === product.id ? { ...item, quantity: item.quantity + quantity } : item,
        ),
      })
    } else {
      set({ cart: [...cart, { product, quantity }] })
    }
  },
  removeFromCart: (productId) => {
    set({ cart: get().cart.filter((item) => item.product.id !== productId) })
  },
  updateQuantity: (productId, quantity) => {
    if (quantity <= 0) {
      get().removeFromCart(productId)
      return
    }
    set({
      cart: get().cart.map((item) => (item.product.id === productId ? { ...item, quantity } : item)),
    })
  },
  clearCart: () => set({ cart: [] }),
  getCartTotal: () => {
    return get().cart.reduce((total, item) => total + item.product.price * item.quantity, 0)
  },
  getCartCount: () => {
    return get().cart.reduce((count, item) => count + item.quantity, 0)
  },

  // Wishlist
  wishlist: [],
  setWishlist: (wishlist) => set({ wishlist }),
  addToWishlist: (product) => {
    if (!get().isInWishlist(product.id)) {
      set({
        wishlist: [...get().wishlist, { product, addedAt: new Date() }],
      })
    }
  },
  removeFromWishlist: (productId) => {
    set({
      wishlist: get().wishlist.filter((item) => item.product.id !== productId),
    })
  },
  isInWishlist: (productId) => {
    return get().wishlist.some((item) => item.product.id === productId)
  },

  // Checkout
  shippingAddress: null,
  setShippingAddress: (address) => set({ shippingAddress: address }),

  // Orders
  orders: [],
  setOrders: (orders) => set({ orders }),
  addOrder: (order) => set((state) => ({ orders: [order, ...state.orders] })),
  updateOrderStatus: (orderId, status) =>
    set((state) => ({
      orders: state.orders.map((order) => (order.id === orderId ? { ...order, status } : order)),
    })),
  removeOrder: (orderId) =>
    set((state) => ({
      orders: state.orders.filter((order) => order.id !== orderId),
    })),

  // Addresses
  addresses: [],
  setAddresses: (addresses) => set({ addresses }),
  addAddress: (address) => set((state) => ({ addresses: [...state.addresses, address] })),
  removeAddress: (index) =>
    set((state) => ({
      addresses: state.addresses.filter((_, i) => i !== index),
    })),
}))
