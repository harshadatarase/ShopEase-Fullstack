import { createContext, useContext, useState, ReactNode } from 'react'

interface CartItem {
  id: number
  title: string
  amount: number
  currency: string
  quantity: number
}

interface CartContextType {
  items: CartItem[]
  addItem: (product: any) => void
  removeItem: (id: number) => void
  totalItems: number
  totalPrice: number
  clearCart: () => void
}

const CartContext = createContext<CartContextType | null>(null)

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])

  const addItem = (product: any) => {
    setItems(prev => {
      const existing = prev.find(i => i.id === product.id)
      if (existing) {
        return prev.map(i =>
          i.id === product.id
            ? { ...i, quantity: i.quantity + 1 }
            : i
        )
      }
      return [...prev, {
        id: product.id,
        title: product.title,
        amount: product.price?.amount || product.amount,
        currency: 'INR',
        quantity: 1
      }]
    })
  }

  const removeItem = (id: number) => {
    setItems(prev => prev.filter(i => i.id !== id))
  }

  const clearCart = () => setItems([])

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0)
  const totalPrice = items.reduce((sum, i) => sum + (i.amount * i.quantity), 0)

  return (
    <CartContext.Provider value={{
      items, addItem, removeItem,
      totalItems, totalPrice, clearCart
    }}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be inside CartProvider')
  return ctx
}