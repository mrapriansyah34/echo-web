import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import type { ReactNode } from 'react'

import { allProducts, brand } from '../content'
import type { Product } from '../content'
import { findCountry } from './countries'
import { formatRupiah } from './format'
import { useLocale } from './i18n'

export type CartLine = {
  key: string
  productId: string
  variantKey: string
  qty: number
}

export type Customer = {
  name: string
  phone: string
  address: string
  courier: string
  note: string
  country: string
}

export type OrderResult = { invoice: string; url: string }

type StoreValue = {
  cart: CartLine[]
  stock: Record<string, number>
  open: boolean
  count: number
  subtotal: number
  restored: boolean
  undoKind: 'clear' | 'remove' | null
  setOpen: (open: boolean) => void
  add: (product: Product, variantKey: string, qty?: number) => void
  setQty: (key: string, qty: number) => void
  remove: (key: string) => void
  clear: () => void
  undo: () => void
  submit: (customer: Customer) => OrderResult
}

const StoreContext = createContext<StoreValue | null>(null)

const initialStock = Object.fromEntries(allProducts.map((p) => [p.id, p.stock]))

const CART_STORAGE_KEY = 'echo-cart'

// Reads a saved cart defensively: unknown products, deleted variants or absurd
// quantities are dropped rather than crashing the first render.
function loadCart(): CartLine[] {
  try {
    const raw = window.localStorage.getItem(CART_STORAGE_KEY)
    if (!raw) return []
    const parsed: unknown = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    return parsed.flatMap((entry) => {
      if (!entry || typeof entry !== 'object') return []
      const line = entry as Partial<CartLine>
      const product = allProducts.find((item) => item.id === line.productId)
      const variant = product?.variants.find((item) => item.key === line.variantKey)
      if (!product || !variant) return []
      const qty = Math.max(0, Math.min(Math.floor(Number(line.qty) || 0), product.stock))
      if (qty === 0) return []
      return [{ key: `${product.id}:${variant.key}`, productId: product.id, variantKey: variant.key, qty }]
    })
  } catch {
    return []
  }
}

