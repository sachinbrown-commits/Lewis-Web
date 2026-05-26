export const navLinks = [
  { label: 'Home', to: '/' },
  { label: 'Furniture', to: '/products' },
  { label: 'Credit', to: '/credit' },
  { label: 'Orders', to: '/orders' },
  { label: 'Profile', to: '/profile' },
]

export const categories = [
  {
    name: 'Furniture',
    description: 'Sofas, dining sets, beds and living room essentials',
    to: '/products',
    tone: 'category-furniture',
  },
  {
    name: 'Appliances',
    description: 'Fridges, washing machines, stoves and more',
    to: '/products',
    tone: 'category-appliances',
  },
  {
    name: 'Electronics',
    description: 'TVs, sound systems, laptops and tablets',
    to: '/products',
    tone: 'category-electronics',
  },
  {
    name: 'Bedding',
    description: 'Mattresses, pillows and bedroom accessories',
    to: '/products',
    tone: 'category-decor',
  },
]

export const products = [
  // FURNITURE
  {
    id: 'luca-modular-sofa',
    category: 'Furniture',
    title: 'Luca 3-Seater Sofa',
    description: 'Generously padded cushioning in durable woven fabric. Ideal for family living rooms.',
    price: 12999,
    oldPrice: 15499,
    tag: 'On Sale',
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'atlas-lounge-chair',
    category: 'Furniture',
    title: 'Atlas Recliner Chair',
    description: 'Full reclining mechanism with padded armrests. Available in brown and charcoal.',
    price: 5499,
    rating: 4.6,
    image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'miren-coffee-table',
    category: 'Furniture',
    title: 'Miren Coffee Table',
    description: 'Solid wood top with lower storage shelf. Matches most living room decor.',
    price: 2999,
    rating: 4.7,
    image: 'https://images.unsplash.com/photo-1567016376408-0226e4d0c1ea?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'celine-bed-frame',
    category: 'Furniture',
    title: 'Celine Queen Bed Frame',
    description: 'Upholstered headboard with sturdy wooden slats. Available in double and queen.',
    price: 8999,
    oldPrice: 10499,
    tag: 'Best Seller',
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'nara-display-cabinet',
    category: 'Furniture',
    title: 'Nara Display Cabinet',
    description: 'Glass-fronted cabinet with adjustable shelves. Perfect for crockery or decor.',
    price: 6999,
    tag: 'New Arrival',
    rating: 4.5,
    image: 'https://images.unsplash.com/photo-1593085512500-5d55148d6f0d?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'marcel-dining-set',
    category: 'Furniture',
    title: 'Marcel 6-Seater Dining Set',
    description: 'Solid wood dining table with 6 matching chairs. Seats the whole family comfortably.',
    price: 11999,
    oldPrice: 13999,
    rating: 4.7,
    image: 'https://images.unsplash.com/photo-1538688525198-9b88f6f53126?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'solvi-tv-unit',
    category: 'Furniture',
    title: 'Solvi TV Wall Unit',
    description: 'Storage-forward TV unit with shelving and cable management. Fits up to 65" TV.',
    price: 4999,
    rating: 4.4,
    image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'oslo-wardrobe',
    category: 'Furniture',
    title: 'Oslo 4-Door Wardrobe',
    description: 'Spacious wardrobe with hanging rail and shelf space. Mirror doors available.',
    price: 9499,
    oldPrice: 11999,
    tag: 'On Sale',
    rating: 4.6,
    image: 'https://images.unsplash.com/photo-1558997519-83ea9252edf8?auto=format&fit=crop&q=80&w=800'
  },

  // APPLIANCES
  {
    id: 'samsung-fridge-double',
    category: 'Appliances',
    title: 'Samsung 580L Double Door Fridge',
    description: 'No Frost technology, bottom freezer, energy-saving LED interior lighting.',
    price: 18999,
    oldPrice: 21999,
    tag: 'Best Seller',
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1584568694244-14fbdf83bd30?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'defy-washing-machine',
    category: 'Appliances',
    title: 'Defy 8kg Front Loader Washing Machine',
    description: '1200RPM spin speed, 15 wash programmes, child safety lock. Energy efficient A rating.',
    price: 8999,
    rating: 4.5,
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'defy-4-plate-stove',
    category: 'Appliances',
    title: 'Defy 4-Plate Electric Stove with Oven',
    description: 'Solid plate hob with full-size oven and grill. Easy-clean enamel interior.',
    price: 6499,
    oldPrice: 7499,
    tag: 'On Sale',
    rating: 4.6,
    image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'samsung-microwave',
    category: 'Appliances',
    title: 'Samsung 28L Microwave Oven',
    description: '900W power, 10 power levels, quick defrost. Sleek stainless steel finish.',
    price: 2499,
    rating: 4.3,
    image: 'https://images.unsplash.com/photo-1585771724684-38269d6639fd?auto=format&fit=crop&q=80&w=800'
  },

  // ELECTRONICS
  {
    id: 'samsung-65-tv',
    category: 'Electronics',
    title: 'Samsung 65" 4K UHD Smart TV',
    description: 'Crystal 4K processor, HDR, built-in Netflix & YouTube. Includes 2x HDMI ports.',
    price: 16999,
    oldPrice: 19999,
    tag: 'New Arrival',
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1593305841991-05c297ba4575?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'hisense-55-tv',
    category: 'Electronics',
    title: 'Hisense 55" Full HD Smart TV',
    description: 'Full HD display with VIDAA smart platform. Access to DStv Now, Netflix and more.',
    price: 9999,
    rating: 4.5,
    image: 'https://images.unsplash.com/photo-1461151304267-38231e58d4b0?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'lg-soundbar',
    category: 'Electronics',
    title: 'LG 2.1ch Soundbar with Subwoofer',
    description: '300W output, Bluetooth 5.0, HDMI ARC. Deep bass with wireless subwoofer.',
    price: 5499,
    oldPrice: 6499,
    rating: 4.6,
    image: 'https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'hp-laptop',
    category: 'Electronics',
    title: 'HP 15.6" Laptop Intel Core i5',
    description: '8GB RAM, 256GB SSD, Windows 11. Built for work, school and entertainment.',
    price: 12999,
    tag: 'Best Seller',
    rating: 4.7,
    image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'samsung-tablet',
    category: 'Electronics',
    title: 'Samsung Galaxy Tab A8 10.5"',
    description: '32GB storage, 8MP camera, 7040mAh battery. Wi-Fi & 4G LTE connectivity.',
    price: 4999,
    rating: 4.4,
    image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&q=80&w=800'
  },

  // BEDDING
  {
    id: 'restonic-mattress',
    category: 'Bedding',
    title: 'Restonic Queen Comfort Mattress',
    description: 'Pocket spring technology for individual support. Medium-firm feel. 10-year warranty.',
    price: 7999,
    oldPrice: 9499,
    tag: 'On Sale',
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1631049552057-403cdb8f0658?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'jersey-bedding-set',
    category: 'Bedding',
    title: 'Jersey Cotton Queen Bedding Set',
    description: 'Fitted sheet, flat sheet and 2 pillowcases. Soft 100% cotton in 6 colour options.',
    price: 899,
    rating: 4.5,
    image: 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&q=80&w=800'
  },
]

