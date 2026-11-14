import { useEffect, useState } from 'react'
import type { ChangeEvent } from 'react'
import { ArrowUpRight, Check, MessageCircle, Minus, Plus, Trash2, X } from 'lucide-react'

import { allProducts, brand, couriers } from '../content'
import { ProductPlate } from '../components/ProductPlate'
import { countries, defaultCountry } from '../lib/countries'
import { formatPhone, formatRupiah } from '../lib/format'
import { useLocale } from '../lib/i18n'
import { useStore } from '../lib/store'
import type { Customer, OrderResult } from '../lib/store'

const emptyCustomer: Customer = {
  name: '',
  phone: '',
  address: '',
  courier: couriers[0],
  note: '',
  country: defaultCountry.iso,
}

const CUSTOMER_STORAGE_KEY = 'echo-customer'

// Restores the delivery details so a refresh mid-order does not empty the form.
function loadCustomer(): Customer {
  try {
    const raw = window.localStorage.getItem(CUSTOMER_STORAGE_KEY)
    if (!raw) return emptyCustomer
    const parsed: unknown = JSON.parse(raw)
    if (!parsed || typeof parsed !== 'object') return emptyCustomer
    const saved = parsed as Partial<Customer>
    return {
      name: typeof saved.name === 'string' ? saved.name : '',
      phone: typeof saved.phone === 'string' ? saved.phone : '',
      address: typeof saved.address === 'string' ? saved.address : '',
      courier:
        typeof saved.courier === 'string' && couriers.includes(saved.courier)
          ? saved.courier
          : emptyCustomer.courier,
      note: typeof saved.note === 'string' ? saved.note : '',
      country:
        typeof saved.country === 'string' && countries.some((country) => country.iso === saved.country)
          ? saved.country
          : defaultCountry.iso,
    }
  } catch {
    return emptyCustomer
  }
}

const fieldClass =
  'mt-2 w-full border-b border-hair bg-transparent pb-2 text-[16px] text-ink outline-none transition-colors placeholder:text-muted/60 focus:border-gold'
const phoneFieldClass =
  'w-full flex-1 border-b border-hair bg-transparent pb-2 text-[16px] text-ink outline-none transition-colors placeholder:text-muted/60 focus:border-gold'
const labelClass = 'text-[11.5px] uppercase tracking-[0.2em] text-muted'

// Where the caret should sit after a dash is inserted: just after the same
// number of digits the typist had already entered.
function caretAfterDigits(text: string, digitCount: number): number {
  if (digitCount <= 0) return 0
  let seen = 0
  for (let index = 0; index < text.length; index += 1) {
    if (/\d/.test(text[index])) {
      seen += 1
      if (seen === digitCount) return index + 1
    }
  }
  return text.length
}

