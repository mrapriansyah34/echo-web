export function formatRupiah(value: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(value)
}

// Groups a typed phone number the way Indonesian numbers are usually written:
// 0812-3456-7890. A +62 prefix is normalised to 0 so pasted numbers match the
// same shape, and the national part is capped at E.164's 15 digits.
const MAX_PHONE_DIGITS = 15

export function formatPhone(input: string): string {
  let digits = input.replace(/\D/g, '')
  if (digits.startsWith('62')) digits = '0' + digits.slice(2)
  digits = digits.slice(0, MAX_PHONE_DIGITS)
  if (!digits) return ''
  return [digits.slice(0, 4), digits.slice(4, 8), digits.slice(8)].filter(Boolean).join('-')
}

export function discountPercent(price: number, compareAt?: number): number | null {
  if (!compareAt || compareAt <= price) return null
  return Math.round((1 - price / compareAt) * 100)
}

// Retail anchor for the crossed-out price. It follows the same 999 ending as
// the selling price (899.999, 2.199.999, 7.799.999), about 13–20% above it.
export function comparePrice(price: number): number {
  const step = 100_000
  return Math.ceil((price * 1.15) / step) * step - 1
}