export const cartItems = []

export const orderHistory = [
  { id: 'LWS-20419', date: '08 Apr 2026', status: 'Delivered', total: 11799, items: 'Samsung 65" 4K Smart TV, LG Soundbar' },
  { id: 'LWS-20388', date: '01 Apr 2026', status: 'Shipped', total: 24999, items: 'Luca 3-Seater Sofa, Miren Coffee Table' },
  { id: 'LWS-20293', date: '22 Mar 2026', status: 'Processing', total: 7699, items: 'Defy 8kg Front Loader Washing Machine' },
  { id: 'LWS-20144', date: '13 Mar 2026', status: 'Delivered', total: 19999, items: 'Samsung 580L Double Door Fridge' },
]

export const creditSteps = [
  'Personal Info',
  'Employment',
  'Review',
  'Status',
]

export const checkoutSteps = ['Shipping', 'Payment', 'Review']

export const trackingSteps = [
  { label: 'Order Placed', state: 'complete' },
  { label: 'Processing', state: 'active' },
  { label: 'Shipped', state: 'pending' },
  { label: 'Delivered', state: 'pending' },
]

export const profileMenu = [
  'Personal Info',
  'Order History',
  'Payment Methods',
  'Shipping Addresses',
  'Settings',
]

export const formatCurrency = (value) =>
  new Intl.NumberFormat('en-ZA', {
    style: 'currency',
    currency: 'ZAR',
    maximumFractionDigits: 0,
  }).format(value)
