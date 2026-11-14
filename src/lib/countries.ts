// Dialling codes offered next to the WhatsApp field. Indonesia is first and is
// the default because every order ships from Jakarta; the rest are here for
// overseas customers and gift senders.
export type Country = {
  iso: string
  dial: string
  name: { id: string; en: string }
}

export const countries: Country[] = [
  { iso: 'ID', dial: '+62', name: { id: 'Indonesia', en: 'Indonesia' } },
  { iso: 'MY', dial: '+60', name: { id: 'Malaysia', en: 'Malaysia' } },
  { iso: 'SG', dial: '+65', name: { id: 'Singapura', en: 'Singapore' } },
  { iso: 'TH', dial: '+66', name: { id: 'Thailand', en: 'Thailand' } },
  { iso: 'PH', dial: '+63', name: { id: 'Filipina', en: 'Philippines' } },
  { iso: 'VN', dial: '+84', name: { id: 'Vietnam', en: 'Vietnam' } },
  { iso: 'BN', dial: '+673', name: { id: 'Brunei', en: 'Brunei' } },
  { iso: 'HK', dial: '+852', name: { id: 'Hong Kong', en: 'Hong Kong' } },
  { iso: 'CN', dial: '+86', name: { id: 'Tiongkok', en: 'China' } },
  { iso: 'JP', dial: '+81', name: { id: 'Jepang', en: 'Japan' } },
  { iso: 'KR', dial: '+82', name: { id: 'Korea Selatan', en: 'South Korea' } },
  { iso: 'IN', dial: '+91', name: { id: 'India', en: 'India' } },
  { iso: 'SA', dial: '+966', name: { id: 'Arab Saudi', en: 'Saudi Arabia' } },
  { iso: 'AE', dial: '+971', name: { id: 'Uni Emirat Arab', en: 'United Arab Emirates' } },
  { iso: 'AU', dial: '+61', name: { id: 'Australia', en: 'Australia' } },
  { iso: 'NZ', dial: '+64', name: { id: 'Selandia Baru', en: 'New Zealand' } },
  { iso: 'NL', dial: '+31', name: { id: 'Belanda', en: 'Netherlands' } },
  { iso: 'DE', dial: '+49', name: { id: 'Jerman', en: 'Germany' } },
  { iso: 'FR', dial: '+33', name: { id: 'Prancis', en: 'France' } },
  { iso: 'GB', dial: '+44', name: { id: 'Inggris', en: 'United Kingdom' } },
  { iso: 'US', dial: '+1', name: { id: 'Amerika Serikat', en: 'United States' } },
]

export const defaultCountry = countries[0]

export function findCountry(iso: string | undefined): Country {
  return countries.find((country) => country.iso === iso) ?? defaultCountry
}

