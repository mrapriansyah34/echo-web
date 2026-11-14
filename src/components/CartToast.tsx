import { AnimatePresence, motion } from 'motion/react'

import { useLocale } from '../lib/i18n'
import { useStore } from '../lib/store'

// Short confirmation after emptying the cart, with a window to take it back.
// It sits outside the drawer so it stays visible even if the drawer is closed.
export function CartToast() {
  const { undoKind, undo } = useStore()
  const { c } = useLocale()

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-6 z-[60] flex justify-center px-4">
      <AnimatePresence>
        {undoKind && (
          <motion.div
            key="cart-toast"
            role="status"
            aria-live="polite"
            initial={{ opacity: 0, y: 16, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.98 }}
            transition={{ duration: 0.26, ease: [0.22, 1, 0.36, 1] }}
            className="pointer-events-auto inline-flex items-center gap-4 rounded-full bg-ink px-5 py-3 text-[12px] tracking-[0.04em] text-cream shadow-[0_20px_40px_-20px_rgb(25_21_17/0.75)]"
          >
            <span>{undoKind === 'clear' ? c.cart.clearedToast : c.cart.itemRemoved}</span>
            <button
              type="button"
              onClick={undo}
              className="text-[11.5px] font-semibold uppercase tracking-[0.16em] text-gold-soft underline decoration-gold-soft/40 underline-offset-2 transition-colors hover:text-cream"
            >
              {c.cart.undo}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
