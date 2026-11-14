import { drinks, dry, hampers } from './content'
import type { Copy } from './content'

// English translation of every string in src/content.ts. The `Copy` type keeps
// the two languages structurally identical, so a missing key fails the build.
export const en: Copy = {
  nav: {
    links: [
      { label: 'Collection', href: '#koleksi' },
      { label: 'Story', href: '#cerita' },
      { label: 'Ritual', href: '#ritual' },
      { label: 'Reviews', href: '#testimoni' },
      { label: 'FAQ', href: '#faq' },
    ],
    cta: { label: 'Order via WhatsApp' },
    announcement: 'Ships across Indonesia · Free shipping on orders over Rp 2,000,000',
    cartLabel: 'Cart',
    cartAria: 'Open cart',
    cartRestored: 'Restored',
    menuAria: 'Open menu',
    themeLabel: 'Theme & language',
    backToTop: 'back to top',
  },
  hero: {
    eyebrow: 'Pure edible bird’s nest · Since 2012',
    title: ['A luxury you', 'sip every', 'morning'],
    description:
      'Hand-picked swiftlet nests from caves across the Indonesian archipelago, cold-processed without preservatives. Each 70 ml glass jar holds three and a half grams of pure nest.',
    primary: { label: 'Explore the collection', href: '#koleksi' },
    secondary: { label: 'Talk to us first', href: '#tanya' },
    facts: ['Naturally harvested', 'Vacuum sealed', '3.5 g of pure nest per jar'],
    captions: ["Bottled Bird's Nest · Set of 8", 'Dried nest · 100 g'],
    coldServed: 'Served chilled',
    imageAlt: 'Set of 8 bottles of ECHO Nusantara bird’s nest',
    imageAltSecondary: '100 g of dried nest',
  },
  marquee: [
    "Edible bird's nest from the archipelago",
    'No preservatives',
    'Cold processed',
    'Ships across Indonesia',
    'Halal · BPOM · FSSC 22000',
    'Gift packaging',
  ],
  collection: {
    eyebrow: 'N° 01 — Collection',
    title: 'Eight sets, one standard.',
    description:
      'Every jar holds 3.5 grams of pure edible bird’s nest. Pick the portion that suits you — or start with the smallest.',
    footnote: 'Date & pandan flavours',
    footnoteShapes: 'Cup · Strips · Triangle shapes',
    saveNote: 'Special price',
    askPrice: 'Ask for pricing',
    askAdmin: 'Ask us',
    add: 'Add to bag',
    added: 'Added to bag',
    soldOut: 'Sold out',
    lowBadge: 'Low stock',
    stockLeft: '{n} left of {max}',
    stockLow: 'Low stock — {n} left',
    stockEmpty: 'Sold out — ask about restock',
    askMessage: 'Hello ECHO Nusantara, could you tell me the price of {name} ({set})?',
  },
  story: {
    caption: 'Limestone cave · East Kalimantan',
    sideNote: 'Harvested without disturbing active nests. One nest, one origin card.',
    certified: 'Certified',
    imageAlt: 'A limestone cave in East Kalimantan',
  },
  craft: {
    eyebrow: 'N° 03 — Story',
    title: 'From the archipelago to your table.',
    body: [
      'Bird’s nests form from swiftlet saliva that hardens on the limestone walls of caves across the Indonesian archipelago. We harvest only abandoned nests, then clean them without chemicals.',
      'Every nest is sorted by hand under light, weighed, and cold-processed so its texture stays whole. The result is not a supplement — it is a dish.',
    ],
    specs: [
      { value: '98%', label: 'Purity level' },
      { value: 'AAA', label: 'Nest grade' },
      { value: '0', label: 'Preservatives' },
      { value: '3.5 g', label: 'Nest per jar' },
    ],
    certs: ['FSSC 22000', 'NKV', 'Halal', 'BPOM'],
    note: 'Every purchase comes with a nest-origin card and its harvest date.',
  },
  ritual: {
    eyebrow: 'N° 04 — Ritual',
    title: 'Three steps, every morning.',
    intro:
      'No heating, no added sugar. Bird’s nest already carries its own gentle flavour — your only task is to serve it calmly.',
    stepLabel: 'Step',
    steps: [
      {
        index: 'I',
        title: 'Chill',
        body: 'Leave the jar in the fridge overnight. At 4 °C the nest softens and the date flavour settles.',
      },
      {
        index: 'II',
        title: 'Stir gently',
        body: 'Stir slowly with a clean spoon — never shake it hard. The nest spreads evenly without breaking apart.',
      },
      {
        index: 'III',
        title: 'Savour',
        body: 'Enjoy it straight from the jar, or pour it into a glass bowl and add a single date. Finish it the same day.',
      },
    ],
  },
  benefits: {
    eyebrow: 'N° 05 — Benefits',
    title: '98% pure, ready to cook.',
    description:
      'Sorted by hand, cleaned without chemicals, then packed hygienically. The result is a nest you can cook whenever you like.',
    items: [
      {
        title: '98% pure, ready to cook',
        body: 'Processed to a high hygiene standard, so it is easier to handle and quicker to prepare.',
      },
      {
        title: 'Sorted one by one',
        body: 'Every product is checked for quality before it ships — nothing leaves without inspection.',
      },
      {
        title: 'All natural, nothing added',
        body: 'Moisture control keeps the shape and integrity of the nest intact in transit.',
      },
    ],
    imageAlt: 'Brewed bird’s nest in a glass bowl',
    jarAlt: 'ECHO Nusantara jar with its benefits label',
    funFactAlt: 'A person holding an ECHO Nusantara jar',
    funFact: {
      title: 'Did you know?',
      body: 'Much of the immune system is linked to the gut — so what you eat matters for whole-body health.',
    },
  },
  brew: {
    eyebrow: 'How to prepare — dried nest',
    imageAlt: 'Four steps for brewing dried bird’s nest',
    title: 'Four steps, one bowl.',
    description:
      'Dried nest is prepared at home. No special equipment — a steamer and a glass bowl are enough.',
    steps: [
      {
        index: '1',
        title: 'Soak',
        body: 'Rinse gently, then soak for 2–3 hours until the nest blooms like soft jelly.',
      },
      {
        index: '2',
        title: 'Steam',
        body: 'Steam gently for 15–60 minutes. A little pandan or rock sugar deepens the aroma.',
      },
      {
        index: '3',
        title: 'Savour',
        body: 'Serve warm, or pair it with fruit, herbs and gentle spices.',
      },
      {
        index: '4',
        title: 'Store',
        body: 'Keep it in a clean container, chilled, and finish it within 2–3 days.',
      },
    ],
  },
  testimonials: {
    eyebrow: 'N° 06 — Reviews',
    title: 'From those who have tried it.',
    note: 'Verified reviews from our customers',
    items: [
      {
        quote:
          'I ordered the Set of 8 for my mother’s birthday. The box is beautiful, and the origin card makes the gift feel genuinely thoughtful.',
        name: 'Nadia Prameswari',
        role: 'Jakarta',
      },
      {
        quote:
          'It tastes clean — not at all fishy. The pandan is fragrant without being overly sweet. I’ve been ordering for a year now.',
        name: 'Rendra Halim',
        role: 'Surabaya',
      },
      {
        quote:
          'I ordered over WhatsApp, got a quick reply, and it reached Makassar in two days. I love that I didn’t need an account.',
        name: 'Melati Anjani',
        role: 'Makassar',
      },
    ],
  },
  faq: {
    eyebrow: 'N° 07 — Questions',
    title: 'Things we are often asked.',
    note: 'Still unanswered? Our team replies directly on WhatsApp between 09.00 and 20.00 WIB.',
    items: [
      {
        q: 'How do I place an order?',
        a: 'Choose a variant, add it to the cart, then fill in your name, address and courier. The “Send order to WhatsApp” button opens our official chat with your order details and an invoice number ready to go. Payment is arranged once our team confirms stock.',
      },
      {
        q: 'Which couriers do you use?',
        a: 'JNE, J&T Express, SiCepat, AnterAja, Ninja Xpress and Pos Indonesia for regular delivery. Within Greater Jakarta, GoSend and GrabExpress offer same-day delivery.',
      },
      {
        q: 'Are products shipped cold?',
        a: 'Ready-to-drink products travel in insulated packaging with ice gel. Refrigerate them as soon as they arrive. Dried nest only needs a cool, dry place.',
      },
      {
        q: 'How long does the ready-to-drink nest keep?',
        a: 'Fourteen days in the fridge, with no preservatives. The production date is printed under each jar.',
      },
      {
        q: 'Can it be sent as a gift?',
        a: 'Yes. Add your message in the notes field at checkout — we include a greeting card and hide the price from the recipient.',
      },
      {
        q: 'What if the parcel arrives damaged?',
        a: 'Send photos of the packaging and the jar to our WhatsApp within 24 hours of delivery, and we will replace it at no extra cost.',
      },
    ],
  },
  closing: {
    eyebrow: 'N° 08 — Contact',
    title: 'Not sure where to begin?',
    description:
      'Tell us what you need — for yourself, as a gift, or a corporate order. Our team replies between 09.00 and 20.00 WIB.',
    button: 'Ask us on WhatsApp',
    message: 'Hello ECHO Nusantara, I would like to ask about your edible bird’s nest products.',
    signature: 'Answered by a human, not a bot.',
    hours: 'Mon–Sat · 09.00–20.00 WIB',
  },
  footer: {
    blurb:
      'Pure edible bird’s nest from the Indonesian archipelago. Cold-processed, preservative-free, and shipped from Jakarta to every corner of Indonesia.',
    columns: [
      { title: 'Collection', links: ['Ready to drink', 'Dried nest', 'Hampers', 'Corporate orders'] },
      { title: 'Help', links: ['How to order', 'Shipping', 'Returns', 'Storage'] },
      { title: 'Company', links: ['About us', 'Certification', 'Become a reseller', 'Contact'] },
    ],
    shippingLabel: 'Shipping',
    couriers: ['JNE', 'J&T', 'SiCepat', 'AnterAja', 'Ninja', 'Pos Indonesia', 'GoSend', 'GrabExpress'],
    legal: `© ${new Date().getFullYear()} ECHO Nusantara. Official Partner`,
    disclaimer:
      'This product is food, not medicine. It is not intended to diagnose, treat or prevent any disease.',
  },
  cart: {
    eyebrow: 'Order',
    title: 'Your cart',
    ariaLabel: 'Order cart',
    close: 'Close cart',
    remove: 'Remove',
    clearCart: 'Empty cart',
    clearConfirm: 'Tap again to remove everything',
    clearedToast: 'Cart emptied.',
    itemRemoved: 'Item removed.',
    undo: 'Undo',
    qtyMinus: 'Decrease quantity',
    qtyPlus: 'Increase quantity',
    emptyTitle: 'Your cart is still empty.',
    emptyBody: 'Start with the Set of 3 Triple Luxe, or try the 37.8 g dried nest.',
    emptyCta: 'View the collection',
    shippingTitle: 'Delivery details',
    name: 'Recipient name',
    namePlaceholder: 'Full name',
    phone: 'WhatsApp number',
    countryLabel: 'Country code',
    phonePlaceholder: '0812-3456-7890',
    address: 'Full address',
    addressPlaceholder: 'Street, number, district, city, postal code',
    courier: 'Courier',
    note: 'Note (optional)',
    notePlaceholder: 'Gift message, special instructions…',
    subtotal: 'Subtotal',
    subtotalNote: 'Excludes shipping. Confirmed by our team on WhatsApp.',
    support: 'Our team {phone} · 09.00–20.00 WIB',
    errors: {
      name: 'Enter the recipient’s name (at least 2 characters).',
      phone: 'Enter a WhatsApp number with at least {n} digits.',
      address: 'Enter a full address (at least 10 characters).',
      courier: 'Choose a delivery courier.',
    },
    errorsSummaryOne: '{n} field needs attention:',
    errorsSummary: '{n} fields need attention:',
    submit: 'Send order to WhatsApp',
    successEyebrow: 'Invoice',
    successTitle: 'Your order is ready.',
    successBody:
      'Your order summary is ready and WhatsApp has opened in a new tab. Send the message there so our team can confirm stock and shipping.',
    openWhatsApp: 'Open WhatsApp',
    keepShopping: 'Keep shopping',
    invoiceNote: 'Keep the invoice number to track your parcel.',
    order: {
      heading: 'ECHO NUSANTARA — NEW ORDER',
      invoice: 'Invoice',
      date: 'Date',
      itemsHeading: 'ORDER SUMMARY',
      itemsCount: '{n} items',
      itemsCountOne: '{n} item',
      totalHeading: 'TOTAL',
      deliveryHeading: 'DELIVERY DETAILS',
      variant: 'Variant',
      subtotal: 'Subtotal',
      excludes: 'excl. shipping',
      shippingPending: 'Shipping: to be confirmed by our team',
      name: 'Name',
      phone: 'WhatsApp',
      address: 'Address',
      courier: 'Courier',
      note: 'Note',
      closing: 'Please confirm stock availability and the final total including shipping. Thank you.',
    },
  },
}