export function CartDrawer() {
  const { open, setOpen, cart, stock, subtotal, setQty, remove, clear, submit } = useStore()
  const { c, locale, product: localize } = useLocale()
  const t = c.cart
  const [customer, setCustomer] = useState<Customer>(loadCustomer)
  const [result, setResult] = useState<OrderResult | null>(null)
  const [attempted, setAttempted] = useState(false)

  const handlePhoneChange = (event: ChangeEvent<HTMLInputElement>) => {
    const input = event.target
    const digitsBefore = input.value.slice(0, input.selectionStart ?? input.value.length).replace(/\D/g, '').length
    const next = formatPhone(input.value)
    setCustomer({ ...customer, phone: next })
    if (next !== input.value) {
      const caret = caretAfterDigits(next, digitsBefore)
      window.requestAnimationFrame(() => input.setSelectionRange(caret, caret))
    }
  }
  const [touched, setTouched] = useState<Record<string, boolean>>({})
  const [confirmClear, setConfirmClear] = useState(false)

  // A pending "are you sure" should never survive closing the drawer or an
  // already-empty cart.
  useEffect(() => {
    setConfirmClear(false)
  }, [cart.length, open])

  useEffect(() => {
    try {
      window.localStorage.setItem(CUSTOMER_STORAGE_KEY, JSON.stringify(customer))
    } catch {
      // Private mode or a full quota: the form still works for this visit.
    }
  }, [customer])

  useEffect(() => {
    if (!open) return
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false)
    }
    document.addEventListener('keydown', onKey)
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = previous
    }
  }, [open, setOpen])

  const minDigits = customer.country === 'ID' ? 9 : 8
  const errors = {
    name: customer.name.trim().length >= 2 ? null : t.errors.name,
    phone:
      customer.phone.replace(/\D/g, '').length >= minDigits
        ? null
        : t.errors.phone.replace('{n}', String(minDigits)),
    address: customer.address.trim().length >= 10 ? null : t.errors.address,
    courier: customer.courier ? null : t.errors.courier,
  }
  const valid = !errors.name && !errors.phone && !errors.address && !errors.courier
  const fieldKeys = ['name', 'phone', 'address', 'courier'] as const
  const fieldLabels = { name: t.name, phone: t.phone, address: t.address, courier: t.courier }
  const invalidKeys = fieldKeys.filter((key) => errors[key])

  // Errors stay quiet until the field is left or the order is attempted, so the
  // form never shouts at someone who has only just opened it.
  const errorFor = (key: keyof typeof errors) => (attempted || touched[key] ? errors[key] : null)
  const errorProps = (key: keyof typeof errors) =>
    errorFor(key) ? { 'aria-invalid': true, 'aria-describedby': `cart-${key}-error` } : {}
  const markTouched = (key: keyof typeof errors) => () =>
    setTouched((value) => ({ ...value, [key]: true }))

  const handleSubmit = () => {
    if (cart.length === 0) return
    if (!valid) {
      setAttempted(true)
      if (invalidKeys[0]) document.getElementById(`cart-${invalidKeys[0]}`)?.focus()
      return
    }
    const order = submit(customer)
    setResult(order)
    window.open(order.url, '_blank', 'noopener,noreferrer')
  }

  const close = () => {
    setOpen(false)
    setAttempted(false)
    setTouched({})
    if (result) {
      setResult(null)
      setCustomer(emptyCustomer)
    }
  }

  return (
    <div className={open ? 'fixed inset-0 z-50' : 'pointer-events-none fixed inset-0 z-50'} aria-hidden={!open}>
      <div
        onClick={close}
        className={
          'absolute inset-0 bg-ink/45 backdrop-blur-[2px] transition-opacity duration-500 dark:bg-black/60 ' +
          (open ? 'opacity-100' : 'opacity-0')
        }
      />

      <aside
        role="dialog"
        aria-modal="true"
        aria-label={t.ariaLabel}
        className={
          'absolute right-0 top-0 flex h-full w-full max-w-[540px] flex-col bg-paper shadow-[-30px_0_80px_-40px_rgb(25_21_17/0.5)] transition-transform duration-500 ease-out ' +
          (open ? 'translate-x-0' : 'translate-x-full')
        }
      >
        <div className="flex items-center justify-between border-b border-hair px-6 py-5">
          <div>
            <p className="eyebrow">{t.eyebrow}</p>
            <h2 className="mt-1 font-display text-[28px] text-ink">{t.title}</h2>
          </div>
          <button
            type="button"
            onClick={close}
            aria-label={t.close}
            className="grid size-10 place-items-center rounded-full border border-hair text-ink transition-colors hover:border-ink"
          >
            <X className="size-4" strokeWidth={1.4} />
          </button>
        </div>

        {result ? (
          <div className="flex flex-1 flex-col items-start justify-center gap-5 px-8">
            <span className="grid size-12 place-items-center rounded-full border border-gold/40 bg-gold/10 text-gold">
              <Check className="size-5" strokeWidth={1.6} />
            </span>
            <div>
              <p className="eyebrow">
                {t.successEyebrow} {result.invoice}
              </p>
              <h3 className="mt-2 font-display text-[32px] leading-tight text-ink">{t.successTitle}</h3>
              <p className="mt-3 max-w-sm text-[16px] leading-relaxed text-muted">{t.successBody}</p>
            </div>
            <div className="flex w-full flex-col gap-3 sm:flex-row">
              <a
                href={result.url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-ink px-6 text-[12px] uppercase tracking-[0.18em] text-cream"
              >
                <MessageCircle className="size-4" strokeWidth={1.5} /> {t.openWhatsApp}
              </a>
              <button
                type="button"
                onClick={close}
                className="inline-flex h-11 items-center justify-center rounded-full border border-hair-strong px-6 text-[12px] uppercase tracking-[0.18em] text-ink"
              >
                {t.keepShopping}
              </button>
            </div>
            <p className="text-[11.5px] uppercase tracking-[0.16em] text-muted">{t.invoiceNote}</p>
          </div>
        ) : cart.length === 0 ? (
          <div className="flex flex-1 flex-col items-start justify-center gap-4 px-8">
            <h3 className="font-display text-[30px] text-ink">{t.emptyTitle}</h3>
            <p className="max-w-xs text-[16px] leading-relaxed text-muted">{t.emptyBody}</p>
            <button
              type="button"
              onClick={close}
              className="mt-2 inline-flex h-11 items-center gap-2 rounded-full border border-ink bg-ink px-6 text-[12px] uppercase tracking-[0.18em] text-cream"
            >
              {t.emptyCta} <ArrowUpRight className="size-4" strokeWidth={1.5} />
            </button>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto">
              <ul className="divide-y divide-hair px-6">
                {cart.map((line) => {
                  const found = allProducts.find((item) => item.id === line.productId)
                  const product = found ? localize(found) : undefined
                  const variant = product?.variants.find((item) => item.key === line.variantKey)
                  if (!product || !variant) return null
                  const available = stock[product.id] ?? 0
                  const unit = variant.price ?? product.price ?? 0
                  return (
                    <li key={line.key} className="flex gap-4 py-5">
                      <div className="relative size-[76px] shrink-0 overflow-hidden border border-hair bg-cream">
                        <ProductPlate
                          image={variant.image}
                          alt={product.name}
                          kind={product.kind}
                          tone={variant.tone}
                          artCount={1}
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className="font-display text-[19px] leading-tight text-ink">{product.name}</p>
                            <p className="mt-1 text-[11.5px] uppercase tracking-[0.16em] text-muted">
                              {product.setLabel} · {variant.label}
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={() => remove(line.key)}
                            aria-label={`${t.remove} ${product.name}`}
                            className="text-muted transition-colors hover:text-clay"
                          >
                            <Trash2 className="size-3.5" strokeWidth={1.5} />
                          </button>
                        </div>
                        <div className="mt-3 flex items-center justify-between">
                          <div className="inline-flex items-center border border-hair">
                            <button
                              type="button"
                              onClick={() => setQty(line.key, line.qty - 1)}
                              aria-label={t.qtyMinus}
                              className="grid size-8 place-items-center text-ink hover:bg-cream"
                            >
                              <Minus className="size-3" strokeWidth={1.6} />
                            </button>
                            <span className="min-w-7 text-center text-[12px]">{line.qty}</span>
                            <button
                              type="button"
                              onClick={() => setQty(line.key, line.qty + 1)}
                              disabled={line.qty >= available}
                              aria-label={t.qtyPlus}
                              className="grid size-8 place-items-center text-ink hover:bg-cream disabled:opacity-30"
                            >
                              <Plus className="size-3" strokeWidth={1.6} />
                            </button>
                          </div>
                          <p className="text-[15.5px] text-ink">{formatRupiah(unit * line.qty)}</p>
                        </div>
                      </div>
                    </li>
                  )
                })}
              </ul>

              <div className="flex justify-end border-t border-hair px-6 py-3">
                <button
                  type="button"
                  onClick={() => {
                    if (!confirmClear) {
                      setConfirmClear(true)
                      return
                    }
                    clear()
                    setConfirmClear(false)
                  }}
                  aria-label={confirmClear ? t.clearConfirm : t.clearCart}
                  className={
                    'inline-flex items-center gap-1.5 text-[11.5px] uppercase tracking-[0.16em] transition-colors ' +
                    (confirmClear ? 'text-clay' : 'text-muted hover:text-clay')
                  }
                >
                  <Trash2 className="size-3.5" strokeWidth={1.5} />
                  {confirmClear ? t.clearConfirm : t.clearCart}
                </button>
              </div>

              <div className="mx-6 mt-2 border-t border-hair pt-6">
                <p className="eyebrow mb-4">{t.shippingTitle}</p>
                <div className="grid gap-5">
                  <div>
                    <label className={labelClass} htmlFor="cart-name">
                      {t.name}
                    </label>
                    <input
                      id="cart-name"
                      value={customer.name}
                      onChange={(event) => setCustomer({ ...customer, name: event.target.value })}
                      onBlur={markTouched('name')}
                      placeholder={t.namePlaceholder}
                      className={fieldClass + (errorFor('name') ? ' !border-clay' : '')}
                      {...errorProps('name')}
                    />
                    {errorFor('name') && (
                      <p id="cart-name-error" className="mt-1.5 text-[11.5px] text-clay">
                        {errorFor('name')}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className={labelClass} htmlFor="cart-phone">
                      {t.phone}
                    </label>
                    <div className="mt-2 flex items-end gap-2">
                      <select
                        id="cart-country"
                        value={customer.country}
                        onChange={(event) => setCustomer({ ...customer, country: event.target.value })}
                        aria-label={t.countryLabel}
                        className="w-[128px] shrink-0 border-b border-hair bg-transparent pb-2 text-[15px] text-ink outline-none transition-colors focus:border-gold"
                      >
                        {countries.map((country) => (
                          <option key={country.iso} value={country.iso}>
                            {country.dial} · {country.name[locale]}
                          </option>
                        ))}
                      </select>
                      <input
                        id="cart-phone"
                        inputMode="tel"
                        value={customer.phone}
                        onChange={handlePhoneChange}
                        onBlur={markTouched('phone')}
                        placeholder={t.phonePlaceholder}
                        className={phoneFieldClass + (errorFor('phone') ? ' !border-clay' : '')}
                        {...errorProps('phone')}
                      />
                    </div>
                    {errorFor('phone') && (
                      <p id="cart-phone-error" className="mt-1.5 text-[11.5px] text-clay">
                        {errorFor('phone')}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className={labelClass} htmlFor="cart-address">
                      {t.address}
                    </label>
                    <textarea
                      id="cart-address"
                      rows={2}
                      value={customer.address}
                      onChange={(event) => setCustomer({ ...customer, address: event.target.value })}
                      onBlur={markTouched('address')}
                      placeholder={t.addressPlaceholder}
                      className={fieldClass + ' resize-none' + (errorFor('address') ? ' !border-clay' : '')}
                      {...errorProps('address')}
                    />
                    {errorFor('address') && (
                      <p id="cart-address-error" className="mt-1.5 text-[11.5px] text-clay">
                        {errorFor('address')}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className={labelClass} htmlFor="cart-courier">
                      {t.courier}
                    </label>
                    <select
                      id="cart-courier"
                      value={customer.courier}
                      onChange={(event) => setCustomer({ ...customer, courier: event.target.value })}
                      onBlur={markTouched('courier')}
                      className={fieldClass + ' appearance-none' + (errorFor('courier') ? ' !border-clay' : '')}
                      {...errorProps('courier')}
                    >
                      {couriers.map((courier) => (
                        <option key={courier} value={courier}>
                          {courier}
                        </option>
                      ))}
                    </select>
                    {errorFor('courier') && (
                      <p id="cart-courier-error" className="mt-1.5 text-[11.5px] text-clay">
                        {errorFor('courier')}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className={labelClass} htmlFor="cart-note">
                      {t.note}
                    </label>
                    <input
                      id="cart-note"
                      value={customer.note}
                      onChange={(event) => setCustomer({ ...customer, note: event.target.value })}
                      placeholder={t.notePlaceholder}
                      className={fieldClass}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t border-hair bg-cream/60 px-6 py-5">
              <div className="flex items-baseline justify-between">
                <span className="text-[11.5px] uppercase tracking-[0.18em] text-muted">{t.subtotal}</span>
                <span className="font-display text-[26px] text-ink">{formatRupiah(subtotal)}</span>
              </div>
              <p className="mt-1 text-[11.5px] text-muted">{t.subtotalNote}</p>
              {attempted && invalidKeys.length > 0 && (
                <div
                  role="alert"
                  className="mt-4 rounded-md border border-clay/35 bg-clay/5 px-3 py-2 text-[12px] leading-relaxed text-clay"
                >
                  <p>
                    {(invalidKeys.length === 1 ? t.errorsSummaryOne : t.errorsSummary).replace(
                      '{n}',
                      String(invalidKeys.length),
                    )}
                  </p>
                  <div className="mt-1 flex flex-wrap gap-x-3 gap-y-1">
                    {invalidKeys.map((key) => (
                      <button
                        key={key}
                        type="button"
                        onClick={() => document.getElementById(`cart-${key}`)?.focus()}
                        className="underline decoration-clay/50 underline-offset-2 transition-colors hover:text-ink"
                      >
                        {fieldLabels[key]}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              <button
                type="button"
                onClick={handleSubmit}
                className="mt-4 inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-ink text-[12px] uppercase tracking-[0.18em] text-cream transition-colors hover:bg-espresso-soft disabled:pointer-events-none disabled:opacity-35"
              >
                <MessageCircle className="size-4" strokeWidth={1.5} />
                {t.submit}
              </button>
              <p className="mt-3 text-center text-[11.5px] uppercase tracking-[0.16em] text-muted">
                {t.support.replace('{phone}', brand.whatsappDisplay)}
              </p>
            </div>
          </>
        )}
      </aside>
    </div>
  )
}
