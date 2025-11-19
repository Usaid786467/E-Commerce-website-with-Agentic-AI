import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { analytics } from '@/lib/analytics'

export interface CartItem {
  id: string
  productId: string
  productVariantId?: string
  name: string
  slug: string
  price: number
  quantity: number
  image?: string
  variant?: {
    id: string
    name: string
  }
  stockQuantity: number
}

interface CartStore {
  items: CartItem[]
  isOpen: boolean

  // Actions
  addItem: (item: Omit<CartItem, 'id'>) => void
  removeItem: (itemId: string) => void
  updateQuantity: (itemId: string, quantity: number) => void
  clearCart: () => void
  toggleCart: () => void
  openCart: () => void
  closeCart: () => void

  // Computed values
  itemsCount: number
  subtotal: number
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,

      addItem: (item) => {
        const items = get().items

        // Check if item already exists (same product and variant)
        const existingItemIndex = items.findIndex(
          (i) =>
            i.productId === item.productId &&
            i.productVariantId === item.productVariantId
        )

        if (existingItemIndex > -1) {
          // Update quantity if item exists
          const existingItem = items[existingItemIndex]
          const newQuantity = existingItem.quantity + item.quantity

          // Check stock availability
          if (newQuantity > item.stockQuantity) {
            console.warn('Insufficient stock')
            return
          }

          const updatedItems = [...items]
          updatedItems[existingItemIndex] = {
            ...existingItem,
            quantity: newQuantity,
          }

          set({ items: updatedItems })
        } else {
          // Add new item
          const newItem: CartItem = {
            id: `${item.productId}-${item.productVariantId || 'default'}-${Date.now()}`,
            ...item,
          }

          set({ items: [...items, newItem] })

          // Track add to cart event
          analytics.trackAddToCart({
            id: item.productId,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
          })
        }

        // Open cart drawer
        set({ isOpen: true })
      },

      removeItem: (itemId) => {
        const item = get().items.find((i) => i.id === itemId)

        if (item) {
          // Track remove from cart event
          analytics.trackRemoveFromCart({
            id: item.productId,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
          })
        }

        set((state) => ({
          items: state.items.filter((item) => item.id !== itemId),
        }))
      },

      updateQuantity: (itemId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(itemId)
          return
        }

        set((state) => ({
          items: state.items.map((item) => {
            if (item.id === itemId) {
              // Check stock availability
              if (quantity > item.stockQuantity) {
                console.warn('Insufficient stock')
                return item
              }
              return { ...item, quantity }
            }
            return item
          }),
        }))
      },

      clearCart: () => {
        set({ items: [] })
      },

      toggleCart: () => {
        set((state) => ({ isOpen: !state.isOpen }))
      },

      openCart: () => {
        set({ isOpen: true })
      },

      closeCart: () => {
        set({ isOpen: false })
      },

      // Computed values
      get itemsCount() {
        return get().items.reduce((total, item) => total + item.quantity, 0)
      },

      get subtotal() {
        return get().items.reduce(
          (total, item) => total + item.price * item.quantity,
          0
        )
      },
    }),
    {
      name: 'cart-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        items: state.items,
      }),
    }
  )
)