export const collectionsEn: typeof import('./content').collections = [
  {
    id: 'siap-minum',
    index: '01',
    title: 'Ready to drink',
    subtitle: '70 ml jar',
    description:
      'Nest already brewed and strained, sealed in a glass jar. Chill it, stir, and enjoy — nothing to prepare.',
    products: drinks,
  },
  {
    id: 'kering',
    index: '02',
    title: 'Dried nest',
    subtitle: 'Grade AAA',
    description:
      'Raw nest cleaned to 98% and sorted one by one. Available in cup, strip and triangle shapes.',
    products: dry,
  },
  {
    id: 'hampers',
    index: '03',
    title: 'Christmas Hampers',
    subtitle: 'Limited edition',
    description:
      'A green box with forest illustration and a gold ribbon. Choose the contents to suit the gift — message us for pricing and a custom greeting card.',
    products: hampers,
  },
]

export type ProductText = {
  name: string
  setLabel: string
  volume: string
  tagline: string
  variants?: Record<string, string>
}

export const productTextEn: Record<string, ProductText> = {
  'triple-luxe': {
    name: 'Triple Luxe Set',
    setLabel: 'Set of 3',
    volume: '3 × 70 ml',
    tagline: 'An introduction — three jars for three mornings.',
    variants: {
      'kurma-3': 'Date 3',
      'pandan-3': 'Pandan 3',
      'pandan2-kurma1': 'Pandan 2 · Date 1',
      'pandan1-kurma2': 'Pandan 1 · Date 2',
    },
  },
  'signature-gold': {
    name: "Bottled Bird's Nest",
    setLabel: 'Set of 8',
    volume: '8 × 70 ml',
    tagline: 'Our most gifted set, packed in a kraft box.',
    variants: { 'pandan4-kurma4': 'Pandan 4 · Date 4', 'kurma-8': 'Date 8', 'pandan-8': 'Pandan 8' },
  },
  'signature-diamond': {
    name: "Bottled Bird's Nest",
    setLabel: 'Set of 16',
    volume: '16 × 70 ml',
    tagline: 'For the whole family and a truly special gift.',
    variants: { 'pandan8-kurma8': 'Pandan 8 · Date 8', 'kurma-16': 'Date 16', 'pandan-16': 'Pandan 16' },
  },
  'sultan-pack': {
    name: "Bottled Bird's Nest",
    setLabel: 'Set of 30',
    volume: '30 × 70 ml',
    tagline: 'A full month. The best price per jar.',
    variants: { 'pandan15-kurma15': 'Pandan 15 · Date 15', 'kurma-30': 'Date 30', 'pandan-30': 'Pandan 30' },
  },
  'dry-37': {
    name: "Dried Bird's Nest 37.8 g",
    setLabel: 'Trial size',
    volume: '37.8 grams',
    tagline: 'The best place to start with dried nest.',
    variants: { cup: 'Cup', strips: 'Strips', triangle: 'Triangle' },
  },
  'dry-100': {
    name: "Dried Bird's Nest 100 g",
    setLabel: 'Monthly portion',
    volume: '100 grams',
    tagline: 'Enough for about twenty brews.',
    variants: { cup: 'Cup', strips: 'Strips', triangle: 'Triangle' },
  },
  'dry-500': {
    name: "Dried Bird's Nest 500 g",
    setLabel: 'Family portion',
    volume: '500 grams',
    tagline: 'Keeps well, brewed whenever you like.',
    variants: { cup: 'Cup', strips: 'Strips', triangle: 'Triangle' },
  },
  'dry-1kg': {
    name: "Dried Bird's Nest 1 kg",
    setLabel: 'Royal Masterpiece',
    volume: '1 kilogram',
    tagline: 'The master collection. For a gift never forgotten.',
    variants: { cup: 'Cup', strips: 'Strips', triangle: 'Triangle' },
  },
  'hamper-aurora': {
    name: 'Aurora',
    setLabel: 'Christmas Hamper',
    volume: '8 jars + 75 g dried nest',
    tagline: 'Pandan & date, 75 g of AAA dried nest, and goji berries.',
  },
  'hamper-reverie': {
    name: 'Reverie',
    setLabel: 'Christmas Hamper',
    volume: '3 jars + 37.8 g dried nest',
    tagline: 'Three pandan & date jars with 37.8 g of AAA dried nest.',
  },
  'hamper-serenity': {
    name: 'Serenity',
    setLabel: 'Christmas Hamper',
    volume: '6 × 70 ml',
    tagline: 'Six pandan & date jars in a Christmas-edition box.',
  },
}