export function StoreProvider({ children }: { children: ReactNode }) {
  const { c, locale, product: localize } = useLocale()
  const order = c.cart.order
  const [cart, setCart] = useState<CartLine[]>(loadCart)
  // Only true for the first few seconds of a visit, so the header can say the
  // cart came back from a previous session.
  const [restored, setRestored] = useState(() => cart.length > 0)
  const [undoKind, setUndoKind] = useState<'clear' | 'remove' | null>(null)
  const clearedCart = useRef<CartLine[] | null>(null)
  const removedLine = useRef<{ line: CartLine; index: number } | null>(null)
  const undoTimer = useRef<number | null>(null)

  const resetUndo = useCallback(() => {
    if (undoTimer.current) window.clearTimeout(undoTimer.current)
    setUndoKind(null)
    clearedCart.current = null
    removedLine.current = null
  }, [])

  // Every undoable action opens the same 7-second window, and a new action
  // replaces whatever was pending before it.
  const startUndoWindow = useCallback(() => {
    if (undoTimer.current) window.clearTimeout(undoTimer.current)
    undoTimer.current = window.setTimeout(() => {
      setUndoKind(null)
      clearedCart.current = null
      removedLine.current = null
    }, 7000)
  }, [])

  useEffect(() => {
    if (!restored) return
    const timer = window.setTimeout(() => setRestored(false), 6000)
    return () => window.clearTimeout(timer)
  }, [restored])

  useEffect(
    () => () => {
      if (undoTimer.current) window.clearTimeout(undoTimer.current)
    },
    [],
  )

  useEffect(() => {
    try {
      window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart))
    } catch {
      // Private mode or a full quota: the cart still works for this visit.
    }
  }, [cart])
  const [stock, setStock] = useState<Record<string, number>>(initialStock)
  const [open, setOpen] = useState(false)

  const add = useCallback(
    (product: Product, variantKey: string, qty = 1) => {
      // Adding something new supersedes a pending undo snapshot.
      resetUndo()
      setRestored(false)
      const key = `${product.id}:${variantKey}`
      setCart((lines) => {
        const found = lines.find((line) => line.key === key)
        if (found) {
          return lines.map((line) =>
            line.key === key ? { ...line, qty: Math.min(line.qty + qty, stock[product.id] ?? 0) } : line,
          )
        }
        return [...lines, { key, productId: product.id, variantKey, qty: Math.min(qty, stock[product.id] ?? 0) }]
      })
      setOpen(true)
    },
    [stock, resetUndo],
  )

  const setQty = useCallback(
    (key: string, qty: number) => {
      // Dropping the last unit is a removal too, so it gets the same Undo.
      if (qty <= 0) {
        const index = cart.findIndex((line) => line.key === key)
        if (index === -1) return
        removedLine.current = { line: cart[index], index }
        setCart((lines) => lines.filter((line) => line.key !== key))
        setUndoKind('remove')
        setRestored(false)
        startUndoWindow()
        return
      }
      setCart((lines) =>
        lines.map((line) => {
          if (line.key !== key) return line
          const available = stock[line.productId] ?? 0
          return { ...line, qty: Math.min(qty, available) }
        }),
      )
    },
    [cart, stock, startUndoWindow],
  )

  const remove = useCallback(
    (key: string) => {
      const index = cart.findIndex((line) => line.key === key)
      if (index === -1) return
      removedLine.current = { line: cart[index], index }
      setCart((lines) => lines.filter((line) => line.key !== key))
      setUndoKind('remove')
      setRestored(false)
      startUndoWindow()
    },
    [cart, startUndoWindow],
  )

  // Clearing keeps a snapshot for a few seconds so the toast can offer Undo.
  const clear = useCallback(() => {
    if (cart.length === 0) return
    clearedCart.current = cart
    removedLine.current = null
    setCart([])
    setUndoKind('clear')
    setRestored(false)
    startUndoWindow()
  }, [cart, startUndoWindow])

  const undo = useCallback(() => {
    if (undoKind === 'clear' && clearedCart.current) {
      setCart(clearedCart.current)
    } else if (undoKind === 'remove' && removedLine.current) {
      const { line, index } = removedLine.current
      setCart((lines) => {
        // If the same jar was added again during the window, merge quantities
        // instead of showing a duplicate row.
        if (lines.some((item) => item.key === line.key)) {
          return lines.map((item) =>
            item.key === line.key
              ? { ...item, qty: Math.min(item.qty + line.qty, stock[line.productId] ?? item.qty) }
              : item,
          )
        }
        const next = [...lines]
        next.splice(Math.min(index, next.length), 0, line)
        return next
      })
    }
    resetUndo()
    setOpen(true)
  }, [undoKind, stock, setOpen, resetUndo])

  const subtotal = useMemo(
    () =>
      cart.reduce((total, line) => {
        const product = allProducts.find((p) => p.id === line.productId)
        const variant = product?.variants.find((v) => v.key === line.variantKey)
        return total + (variant?.price ?? product?.price ?? 0) * line.qty
      }, 0),
    [cart],
  )

  const submit = useCallback(
    (customer: Customer): OrderResult => {
      const invoice = `INV-ECHO-${Math.floor(100 + Math.random() * 900)}`
      const itemCount = cart.reduce((sum, line) => sum + line.qty, 0)
      // Fixed to Jakarta time so an admin reading from another timezone sees the
      // same moment the customer placed the order.
      const placedAt =
        new Intl.DateTimeFormat(locale === 'id' ? 'id-ID' : 'en-GB', {
          dateStyle: 'medium',
          timeStyle: 'short',
          timeZone: 'Asia/Jakarta',
        }).format(new Date()) + ' WIB'
      const rows = cart.map((line, index) => {
        const found = allProducts.find((p) => p.id === line.productId)
        const product = found ? localize(found) : undefined
        const variant = product?.variants.find((v) => v.key === line.variantKey)
        const unit = variant?.price ?? product?.price ?? 0
        const total = unit * line.qty
        return [
          `${index + 1}. *${product?.name ?? line.productId}* — ${product?.setLabel ?? ''}`,
          `   ${order.variant}: ${variant?.label ?? line.variantKey}`,
          `   ${line.qty} × ${formatRupiah(unit)} = ${formatRupiah(total)}`,
        ].join('\n')
      })

      const message = [
        `*${order.heading}*`,
        `${order.invoice}: ${invoice}`,
        `${order.date}: ${placedAt}`,
        '',
        `*${order.itemsHeading}*`,
        rows.join('\n\n'),
        '',
        `*${order.totalHeading}*`,
        `${order.subtotal}: ${formatRupiah(subtotal)} (${order.excludes})`,
        order.shippingPending,
        (itemCount === 1 ? order.itemsCountOne : order.itemsCount).replace('{n}', String(itemCount)),
        '',
        `*${order.deliveryHeading}*`,
        `${order.name}: ${customer.name}`,
        `${order.phone}: ${findCountry(customer.country).dial} ${customer.phone.replace(/^0+/, '')}`,
        `${order.address}: ${customer.address}`,
        `${order.courier}: ${customer.courier}`,
        `${order.note}: ${customer.note.trim() || '-'}`,
        '',
        order.closing,
      ].join('\n')

      setStock((current) => {
        const next = { ...current }
        for (const line of cart) {
          next[line.productId] = Math.max(0, (next[line.productId] ?? 0) - line.qty)
        }
        return next
      })
      setCart([])
      resetUndo()
      setRestored(false)

      return {
        invoice,
        url: `https://wa.me/${brand.whatsapp}?text=${encodeURIComponent(message)}`,
      }
    },
    [cart, subtotal, localize, order, locale, resetUndo],
  )

  const count = cart.reduce((total, line) => total + line.qty, 0)

  const value: StoreValue = {
    cart,
    stock,
    open,
    count,
    subtotal,
    restored,
    undoKind,
    setOpen,
    add,
    setQty,
    remove,
    clear,
    undo,
    submit,
  }

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
}

export function useStore() {
  const store = useContext(StoreContext)
  if (!store) throw new Error('useStore must be used inside StoreProvider')
  return store
}
