import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import {
  Badge,
  Button,
  Card,
  OrderSummary,
  ProductCard,
  SidePanel,
  Stepper,
} from '../components/UI'
import {
  checkoutSteps,
  formatCurrency,
  products,
  trackingSteps,
} from '../data/mockData'
import { getCategories, getProducts } from '../lib/api'
import { useShop } from '../context/ShopContext'

/* ─────────────────────────────────────────────
   HOME PAGE
────────────────────────────────────────────── */
export function HomePage() {
  const { showToast, searchQuery } = useShop()
  const [email, setEmail] = useState('')
  const [catalogProducts, setCatalogProducts] = useState(products)
  const [catalogCategories, setCatalogCategories] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    let cancelled = false

    Promise.allSettled([getProducts(), getCategories()]).then(([productsResult, categoriesResult]) => {
      if (cancelled) return

      if (productsResult.status === 'fulfilled' && Array.isArray(productsResult.value) && productsResult.value.length > 0) {
        setCatalogProducts(productsResult.value)
      }

      if (categoriesResult.status === 'fulfilled' && Array.isArray(categoriesResult.value) && categoriesResult.value.length > 0) {
        setCatalogCategories(categoriesResult.value)
      }
    })

    return () => {
      cancelled = true
    }
  }, [])

  const handleSubscribe = (e) => {
    e.preventDefault()
    if (!email || !email.includes('@')) {
      showToast('Please enter a valid email address.')
      return
    }
    showToast('You\'re subscribed! Welcome to the Lewis family.')
    setEmail('')
  }

  const categories = catalogCategories.length > 0 ? catalogCategories : [
    {
      name: 'Furniture',
      description: 'Sofas, dining sets, beds and living room essentials',
      img: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80&w=800',
      filter: 'Furniture',
    },
    {
      name: 'Appliances',
      description: 'Fridges, washing machines, stoves and more',
      img: 'https://images.unsplash.com/photo-1584568694244-14fbdf83bd30?auto=format&fit=crop&q=80&w=800',
      filter: 'Appliances',
    },
    {
      name: 'Electronics',
      description: 'TVs, sound systems, laptops and tablets',
      img: 'https://images.unsplash.com/photo-1593305841991-05c297ba4575?auto=format&fit=crop&q=80&w=800',
      filter: 'Electronics',
    },
    {
      name: 'Bedding',
      description: 'Mattresses, pillows and bedroom accessories',
      img: 'https://images.unsplash.com/photo-1631049552057-403cdb8f0658?auto=format&fit=crop&q=80&w=800',
      filter: 'Bedding',
    },
  ]

  const featured = catalogProducts.filter(p => p.tag === 'Best Seller' || p.tag === 'On Sale').slice(0, 8)

  const searchResults = searchQuery
    ? catalogProducts.filter(p => {
        const q = searchQuery.toLowerCase()
        return p.title.toLowerCase().includes(q) || p.description.toLowerCase().includes(q)
      })
    : []

  if (searchQuery) {
    return (
      <main className="page stack-lg" style={{ maxWidth: '1200px', padding: '2rem 2rem 4rem 2rem' }}>
        <div>
          <h1 style={{ color: 'var(--primary)', marginBottom: '0.4rem' }}>
            Search Results
          </h1>
          <p style={{ color: 'var(--on-surface-variant)' }}>
            {searchResults.length > 0
              ? <>Showing <strong>{searchResults.length}</strong> result{searchResults.length !== 1 ? 's' : ''} for &ldquo;<strong>{searchQuery}</strong>&rdquo;</>
              : <>No products found for &ldquo;<strong>{searchQuery}</strong>&rdquo;</>}
          </p>
        </div>
        {searchResults.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem 2rem', color: 'var(--on-surface-variant)' }}>
            <p style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>No products found.</p>
            <p>Try a different search term.</p>
          </div>
        ) : (
          <div className="product-grid">
            {searchResults.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </main>
    )
  }

  return (
    <main className="page stack-lg" style={{ maxWidth: '100%', padding: '0 0 4rem 0' }}>

      {/* HERO */}
      <section
        className="hero"
        style={{
          background: 'linear-gradient(90deg, rgba(0,31,92,0.92) 0%, rgba(0,31,92,0.55) 60%, rgba(0,31,92,0.2) 100%), url("https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80&w=2000")',
          backgroundSize: 'cover',
          backgroundPosition: 'center 40%',
          margin: '0',
          borderRadius: 0,
          height: '72vh',
          minHeight: '560px',
          display: 'flex',
          alignItems: 'center',
          paddingLeft: '8%',
        }}
      >
        <div className="hero-content">
          <span className="hero-tag">New Season Collection</span>
          <h1 className="hero-title" style={{ color: '#fff', fontSize: 'clamp(2.5rem, 5vw, 4rem)', lineHeight: '1.1', maxWidth: '520px' }}>
            Furnish Your Home.<br />Live Comfortably.
          </h1>
          <p className="hero-text" style={{ color: 'rgba(255,255,255,0.88)', maxWidth: '440px', fontSize: '1.05rem' }}>
            Quality furniture, appliances and electronics — all on affordable monthly instalments. Shop the Lewis way.
          </p>
          <div className="row" style={{ marginTop: '2rem', gap: '1rem' }}>
            <Button to="/products" variant="primary" style={{ background: '#fff', color: 'var(--primary)', fontWeight: 700, padding: '0.9rem 2rem' }}>
              Shop Now
            </Button>
            <Button to="/credit" variant="secondary" style={{ background: 'transparent', color: '#fff', borderColor: 'rgba(255,255,255,0.5)', padding: '0.9rem 2rem' }}>
              Apply for Credit
            </Button>
          </div>
        </div>
      </section>

      {/* TRUST BAR */}
      <section className="home-trust-strip" aria-label="Lewis service highlights">
        <div className="home-trust-grid">
          {[
            {
              text: 'Nationwide Delivery',
              icon: (
                <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                  <path d="M3 7.5h10.5v7.75H3z" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M13.5 10.25h3.25l2.25 2.35v2.65h-5.5z" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  <circle cx="7.25" cy="17.9" r="1.8" fill="none" stroke="currentColor" strokeWidth="1.8" />
                  <circle cx="16.8" cy="17.9" r="1.8" fill="none" stroke="currentColor" strokeWidth="1.8" />
                </svg>
              ),
            },
            {
              text: 'Easy Monthly Instalments',
              icon: (
                <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                  <rect x="3.25" y="5.25" width="17.5" height="13.5" rx="2.5" fill="none" stroke="currentColor" strokeWidth="1.8" />
                  <path d="M3.5 10.3h17" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                  <path d="M7.2 14.25h3.2" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                </svg>
              ),
            },
            {
              text: 'Extended Warranty Available',
              icon: (
                <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                  <path d="M12 3.75l7 2.65v5.95c0 3.35-2.22 6.4-7 8.9-4.78-2.5-7-5.55-7-8.9V6.4z" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
                  <path d="M8.7 12.1l2.1 2.05 4.45-4.4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              ),
            },
            {
              text: 'Free Assembly on Select Items',
              icon: (
                <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                  <path d="M4 8.2l8-4.2 8 4.2-8 4.3z" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
                  <path d="M4 8.2v7.2l8 4.35 8-4.35V8.2" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
                  <path d="M12 12.45v7.3" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                </svg>
              ),
            },
          ].map(item => (
            <article key={item.text} className="trust-item-card">
              <span className="trust-item-icon">{item.icon}</span>
              <span className="trust-item-text">{item.text}</span>
            </article>
          ))}
        </div>
      </section>

      {/* CATEGORIES */}
      <section style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 2rem' }}>
        <div className="space-between" style={{ marginBottom: '1.5rem' }}>
          <div>
            <h2 style={{ fontSize: '1.75rem', marginBottom: '0.25rem', color: 'var(--primary)' }}>Shop by Category</h2>
            <p style={{ color: 'var(--on-surface-variant)', fontSize: '0.9rem' }}>Everything your home needs, all under one roof.</p>
          </div>
          <Button to="/products" variant="text" style={{ color: 'var(--secondary)', display: 'inline-flex', alignItems: 'center', gap: '0.4rem', padding: 0, fontWeight: 600 }}>
            View All &rarr;
          </Button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.25rem' }}>
          {categories.map(cat => (
            <Link
              key={cat.name}
              to={`/products?cat=${cat.filter}`}
              style={{ textDecoration: 'none', color: 'inherit' }}
              onClick={() => {}}
            >
              <div style={{
                backgroundImage: `linear-gradient(to top, rgba(0,31,92,0.88) 0%, rgba(0,31,92,0.2) 60%, transparent 100%), url("${cat.img || 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80&w=800'}")`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                height: '320px',
                borderRadius: '6px',
                padding: '1.5rem',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-end',
                color: '#fff',
                transition: 'transform 0.25s',
              }}
                onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-4px)'}
                onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
              >
                <h3 style={{ fontSize: '1.2rem', marginBottom: '0.35rem', color: '#fff' }}>{cat.name}</h3>
                <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '0.82rem', margin: 0 }}>{cat.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* FEATURED PRODUCTS */}
      <section style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 2rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.9rem', color: 'var(--primary)', marginBottom: '0.5rem' }}>Hot Deals This Week</h2>
          <p style={{ color: 'var(--on-surface-variant)' }}>Our best-priced items — limited time only.</p>
          <div style={{ width: '40px', height: '3px', background: 'var(--secondary)', margin: '1rem auto 0 auto', borderRadius: '2px' }}></div>
        </div>
        <div className="product-grid">
          {featured.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '2.5rem' }}>
          <Button to="/products" variant="secondary" style={{ padding: '0.85rem 2.5rem', fontWeight: 600 }}>
            View All Products
          </Button>
        </div>
      </section>

      {/* CREDIT BANNER */}
      <section style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 2rem' }}>
        <div style={{
          background: 'linear-gradient(135deg, var(--primary) 0%, #0a3580 100%)',
          padding: '3.5rem',
          borderRadius: '6px',
          color: '#fff',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '2rem',
        }}>
          <div style={{ maxWidth: '480px' }}>
            <span style={{ background: 'var(--secondary)', color: '#fff', fontSize: '0.72rem', fontWeight: 700, padding: '0.3rem 0.75rem', borderRadius: '3px', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'inline-block', marginBottom: '1rem' }}>
              Lewis Credit
            </span>
            <h2 style={{ color: '#fff', fontSize: '2rem', marginBottom: '1rem', lineHeight: 1.2 }}>Buy Now, Pay Monthly.</h2>
            <p style={{ color: 'rgba(255,255,255,0.82)', lineHeight: 1.6 }}>
              Get approved quickly for Lewis credit and take home the furniture, appliances and electronics you need — with flexible monthly repayments that suit your budget.
            </p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', minWidth: '280px' }}>
            <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '0.5rem' }}>
              {['Up to R60,000 credit', '6–36 months to pay', 'Quick online approval'].map(f => (
                <div key={f} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'rgba(255,255,255,0.88)', fontSize: '0.85rem' }}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--secondary)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                  {f}
                </div>
              ))}
            </div>
            <Button to="/credit" variant="primary" style={{ background: 'var(--secondary)', width: '100%', padding: '1rem', fontWeight: 700, fontSize: '1rem' }}>
              Apply for Credit Now
            </Button>
            <p style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.55)', textAlign: 'center' }}>
              NCA registered. Subject to affordability assessment.
            </p>
          </div>
        </div>
      </section>

      {/* NEWSLETTER */}
      <section style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 2rem' }}>
        <div style={{ background: 'var(--surface-low)', padding: '3rem', borderRadius: '6px', textAlign: 'center' }}>
          <h2 style={{ color: 'var(--primary)', marginBottom: '0.5rem' }}>Stay in the Loop</h2>
          <p style={{ color: 'var(--on-surface-variant)', marginBottom: '2rem', maxWidth: '480px', margin: '0 auto 2rem auto' }}>
            Get notified about new arrivals, promotions and Lewis specials straight to your inbox.
          </p>
          <form onSubmit={handleSubscribe} style={{ display: 'flex', gap: '1rem', maxWidth: '460px', margin: '0 auto' }}>
            <input
              type="email"
              placeholder="Enter your email address"
              value={email}
              onChange={e => setEmail(e.target.value)}
              style={{ flexGrow: 1 }}
              required
            />
            <Button variant="primary" type="submit" style={{ background: 'var(--secondary)', flexShrink: 0 }}>Subscribe</Button>
          </form>
        </div>
      </section>

    </main>
  )
}

/* ─────────────────────────────────────────────
   PRODUCT LISTING PAGE
────────────────────────────────────────────── */
export function ProductListingPage() {
  const { searchQuery } = useShop()
  const [activeCategory, setActiveCategory] = useState('All')
  const [sortBy, setSortBy] = useState('popular')
  const [catalogProducts, setCatalogProducts] = useState(products)

  useEffect(() => {
    let cancelled = false

    getProducts()
      .then(data => {
        if (!cancelled && Array.isArray(data) && data.length > 0) {
          setCatalogProducts(data)
        }
      })
      .catch(() => {})

    return () => {
      cancelled = true
    }
  }, [])

  const categoryList = ['All', ...new Set(catalogProducts.map(p => p.category).filter(Boolean))]

  let filtered = catalogProducts
  if (activeCategory !== 'All') filtered = filtered.filter(p => p.category === activeCategory)
  if (searchQuery) filtered = filtered.filter(p =>
    p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.description.toLowerCase().includes(searchQuery.toLowerCase())
  )
  if (sortBy === 'price-asc') filtered = [...filtered].sort((a, b) => a.price - b.price)
  if (sortBy === 'price-desc') filtered = [...filtered].sort((a, b) => b.price - a.price)
  if (sortBy === 'popular') filtered = [...filtered].sort((a, b) => (b.rating || 0) - (a.rating || 0))

  return (
    <main className="page sidebar-layout">
      <SidePanel
        title="Categories"
        active={categoryList.indexOf(activeCategory)}
        items={categoryList.map(c => ({ label: c, to: '#' }))}
      />
      <section className="stack-md">
        <div>
          <h1 style={{ color: 'var(--primary)', marginBottom: '0.4rem' }}>All Products</h1>
          <p style={{ color: 'var(--on-surface-variant)', maxWidth: '540px' }}>
            Quality brands on flexible credit — shop furniture, appliances, electronics and more.
          </p>
        </div>

        {/* Category Pills */}
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          {categoryList.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              style={{
                padding: '0.45rem 1.1rem',
                borderRadius: '20px',
                border: `2px solid ${cat === activeCategory ? 'var(--primary)' : 'var(--border-color)'}`,
                background: cat === activeCategory ? 'var(--primary)' : 'transparent',
                color: cat === activeCategory ? '#fff' : 'var(--on-surface-variant)',
                fontSize: '0.9rem',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.15s',
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="space-between" style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>
          <p style={{ fontSize: '0.9rem', color: 'var(--on-surface-variant)' }}>
            Showing <strong style={{ color: 'var(--on-surface)' }}>{filtered.length}</strong> products
            {searchQuery && <> for "<strong>{searchQuery}</strong>"</>}
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <span style={{ fontSize: '0.82rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--on-surface-variant)', fontWeight: 600 }}>Sort</span>
            <select value={sortBy} onChange={e => setSortBy(e.target.value)} style={{ width: 'auto', padding: '0.45rem 2rem 0.45rem 0.75rem' }}>
              <option value="popular">Most Popular</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
            </select>
          </div>
        </div>

        {filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem 2rem', color: 'var(--on-surface-variant)' }}>
            <p style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>No products found.</p>
            <p>Try a different search or category.</p>
          </div>
        ) : (
          <div className="product-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)', gap: '2rem' }}>
            {filtered.map((product, idx) => (
              <ProductCard key={`${product.id}-${idx}`} product={product} />
            ))}
          </div>
        )}
      </section>
    </main>
  )
}

/* ─────────────────────────────────────────────
   PRODUCT DETAIL PAGE
────────────────────────────────────────────── */
export function ProductDetailPage() {
  const { id } = useParams()
  const { addToCart } = useShop()
  const [catalogProducts, setCatalogProducts] = useState(products)
  const product = catalogProducts.find(p => p.id === id) || catalogProducts[0]
  const [selectedVariant, setSelectedVariant] = useState(null)
  const [qty, setQty] = useState(1)

  useEffect(() => {
    let cancelled = false

    getProducts()
      .then(data => {
        if (!cancelled && Array.isArray(data) && data.length > 0) {
          setCatalogProducts(data)
        }
      })
      .catch(() => {})

    return () => {
      cancelled = true
    }
  }, [])

  const relatedProducts = catalogProducts.filter(p => p.category === product.category && p.id !== product.id).slice(0, 3)

  return (
    <main className="page stack-lg" style={{ maxWidth: '1200px' }}>
      <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', fontSize: '0.85rem', color: 'var(--on-surface-variant)', marginBottom: '-1rem' }}>
        <Link to="/" style={{ color: 'var(--on-surface-variant)', textDecoration: 'none' }}>Home</Link>
        <span>/</span>
        <Link to="/products" style={{ color: 'var(--on-surface-variant)', textDecoration: 'none' }}>Products</Link>
        <span>/</span>
        <span style={{ color: 'var(--on-surface)', fontWeight: 500 }}>{product.title}</span>
      </div>

      <div className="split-layout" style={{ gridTemplateColumns: '1.2fr 1fr', gap: '4rem' }}>
        {/* Images */}
        <section className="stack-sm">
          <div style={{
            backgroundImage: `url("${product.image || 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80&w=800'}")`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            aspectRatio: '4/3',
            borderRadius: '6px',
          }}></div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem' }}>
            {[product.image, product.image, product.image].map((img, i) => (
              <div key={i} style={{
                backgroundImage: `url("${img}")`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                aspectRatio: '4/3',
                borderRadius: '4px',
                opacity: i === 0 ? 1 : 0.65,
                cursor: 'pointer',
                border: i === 0 ? '2px solid var(--primary)' : '2px solid transparent',
              }}></div>
            ))}
          </div>
        </section>

        {/* Details */}
        <section className="stack-md" style={{ paddingTop: '0.5rem' }}>
          <div>
            <p style={{ textTransform: 'uppercase', letterSpacing: '0.06em', fontSize: '0.75rem', fontWeight: 700, color: 'var(--secondary)', marginBottom: '0.5rem' }}>
              {product.category}
            </p>
            <h1 style={{ color: 'var(--primary)', fontSize: 'clamp(1.6rem, 3vw, 2.5rem)', marginBottom: '0.75rem' }}>{product.title}</h1>

            {/* Rating */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', gap: '2px' }}>
                {[1,2,3,4,5].map(s => (
                  <svg key={s} xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
                    fill={s <= Math.round(product.rating || 4) ? '#f59e0b' : 'none'}
                    stroke="#f59e0b" strokeWidth="2">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                  </svg>
                ))}
              </div>
              <span style={{ fontSize: '0.88rem', color: 'var(--on-surface-variant)' }}>{product.rating} ({Math.floor(Math.random() * 100) + 20} reviews)</span>
            </div>

            {/* Price */}
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: '1rem', marginBottom: '0.5rem' }}>
              <p style={{ fontSize: '2.2rem', fontWeight: 700, color: 'var(--primary)', lineHeight: 1 }}>{formatCurrency(product.price)}</p>
              {product.oldPrice && (
                <p style={{ fontSize: '1.1rem', textDecoration: 'line-through', color: 'var(--on-surface-variant)', paddingBottom: '0.2rem' }}>{formatCurrency(product.oldPrice)}</p>
              )}
            </div>
            {product.oldPrice && (
              <p style={{ color: 'var(--secondary)', fontWeight: 700, fontSize: '0.9rem', marginBottom: '1.25rem' }}>
                You save {formatCurrency(product.oldPrice - product.price)}!
              </p>
            )}
          </div>

          {/* Description */}
          <div style={{ background: 'var(--surface-low)', padding: '1.25rem', borderRadius: '4px', borderLeft: '3px solid var(--secondary)' }}>
            <p style={{ fontSize: '0.95rem', color: 'var(--on-surface)', lineHeight: 1.7 }}>{product.description}</p>
          </div>

          {/* Quantity */}
          <div>
            <p className="form-label" style={{ marginBottom: '0.5rem' }}>Quantity</p>
            <div style={{ display: 'flex', alignItems: 'center', background: 'var(--surface-low)', borderRadius: '4px', width: 'fit-content' }}>
              <button style={{ border: 'none', background: 'none', padding: '0.6rem 1rem', cursor: 'pointer', fontSize: '1.1rem', fontWeight: 700 }} onClick={() => setQty(q => Math.max(1, q - 1))}>−</button>
              <span style={{ width: '36px', textAlign: 'center', fontWeight: 600 }}>{qty}</span>
              <button style={{ border: 'none', background: 'none', padding: '0.6rem 1rem', cursor: 'pointer', fontSize: '1.1rem', fontWeight: 700 }} onClick={() => setQty(q => q + 1)}>+</button>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="stack-sm" style={{ marginTop: '0.5rem' }}>
            <Button variant="primary" className="btn-block" style={{ padding: '1rem', fontSize: '1rem', fontWeight: 700 }}
              onClick={() => addToCart({ ...product, variant: selectedVariant || 'Standard' }, qty, selectedVariant || 'Standard')}
            >
              Add to Cart — {formatCurrency(product.price * qty)}
            </Button>
            <div className="row" style={{ flexWrap: 'nowrap' }}>
              <Button to="/credit" variant="secondary" className="btn-block" style={{ padding: '0.9rem' }}>
                Buy on Credit
              </Button>
            </div>
          </div>

          {/* Delivery note */}
          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', color: 'var(--on-surface-variant)', fontSize: '0.85rem', marginTop: '0.5rem' }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="3" width="15" height="13"></rect><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon><circle cx="5.5" cy="18.5" r="2.5"></circle><circle cx="18.5" cy="18.5" r="2.5"></circle></svg>
            <span>Nationwide delivery available. Free assembly on selected items.</span>
          </div>
        </section>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section>
          <h2 style={{ color: 'var(--primary)', marginBottom: '1.5rem', fontSize: '1.5rem' }}>You May Also Like</h2>
          <div className="product-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
            {relatedProducts.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        </section>
      )}
    </main>
  )
}

/* ─────────────────────────────────────────────
   CART PAGE
────────────────────────────────────────────── */
export function CartPage() {
  const { cartItems, cartSubtotal, cartTotal, tax, shipping, updateQuantity, removeFromCart, showToast } = useShop()

  return (
    <main className="page" style={{ maxWidth: '1100px' }}>
      <h1 style={{ color: 'var(--primary)', marginBottom: '0.4rem' }}>Shopping Cart</h1>
      <p style={{ color: 'var(--on-surface-variant)', marginBottom: '2.5rem' }}>
        {cartItems.length === 0 ? 'Your cart is empty.' : `You have ${cartItems.length} item${cartItems.length > 1 ? 's' : ''} in your cart.`}
      </p>

      {cartItems.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '4rem 2rem', background: 'var(--surface-low)', borderRadius: '6px' }}>
          <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--on-surface-variant)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: '1.5rem' }}>
            <circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle>
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
          </svg>
          <p style={{ color: 'var(--on-surface-variant)', marginBottom: '1.5rem', fontSize: '1.05rem' }}>Start adding items to your cart</p>
          <Button to="/products" variant="primary" style={{ padding: '0.9rem 2rem' }}>Browse Products</Button>
        </div>
      ) : (
        <div className="split-layout" style={{ gridTemplateColumns: '1fr 340px' }}>
          <section className="cart-list">
            {cartItems.map((item) => (
              <div key={item.id + item.variant} className="card" style={{ display: 'flex', gap: '1.5rem', alignItems: 'flex-start', padding: '1.25rem' }}>
                <div className="cart-item-img" style={{
                  backgroundImage: `url("${item.image || 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80&w=200'}")`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  width: '110px',
                  height: '110px',
                  flexShrink: 0,
                  borderRadius: '4px',
                }}></div>
                <div style={{ flexGrow: 1, minWidth: 0 }}>
                  <p style={{ fontSize: '0.75rem', color: 'var(--on-surface-variant)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600, marginBottom: '0.25rem' }}>{item.category}</p>
                  <h3 style={{ fontSize: '1rem', marginBottom: '0.25rem', color: 'var(--primary)', fontWeight: 600 }}>{item.title}</h3>
                  <p style={{ fontSize: '0.85rem', color: 'var(--on-surface-variant)', marginBottom: '1rem' }}>{item.variant}</p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                    <div style={{ display: 'flex', alignItems: 'center', background: 'var(--surface-low)', borderRadius: '4px' }}>
                      <button style={{ border: 'none', background: 'none', padding: '0.4rem 0.75rem', cursor: 'pointer', fontWeight: 700 }} onClick={() => updateQuantity(item.id, item.variant, -1)}>−</button>
                      <span style={{ fontSize: '0.9rem', fontWeight: 600, minWidth: '24px', textAlign: 'center' }}>{item.quantity}</span>
                      <button style={{ border: 'none', background: 'none', padding: '0.4rem 0.75rem', cursor: 'pointer', fontWeight: 700 }} onClick={() => updateQuantity(item.id, item.variant, 1)}>+</button>
                    </div>
                    <button
                      style={{ border: 'none', background: 'none', color: 'var(--secondary)', fontSize: '0.82rem', cursor: 'pointer', fontWeight: 600, padding: 0, display: 'flex', alignItems: 'center', gap: '0.3rem' }}
                      onClick={() => removeFromCart(item.id, item.variant)}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                      Remove
                    </button>
                  </div>
                </div>
                <strong style={{ fontSize: '1.15rem', color: 'var(--primary)', fontWeight: 700, whiteSpace: 'nowrap', flexShrink: 0 }}>
                  {formatCurrency(item.price * item.quantity)}
                </strong>
              </div>
            ))}

            {/* Promo code */}
            <div className="card" style={{ padding: '1.25rem' }}>
              <h4 style={{ fontSize: '0.9rem', marginBottom: '0.75rem', fontWeight: 600 }}>Have a Promo Code?</h4>
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <input type="text" placeholder="Enter code" style={{ flexGrow: 1 }} />
                <Button variant="secondary" onClick={() => showToast('Invalid promo code. Please try again.')}>Apply</Button>
              </div>
            </div>
          </section>

          <aside>
            <OrderSummary
              title="Order Summary"
              rows={[
                { label: 'Subtotal', value: cartSubtotal },
                { label: 'Delivery', value: shipping },
                { label: 'VAT (15%)', value: tax },
              ]}
              total={cartTotal}
              cta={
                <Button variant="primary" className="btn-block" to="/checkout" style={{ padding: '1rem', fontWeight: 700 }}>
                  Proceed to Checkout →
                </Button>
              }
            />
            <div style={{ marginTop: '1rem' }}>
              <Button to="/products" variant="text" style={{ color: 'var(--on-surface-variant)', fontSize: '0.88rem', padding: '0.5rem 0' }}>
                ← Continue Shopping
              </Button>
            </div>
          </aside>
        </div>
      )}
    </main>
  )
}

/* ─────────────────────────────────────────────
   CHECKOUT PAGE
────────────────────────────────────────────── */
export function CheckoutPage() {
  const {
    cartSubtotal,
    cartTotal,
    tax,
    shipping,
    clearCart,
    showToast,
    cartItems,
    isAuthenticated,
    currentUser,
    loginUser,
    registerUser,
    placeOrder,
    paymentMethods,
    loadPaymentMethods,
    savePaymentMethod,
  } = useShop()
  const navigate = useNavigate()
  const [form, setForm] = useState({ fullName: '', phone: '', address: '', city: '', postal: '', cardNumber: '', expiry: '', cvv: '' })
  const [errors, setErrors] = useState({})
  const [step, setStep] = useState(0)
  const [authMode, setAuthMode] = useState('login')
  const [authForm, setAuthForm] = useState({ fullName: '', email: '', password: '' })

  useEffect(() => {
    if (isAuthenticated && currentUser) {
      setForm(prev => ({
        ...prev,
        fullName: currentUser.fullName || prev.fullName,
        phone: currentUser.phone || prev.phone,
        address: currentUser.address || prev.address,
      }))
      loadPaymentMethods().catch(() => {})
    }
  }, [isAuthenticated, currentUser])

  const validate = () => {
    const e = {}
    if (!form.fullName.trim()) e.fullName = 'Full name is required'
    if (!form.phone.trim()) e.phone = 'Phone number is required'
    if (!form.address.trim()) e.address = 'Address is required'
    if (!form.city.trim()) e.city = 'City is required'
    if (!form.postal.trim()) e.postal = 'Postal code is required'
    return e
  }

  const handleNext = async (e) => {
    e.preventDefault()
    if (step === 0) {
      const e = validate()
      setErrors(e)
      if (Object.keys(e).length === 0) setStep(1)
    } else {
      if (isAuthenticated) {
        const items = cartItems.map(i => `${i.title} x${i.quantity}`).join(' + ')
        await placeOrder({ total: cartTotal, items })
      }

      if (isAuthenticated && form.cardNumber.trim().length >= 12) {
        await savePaymentMethod({
          cardholderName: form.fullName,
          cardNumber: form.cardNumber,
          brand: 'Card',
          expiry: form.expiry,
          isDefault: paymentMethods.length === 0,
        })
      }

      clearCart()
      showToast('Order placed successfully! Check your email for confirmation.')
      navigate('/orders')
    }
  }

  const handleAuth = async (e) => {
    e.preventDefault()
    try {
      if (authMode === 'login') {
        await loginUser(authForm.email, authForm.password)
      } else {
        await registerUser({
          fullName: authForm.fullName,
          email: authForm.email,
          password: authForm.password,
          phone: form.phone,
          address: form.address,
        })
      }
    } catch (err) {
      showToast('Authentication failed. Please check your details.')
    }
  }

  const field = (name, label, type = 'text', placeholder = '') => (
    <div className="form-group">
      <label className="form-label">{label}</label>
      <input
        type={type}
        placeholder={placeholder}
        value={form[name]}
        onChange={e => { setForm(f => ({ ...f, [name]: e.target.value })); setErrors(er => ({ ...er, [name]: undefined })) }}
        style={{ borderColor: errors[name] ? 'var(--secondary)' : 'transparent' }}
      />
      {errors[name] && <p style={{ color: 'var(--secondary)', fontSize: '0.78rem', marginTop: '0.2rem' }}>{errors[name]}</p>}
    </div>
  )

  return (
    <main className="page" style={{ maxWidth: '1100px' }}>
      <Stepper steps={checkoutSteps} current={step} />
      <div className="split-layout" style={{ gridTemplateColumns: '1fr 340px' }}>
        <section className="stack-md">
          {!isAuthenticated && (
            <Card>
              <h3 style={{ color: 'var(--primary)', marginBottom: '0.75rem' }}>Log In or Create Account</h3>
              <p style={{ color: 'var(--on-surface-variant)', marginBottom: '1rem', fontSize: '0.9rem' }}>
                Continue as guest or sign in to store orders, payment methods, and profile details.
              </p>
              <form className="form-grid" onSubmit={handleAuth}>
                {authMode === 'register' && (
                  <div className="form-group full-width">
                    <label className="form-label">Full Name</label>
                    <input type="text" value={authForm.fullName} onChange={e => setAuthForm(f => ({ ...f, fullName: e.target.value }))} required />
                  </div>
                )}
                <div className="form-group">
                  <label className="form-label">Email</label>
                  <input type="email" value={authForm.email} onChange={e => setAuthForm(f => ({ ...f, email: e.target.value }))} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Password</label>
                  <input type="password" value={authForm.password} onChange={e => setAuthForm(f => ({ ...f, password: e.target.value }))} required />
                </div>
                <div className="full-width" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <button
                    type="button"
                    onClick={() => setAuthMode(m => (m === 'login' ? 'register' : 'login'))}
                    style={{ border: 'none', background: 'none', color: 'var(--primary)', cursor: 'pointer', padding: 0, fontWeight: 600 }}
                  >
                    {authMode === 'login' ? 'Need an account? Create one' : 'Already have an account? Log in'}
                  </button>
                  <Button type="submit" variant="secondary">{authMode === 'login' ? 'Log In' : 'Create Account'}</Button>
                </div>
              </form>
            </Card>
          )}

          {step === 0 && (
            <Card>
              <h2 style={{ fontSize: '1.4rem', color: 'var(--primary)', marginBottom: '1.5rem' }}>Delivery Information</h2>
              <form className="form-grid" onSubmit={handleNext}>
                {field('fullName', 'Full Name', 'text', 'e.g. Thabo Nkosi')}
                {field('phone', 'Phone Number', 'tel', '+27 82 000 0000')}
                <div className="form-group full-width">
                  <label className="form-label">Street Address</label>
                  <input type="text" placeholder="e.g. 12 Mandela Street, Sandton" value={form.address}
                    onChange={e => { setForm(f => ({ ...f, address: e.target.value })); setErrors(er => ({ ...er, address: undefined })) }}
                    style={{ borderColor: errors.address ? 'var(--secondary)' : 'transparent' }} />
                  {errors.address && <p style={{ color: 'var(--secondary)', fontSize: '0.78rem' }}>{errors.address}</p>}
                </div>
                {field('city', 'City', 'text', 'e.g. Johannesburg')}
                {field('postal', 'Postal Code', 'text', 'e.g. 2196')}
                <div className="full-width" style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
                  <Button variant="primary" type="submit" style={{ padding: '0.9rem 2rem', fontWeight: 700 }}>Continue to Payment →</Button>
                </div>
              </form>
            </Card>
          )}

          {step === 1 && (
            <Card>
              <h2 style={{ fontSize: '1.4rem', color: 'var(--primary)', marginBottom: '0.5rem' }}>Payment Details</h2>
              <p style={{ color: 'var(--on-surface-variant)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>Your card details are encrypted and secure.</p>

              {isAuthenticated && paymentMethods.length > 0 && (
                <div style={{ marginBottom: '1rem', padding: '0.8rem 1rem', background: 'var(--surface-low)', borderRadius: '4px' }}>
                  <p style={{ fontSize: '0.8rem', textTransform: 'uppercase', color: 'var(--on-surface-variant)', marginBottom: '0.5rem', fontWeight: 700 }}>
                    Saved payment methods
                  </p>
                  {paymentMethods.map(method => (
                    <div key={method.id} style={{ fontSize: '0.9rem', color: 'var(--on-surface)' }}>
                      {method.brand} ending in {method.last4} ({method.expiry})
                    </div>
                  ))}
                </div>
              )}

              <div className="form-grid">
                <div className="form-group full-width">
                  <label className="form-label">Card Number</label>
                  <input type="text" placeholder="0000 0000 0000 0000" maxLength={19}
                    value={form.cardNumber}
                    onChange={e => setForm(f => ({ ...f, cardNumber: e.target.value.replace(/\D/g, '').replace(/(\d{4})/g, '$1 ').trim() }))}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Expiry Date</label>
                  <input type="text" placeholder="MM / YY" maxLength={7} value={form.expiry}
                    onChange={e => setForm(f => ({ ...f, expiry: e.target.value }))} />
                </div>
                <div className="form-group">
                  <label className="form-label">CVV</label>
                  <input type="text" placeholder="000" maxLength={4} value={form.cvv}
                    onChange={e => setForm(f => ({ ...f, cvv: e.target.value }))} />
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1.5rem' }}>
                <Button variant="text" style={{ color: 'var(--on-surface-variant)' }} onClick={() => setStep(0)}>← Back</Button>
                <Button variant="primary" style={{ padding: '0.9rem 2rem', fontWeight: 700 }} onClick={handleNext}>Place Order</Button>
              </div>
            </Card>
          )}
        </section>

        <aside>
          <OrderSummary
            title="Your Order"
            rows={[
              { label: 'Subtotal', value: cartSubtotal },
              { label: 'Delivery', value: shipping },
              { label: 'VAT (15%)', value: tax },
            ]}
            total={cartTotal}
          />
          <div style={{ marginTop: '1.25rem' }}>
            {cartItems.map(item => (
              <div key={item.id + item.variant} style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', marginBottom: '0.75rem', fontSize: '0.88rem' }}>
                <div style={{ width: '42px', height: '42px', backgroundImage: `url("${item.image}")`, backgroundSize: 'cover', backgroundPosition: 'center', borderRadius: '4px', flexShrink: 0 }}></div>
                <div style={{ flexGrow: 1, minWidth: 0 }}>
                  <p style={{ color: 'var(--on-surface)', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.title}</p>
                  <p style={{ color: 'var(--on-surface-variant)' }}>Qty: {item.quantity}</p>
                </div>
                <span style={{ fontWeight: 600, color: 'var(--primary)', flexShrink: 0 }}>{formatCurrency(item.price * item.quantity)}</span>
              </div>
            ))}
          </div>
        </aside>
      </div>
    </main>
  )
}

/* Shared profile navigation items */
const profileNavItems = [
  { label: 'Personal Info', to: '/profile' },
  { label: 'Order History', to: '/orders' },
  { label: 'Payment Methods', to: '/profile/payment' },
  { label: 'Shipping Addresses', to: '/profile/addresses' },
  { label: 'Settings', to: '/profile/settings' },
  { label: 'QA Lab', to: '/qa-lab' },
  { label: 'Training Missions', to: '/training-missions' },
]

/* ─────────────────────────────────────────────
   PROFILE PAGE
────────────────────────────────────────────── */
export function ProfilePage() {
  const {
    showToast,
    currentUser,
    isAuthenticated,
    updateProfile,
    logoutUser,
    paymentMethods,
    loadPaymentMethods,
    savePaymentMethod,
    deletePaymentMethod,
  } = useShop()
  const [form, setForm] = useState({ fullName: '', phone: '', email: '', address: '' })
  const [paymentForm, setPaymentForm] = useState({ cardholderName: '', cardNumber: '', expiry: '' })

  useEffect(() => {
    if (isAuthenticated && currentUser) {
      setForm({
        fullName: currentUser.fullName || '',
        phone: currentUser.phone || '',
        email: currentUser.email || '',
        address: currentUser.address || '',
      })
      loadPaymentMethods().catch(() => {})
    }
  }, [isAuthenticated, currentUser])

  const handleSave = async (e) => {
    e.preventDefault()
    await updateProfile({
      fullName: form.fullName,
      phone: form.phone,
      address: form.address,
    })
  }

  const handleAddPayment = async (e) => {
    e.preventDefault()
    await savePaymentMethod({
      cardholderName: paymentForm.cardholderName,
      cardNumber: paymentForm.cardNumber,
      expiry: paymentForm.expiry,
      brand: 'Card',
      isDefault: paymentMethods.length === 0,
    })
    setPaymentForm({ cardholderName: '', cardNumber: '', expiry: '' })
  }

  if (!isAuthenticated) {
    return (
      <main className="page" style={{ maxWidth: '780px' }}>
        <Card style={{ textAlign: 'center', padding: '2.5rem' }}>
          <h1 style={{ color: 'var(--primary)', marginBottom: '0.75rem' }}>Sign in to your account</h1>
          <p style={{ color: 'var(--on-surface-variant)', marginBottom: '1.5rem' }}>
            Login or create an account to manage profile details, payment methods, and orders.
          </p>
          <Button to="/auth" variant="primary" style={{ padding: '0.9rem 2rem' }}>Go to Login / Register</Button>
        </Card>
      </main>
    )
  }

  return (
    <main className="page sidebar-layout">
      <SidePanel active={0} items={profileNavItems} />
      <section className="stack-md">
        <div>
          <h1 style={{ color: 'var(--primary)', marginBottom: '0.4rem' }}>My Account</h1>
          <p style={{ color: 'var(--on-surface-variant)' }}>Manage your personal details and preferences.</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) minmax(0,2fr)', gap: '2rem', alignItems: 'start' }}>
          <Card style={{ textAlign: 'center', padding: '2.5rem 1.5rem' }}>
            <div style={{ width: '90px', height: '90px', background: 'var(--primary)', borderRadius: '50%', margin: '0 auto 1.25rem auto', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle>
              </svg>
            </div>
            <h3 style={{ fontSize: '1.15rem', marginBottom: '0.25rem', color: 'var(--primary)' }}>{form.fullName}</h3>
            <p style={{ color: 'var(--on-surface-variant)', fontSize: '0.85rem' }}>{currentUser?.role || 'Customer'}</p>
            <div style={{ marginTop: '1.5rem', padding: '1rem', background: 'var(--surface-low)', borderRadius: '4px' }}>
              <p style={{ fontSize: '0.78rem', color: 'var(--on-surface-variant)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600, marginBottom: '0.25rem' }}>Member Since</p>
              <p style={{ color: 'var(--primary)', fontWeight: 600 }}>January 2024</p>
            </div>
            <Button variant="secondary" style={{ marginTop: '1rem' }} onClick={logoutUser}>Log Out</Button>
          </Card>

          <div className="stack-md">
          <Card>
            <h3 style={{ color: 'var(--primary)', marginBottom: '1.5rem' }}>Personal Information</h3>
            <form className="form-grid" onSubmit={handleSave}>
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input type="text" value={form.fullName} onChange={e => setForm(f => ({ ...f, fullName: e.target.value }))} />
              </div>
              <div className="form-group">
                <label className="form-label">Phone Number</label>
                <input type="tel" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} />
              </div>
              <div className="form-group full-width">
                <label className="form-label">Email Address</label>
                <input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
              </div>
              <div className="form-group full-width">
                <label className="form-label">Delivery Address</label>
                <textarea rows="3" value={form.address} onChange={e => setForm(f => ({ ...f, address: e.target.value }))}
                  style={{ width: '100%', padding: '0.8rem 1rem', background: 'var(--surface-low)', border: '1px solid transparent', borderRadius: '4px', fontSize: '0.95rem', color: 'var(--on-surface)', resize: 'vertical' }} />
              </div>
              <div className="full-width" style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                <Button variant="secondary" type="button">Cancel</Button>
                <Button variant="primary" type="submit" style={{ background: 'var(--primary)' }}>Save Changes</Button>
              </div>
            </form>
          </Card>

          <Card>
            <h3 style={{ color: 'var(--primary)', marginBottom: '1rem' }}>Saved Payment Methods</h3>
            {paymentMethods.length === 0 && (
              <p style={{ color: 'var(--on-surface-variant)', marginBottom: '1rem' }}>No saved payment methods yet.</p>
            )}
            {paymentMethods.map(pm => (
              <div key={pm.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.65rem 0', borderBottom: '1px solid var(--border-color)' }}>
                <div>
                  <strong style={{ color: 'var(--on-surface)' }}>{pm.brand} ending in {pm.last4}</strong>
                  <p style={{ fontSize: '0.82rem', color: 'var(--on-surface-variant)' }}>{pm.cardholderName} • Expires {pm.expiry}</p>
                </div>
                <Button variant="text" onClick={() => deletePaymentMethod(pm.id)} style={{ color: 'var(--secondary)' }}>Remove</Button>
              </div>
            ))}

            <form className="form-grid" style={{ marginTop: '1rem' }} onSubmit={handleAddPayment}>
              <div className="form-group">
                <label className="form-label">Cardholder Name</label>
                <input type="text" value={paymentForm.cardholderName} onChange={e => setPaymentForm(f => ({ ...f, cardholderName: e.target.value }))} required />
              </div>
              <div className="form-group">
                <label className="form-label">Card Number</label>
                <input type="text" value={paymentForm.cardNumber} onChange={e => setPaymentForm(f => ({ ...f, cardNumber: e.target.value }))} required />
              </div>
              <div className="form-group">
                <label className="form-label">Expiry</label>
                <input type="text" placeholder="MM/YY" value={paymentForm.expiry} onChange={e => setPaymentForm(f => ({ ...f, expiry: e.target.value }))} required />
              </div>
              <div className="full-width" style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Button type="submit" variant="secondary">Add Payment Method</Button>
              </div>
            </form>
          </Card>
          </div>
        </div>
      </section>
    </main>
  )
}

/* ─────────────────────────────────────────────
   ORDER HISTORY PAGE
────────────────────────────────────────────── */
export function OrderHistoryPage() {
  const { showToast, isAuthenticated, orders, loadOrders } = useShop()

  useEffect(() => {
    if (isAuthenticated) {
      loadOrders().catch(() => {})
    }
  }, [isAuthenticated])

  if (!isAuthenticated) {
    return (
      <main className="page" style={{ maxWidth: '780px' }}>
        <Card style={{ textAlign: 'center', padding: '2.5rem' }}>
          <h1 style={{ color: 'var(--primary)', marginBottom: '0.75rem' }}>Sign in to view your orders</h1>
          <p style={{ color: 'var(--on-surface-variant)', marginBottom: '1.5rem' }}>
            Your order history is tied to your account.
          </p>
          <Button to="/auth" variant="primary" style={{ padding: '0.9rem 2rem' }}>Go to Login / Register</Button>
        </Card>
      </main>
    )
  }

  const deliveredCount = orders.filter(o => o.status === 'Delivered').length
  const activeCount = orders.filter(o => o.status !== 'Delivered').length
  const latestOrder = orders[0]

  return (
    <main className="page sidebar-layout">
      <SidePanel active={1} items={profileNavItems} />
      <section className="stack-md">
        <div>
          <h1 style={{ color: 'var(--primary)', marginBottom: '0.4rem' }}>Order History</h1>
          <p style={{ color: 'var(--on-surface-variant)' }}>Track and manage all your Lewis purchases.</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.25rem' }}>
          <Card>
            <p className="form-label" style={{ marginBottom: '0.75rem' }}>Total Orders</p>
            <span style={{ fontSize: '2.2rem', fontWeight: 700, color: 'var(--primary)' }}>{orders.length}</span>
            <p style={{ color: 'var(--secondary)', fontSize: '0.82rem', fontWeight: 600, marginTop: '0.25rem' }}>{deliveredCount} delivered</p>
          </Card>
          <Card>
            <p className="form-label" style={{ marginBottom: '0.75rem' }}>Active Deliveries</p>
            <span style={{ fontSize: '2.2rem', fontWeight: 700, color: 'var(--primary)' }}>{activeCount}</span>
          </Card>
          <Card>
            <p className="form-label" style={{ marginBottom: '0.75rem' }}>Latest Order</p>
            <p style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--primary)', marginBottom: '0.25rem' }}>{latestOrder?.items || 'No orders yet'}</p>
            <p style={{ fontSize: '0.82rem', color: 'var(--on-surface-variant)' }}>{latestOrder?.date || ''}</p>
          </Card>
        </div>

        <Card style={{ padding: 0, overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead style={{ background: 'var(--surface-low)' }}>
              <tr>
                {['Order ID', 'Date', 'Items', 'Status', 'Total', ''].map(h => (
                  <th key={h} style={{ padding: '1rem 1.25rem', fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--on-surface-variant)', fontWeight: 700 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {orders.map((order, i) => (
                <tr key={order.id} style={{ borderTop: i > 0 ? '1px solid var(--border-color)' : 'none' }}>
                  <td style={{ padding: '1.1rem 1.25rem', fontWeight: 700, color: 'var(--primary)' }}>#{order.id}</td>
                  <td style={{ padding: '1.1rem 1.25rem', color: 'var(--on-surface-variant)', fontSize: '0.9rem' }}>{order.date}</td>
                  <td style={{ padding: '1.1rem 1.25rem', color: 'var(--on-surface)', fontSize: '0.88rem', maxWidth: '200px' }}>
                    <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', display: 'block' }}>{order.items}</span>
                  </td>
                  <td style={{ padding: '1.1rem 1.25rem' }}>
                    <Badge tone={order.status === 'Delivered' ? 'success' : order.status === 'Shipped' ? 'info' : 'warning'}>
                      {order.status}
                    </Badge>
                  </td>
                  <td style={{ padding: '1.1rem 1.25rem', fontWeight: 700, color: 'var(--primary)' }}>{formatCurrency(order.total)}</td>
                  <td style={{ padding: '1.1rem 1.25rem', textAlign: 'right' }}>
                    <Button variant="secondary" style={{ padding: '0.35rem 0.85rem', fontSize: '0.82rem' }}
                      onClick={() => showToast(`Loading details for order #${order.id}...`)}>
                      View
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      </section>
    </main>
  )
}

export function OrderTrackingPage() {
  const { isAuthenticated, orders, deliveries, loadOrders, loadDeliveries } = useShop()

  useEffect(() => {
    if (!isAuthenticated) {
      return
    }

    Promise.all([loadOrders(), loadDeliveries()]).catch(() => {})
  }, [isAuthenticated])

  if (!isAuthenticated) {
    return (
      <main className="page" style={{ maxWidth: '780px' }}>
        <Card style={{ textAlign: 'center', padding: '2.5rem' }}>
          <h1 style={{ color: 'var(--primary)', marginBottom: '0.75rem' }}>Sign in to track deliveries</h1>
          <p style={{ color: 'var(--on-surface-variant)', marginBottom: '1.5rem' }}>
            Delivery status is tied to your account.
          </p>
          <Button to="/auth" variant="primary" style={{ padding: '0.9rem 2rem' }}>Go to Login / Register</Button>
        </Card>
      </main>
    )
  }

  const deliveryByOrderId = new Map(deliveries.map((delivery) => [delivery.orderId, delivery]))
  const activeDeliveries = deliveries.filter((delivery) => !['Delivered', 'Cancelled', 'Refunded'].includes(delivery.status))
  const latestDelivery = deliveries[0]

  const getStepIndex = (status) => {
    switch (status) {
      case 'Delivered':
        return 3
      case 'Shipped':
        return 2
      case 'Packed':
      case 'Processing':
        return 1
      default:
        return 0
    }
  }

  return (
    <main className="page" style={{ maxWidth: '1180px' }}>
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        <div>
          <h1 style={{ color: 'var(--primary)', marginBottom: '0.4rem' }}>Order Tracking</h1>
          <p style={{ color: 'var(--on-surface-variant)' }}>Monitor shipment progress, ETA, and delivery history.</p>
        </div>
        <Badge tone={activeDeliveries.length > 0 ? 'info' : 'success'}>
          {activeDeliveries.length > 0 ? `${activeDeliveries.length} active delivery${activeDeliveries.length > 1 ? 'ies' : 'y'}` : 'All deliveries complete'}
        </Badge>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: '1.25rem', marginBottom: '1.5rem' }}>
        <Card>
          <p className="form-label" style={{ marginBottom: '0.75rem' }}>Tracked Orders</p>
          <span style={{ fontSize: '2.2rem', fontWeight: 700, color: 'var(--primary)' }}>{orders.length}</span>
        </Card>
        <Card>
          <p className="form-label" style={{ marginBottom: '0.75rem' }}>Active Deliveries</p>
          <span style={{ fontSize: '2.2rem', fontWeight: 700, color: 'var(--primary)' }}>{activeDeliveries.length}</span>
        </Card>
        <Card>
          <p className="form-label" style={{ marginBottom: '0.75rem' }}>Latest Update</p>
          <p style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--primary)', marginBottom: '0.25rem' }}>
            {latestDelivery ? `${latestDelivery.status} - ${latestDelivery.orderId}` : 'No delivery records yet'}
          </p>
          <p style={{ fontSize: '0.82rem', color: 'var(--on-surface-variant)' }}>
            {latestDelivery ? latestDelivery.currentLocation : 'Place an order to create a delivery record.'}
          </p>
        </Card>
      </div>

      <div className="stack-md">
        {deliveries.length === 0 ? (
          <Card style={{ textAlign: 'center', padding: '2.5rem' }}>
            <h2 style={{ color: 'var(--primary)', marginBottom: '0.75rem' }}>No active deliveries</h2>
            <p style={{ color: 'var(--on-surface-variant)' }}>When an order is placed, a delivery record will appear here.</p>
          </Card>
        ) : (
          deliveries.map((delivery) => {
            const order = deliveryByOrderId.get(delivery.orderId) || orders.find((item) => item.id === delivery.orderId)
            const currentStep = getStepIndex(delivery.status)

            return (
              <Card key={delivery.id} style={{ padding: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
                  <div>
                    <h3 style={{ marginBottom: '0.35rem', color: 'var(--primary)' }}>#{delivery.orderId}</h3>
                    <p style={{ color: 'var(--on-surface-variant)', fontSize: '0.9rem' }}>
                      {order?.items || 'Order details unavailable'}
                    </p>
                  </div>
                  <Badge tone={delivery.status === 'Delivered' ? 'success' : delivery.status === 'Shipped' ? 'info' : 'warning'}>{delivery.status}</Badge>
                </div>

                <Stepper steps={trackingSteps.map((step) => step.label)} current={currentStep} />

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: '1rem' }}>
                  <div>
                    <p className="form-label" style={{ marginBottom: '0.35rem' }}>Carrier</p>
                    <p style={{ color: 'var(--on-surface)' }}>{delivery.carrier}</p>
                  </div>
                  <div>
                    <p className="form-label" style={{ marginBottom: '0.35rem' }}>Tracking Number</p>
                    <p style={{ color: 'var(--on-surface)' }}>{delivery.trackingNumber}</p>
                  </div>
                  <div>
                    <p className="form-label" style={{ marginBottom: '0.35rem' }}>Destination</p>
                    <p style={{ color: 'var(--on-surface)' }}>{delivery.destination}</p>
                  </div>
                  <div>
                    <p className="form-label" style={{ marginBottom: '0.35rem' }}>ETA</p>
                    <p style={{ color: 'var(--on-surface)' }}>{new Date(delivery.estimatedDeliveryAtUtc).toLocaleDateString()}</p>
                  </div>
                </div>

                <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap', color: 'var(--on-surface-variant)', fontSize: '0.88rem' }}>
                  <span>Current location: {delivery.currentLocation}</span>
                  <span>Updated: {new Date(delivery.updatedAtUtc).toLocaleString()}</span>
                </div>
              </Card>
            )
          })
        )}
      </div>
    </main>
  )
}

export function QaLabPage() {
  const {
    isAuthenticated,
    currentUser,
    qaFlags,
    qaAuditLogs,
    qaScenarioPacks,
    returnRequests,
    supportCases,
    loadQaFlags,
    loadQaAuditLogs,
    loadQaScenarioPacks,
    toggleQaFlag,
    applyScenarioPack,
    loadReturnRequests,
    submitReturnRequest,
    changeReturnStatus,
    loadSupportCases,
    submitSupportCase,
    assignCase,
    changeSupportCaseStatus,
    orders,
    loadOrders,
    showToast,
  } = useShop()

  const [returnForm, setReturnForm] = useState({ orderId: '', reason: '', requestedAmount: '' })
  const [supportForm, setSupportForm] = useState({ orderId: '', subject: '', description: '', priority: 'Normal' })
  const [auditFilter, setAuditFilter] = useState('')
  const [loading, setLoading] = useState(false)
  const isStaff = ['Admin', 'Manager', 'Support', 'QaTester'].includes(currentUser?.role || '')
  const canManageQa = ['Admin', 'Manager', 'QaTester'].includes(currentUser?.role || '')

  useEffect(() => {
    if (!isAuthenticated) return
    setLoading(true)
    Promise.all([
      loadQaFlags(),
      loadQaScenarioPacks(),
      loadQaAuditLogs({ take: 80 }),
      loadReturnRequests(),
      loadSupportCases(),
      loadOrders(),
    ]).finally(() => setLoading(false))
  }, [isAuthenticated])

  const handleApplyPack = async (key) => {
    try {
      await applyScenarioPack(key)
    } catch {
      showToast('Could not apply scenario pack.')
    }
  }

  const handleToggleFlag = async (key, isEnabled) => {
    try {
      await toggleQaFlag(key, isEnabled)
    } catch {
      showToast('Could not update feature flag.')
    }
  }

  const handleSubmitReturn = async (e) => {
    e.preventDefault()
    try {
      await submitReturnRequest({
        orderId: returnForm.orderId,
        reason: returnForm.reason,
        requestedAmount: Number(returnForm.requestedAmount),
      })
      setReturnForm({ orderId: '', reason: '', requestedAmount: '' })
    } catch {
      showToast('Could not submit return request.')
    }
  }

  const handleSubmitSupport = async (e) => {
    e.preventDefault()
    try {
      await submitSupportCase(supportForm)
      setSupportForm({ orderId: '', subject: '', description: '', priority: 'Normal' })
    } catch {
      showToast('Could not submit support case.')
    }
  }

  const refreshAudit = async () => {
    try {
      await loadQaAuditLogs({ take: 80, eventType: auditFilter || undefined })
    } catch {
      showToast('Could not refresh audit logs.')
    }
  }

  if (!isAuthenticated) {
    return (
      <main className="page" style={{ maxWidth: '780px' }}>
        <Card style={{ textAlign: 'center', padding: '2.5rem' }}>
          <h1 style={{ color: 'var(--primary)', marginBottom: '0.75rem' }}>Sign in to open QA Lab</h1>
          <p style={{ color: 'var(--on-surface-variant)', marginBottom: '1.5rem' }}>
            QA Lab requires an authenticated training account.
          </p>
          <Button to="/auth" variant="primary" style={{ padding: '0.9rem 2rem' }}>Go to Login / Register</Button>
        </Card>
      </main>
    )
  }

  return (
    <main className="page sidebar-layout">
      <SidePanel active={5} items={profileNavItems} />
      <section className="stack-md">
        <div>
          <h1 style={{ color: 'var(--primary)', marginBottom: '0.4rem' }}>QA Lab</h1>
          <p style={{ color: 'var(--on-surface-variant)' }}>
            Training control center for scenario packs, defect flags, returns/refunds, and support workflows.
          </p>
        </div>

        <Card>
          <h3 style={{ color: 'var(--primary)', marginBottom: '0.75rem' }}>Scenario Packs</h3>
          <p style={{ color: 'var(--on-surface-variant)', marginBottom: '1rem' }}>Apply grouped training setups for classes and test missions.</p>
          <div className="stack-sm">
            {qaScenarioPacks.map(pack => (
              <div key={pack.key} style={{ border: '1px solid var(--border-color)', borderRadius: '4px', padding: '0.9rem 1rem' }}>
                <div className="space-between" style={{ alignItems: 'start' }}>
                  <div>
                    <p style={{ color: 'var(--primary)', fontWeight: 700 }}>{pack.title}</p>
                    <p style={{ color: 'var(--on-surface-variant)', fontSize: '0.88rem' }}>{pack.description}</p>
                  </div>
                  <Button
                    variant="secondary"
                    onClick={() => handleApplyPack(pack.key)}
                    disabled={!canManageQa}
                    style={{ padding: '0.45rem 0.8rem', fontSize: '0.82rem' }}
                  >
                    Apply
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <h3 style={{ color: 'var(--primary)', marginBottom: '0.75rem' }}>Feature Flags</h3>
          <div className="stack-sm">
            {qaFlags.map(flag => (
              <div key={flag.key} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.6rem' }}>
                <div>
                  <p style={{ color: 'var(--on-surface)', fontWeight: 600 }}>{flag.key}</p>
                  <p style={{ color: 'var(--on-surface-variant)', fontSize: '0.82rem' }}>{flag.description}</p>
                </div>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.82rem' }}>
                  <input
                    type="checkbox"
                    checked={!!flag.isEnabled}
                    disabled={!canManageQa}
                    onChange={(e) => handleToggleFlag(flag.key, e.target.checked)}
                  />
                  {flag.isEnabled ? 'Enabled' : 'Disabled'}
                </label>
              </div>
            ))}
          </div>
        </Card>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '1.25rem' }}>
          <Card>
            <h3 style={{ color: 'var(--primary)', marginBottom: '0.75rem' }}>Create Return Request</h3>
            <form className="form-grid" onSubmit={handleSubmitReturn}>
              <div className="form-group">
                <label className="form-label">Order</label>
                <select value={returnForm.orderId} onChange={e => setReturnForm(f => ({ ...f, orderId: e.target.value }))} required>
                  <option value="">Select order</option>
                  {orders.map(o => <option key={o.id} value={o.id}>{o.id} - {o.status}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Requested Amount</label>
                <input type="number" min="1" step="0.01" value={returnForm.requestedAmount} onChange={e => setReturnForm(f => ({ ...f, requestedAmount: e.target.value }))} required />
              </div>
              <div className="form-group full-width">
                <label className="form-label">Reason</label>
                <textarea rows="3" value={returnForm.reason} onChange={e => setReturnForm(f => ({ ...f, reason: e.target.value }))} required style={{ width: '100%', padding: '0.7rem 0.9rem' }} />
              </div>
              <div className="full-width" style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Button type="submit" variant="secondary">Submit Return</Button>
              </div>
            </form>
          </Card>

          <Card>
            <h3 style={{ color: 'var(--primary)', marginBottom: '0.75rem' }}>Open Support Case</h3>
            <form className="form-grid" onSubmit={handleSubmitSupport}>
              <div className="form-group">
                <label className="form-label">Related Order (optional)</label>
                <input type="text" value={supportForm.orderId} onChange={e => setSupportForm(f => ({ ...f, orderId: e.target.value }))} placeholder="LWS-xxxxx" />
              </div>
              <div className="form-group">
                <label className="form-label">Priority</label>
                <select value={supportForm.priority} onChange={e => setSupportForm(f => ({ ...f, priority: e.target.value }))}>
                  <option value="Low">Low</option>
                  <option value="Normal">Normal</option>
                  <option value="High">High</option>
                  <option value="Critical">Critical</option>
                </select>
              </div>
              <div className="form-group full-width">
                <label className="form-label">Subject</label>
                <input type="text" value={supportForm.subject} onChange={e => setSupportForm(f => ({ ...f, subject: e.target.value }))} required />
              </div>
              <div className="form-group full-width">
                <label className="form-label">Description</label>
                <textarea rows="3" value={supportForm.description} onChange={e => setSupportForm(f => ({ ...f, description: e.target.value }))} required style={{ width: '100%', padding: '0.7rem 0.9rem' }} />
              </div>
              <div className="full-width" style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Button type="submit" variant="secondary">Create Case</Button>
              </div>
            </form>
          </Card>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '1.25rem' }}>
          <Card>
            <h3 style={{ color: 'var(--primary)', marginBottom: '0.75rem' }}>Return Requests</h3>
            <div className="stack-sm">
              {returnRequests.map(item => (
                <div key={item.id} style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '0.65rem' }}>
                  <p style={{ fontWeight: 700, color: 'var(--primary)' }}>#{item.id} • {item.orderId}</p>
                  <p style={{ fontSize: '0.85rem', color: 'var(--on-surface-variant)' }}>{item.reason}</p>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.4rem' }}>
                    <Badge tone={item.status === 'Approved' || item.status === 'ApprovedPendingPayout' ? 'success' : item.status === 'Rejected' ? 'warning' : 'info'}>{item.status}</Badge>
                    {isStaff && (
                      <select value={item.status} onChange={e => changeReturnStatus(item.id, { status: e.target.value, approvedAmount: item.approvedAmount, resolutionNotes: item.resolutionNotes })} style={{ width: 'auto', fontSize: '0.82rem' }}>
                        <option value="PendingReview">PendingReview</option>
                        <option value="Approved">Approved</option>
                        <option value="Rejected">Rejected</option>
                        <option value="Closed">Closed</option>
                      </select>
                    )}
                  </div>
                </div>
              ))}
              {returnRequests.length === 0 && <p style={{ color: 'var(--on-surface-variant)' }}>No return requests found.</p>}
            </div>
          </Card>

          <Card>
            <h3 style={{ color: 'var(--primary)', marginBottom: '0.75rem' }}>Support Cases</h3>
            <div className="stack-sm">
              {supportCases.map(item => (
                <div key={item.id} style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '0.65rem' }}>
                  <p style={{ fontWeight: 700, color: 'var(--primary)' }}>Case #{item.id} • {item.subject}</p>
                  <p style={{ fontSize: '0.85rem', color: 'var(--on-surface-variant)' }}>{item.description}</p>
                  <p style={{ fontSize: '0.8rem', color: 'var(--on-surface-variant)' }}>Priority: {item.priority} • Assignee: {item.assignedToUserId || 'Unassigned'}</p>
                  {isStaff && (
                    <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.45rem' }}>
                      <Button variant="text" style={{ color: 'var(--primary)', padding: 0 }} onClick={() => assignCase(item.id, currentUser?.id || 'admin-1')}>Assign to me</Button>
                      <Button variant="text" style={{ color: 'var(--secondary)', padding: 0 }} onClick={() => changeSupportCaseStatus(item.id, item.status === 'Resolved' ? 'InProgress' : 'Resolved')}>
                        Mark {item.status === 'Resolved' ? 'InProgress' : 'Resolved'}
                      </Button>
                    </div>
                  )}
                </div>
              ))}
              {supportCases.length === 0 && <p style={{ color: 'var(--on-surface-variant)' }}>No support cases found.</p>}
            </div>
          </Card>
        </div>

        <Card>
          <div className="space-between" style={{ alignItems: 'center', marginBottom: '0.8rem' }}>
            <h3 style={{ color: 'var(--primary)' }}>Audit Timeline</h3>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <input
                type="text"
                value={auditFilter}
                placeholder="Filter by event type"
                onChange={e => setAuditFilter(e.target.value)}
                style={{ width: '220px' }}
              />
              <Button variant="secondary" onClick={refreshAudit}>Refresh</Button>
            </div>
          </div>
          {loading ? (
            <p style={{ color: 'var(--on-surface-variant)' }}>Loading QA telemetry...</p>
          ) : (
            <div style={{ maxHeight: '320px', overflowY: 'auto', border: '1px solid var(--border-color)', borderRadius: '4px' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.84rem' }}>
                <thead style={{ background: 'var(--surface-low)', position: 'sticky', top: 0 }}>
                  <tr>
                    <th style={{ textAlign: 'left', padding: '0.65rem 0.75rem' }}>Time (UTC)</th>
                    <th style={{ textAlign: 'left', padding: '0.65rem 0.75rem' }}>Event</th>
                    <th style={{ textAlign: 'left', padding: '0.65rem 0.75rem' }}>User</th>
                    <th style={{ textAlign: 'left', padding: '0.65rem 0.75rem' }}>Severity</th>
                  </tr>
                </thead>
                <tbody>
                  {qaAuditLogs.map(row => (
                    <tr key={row.id} style={{ borderTop: '1px solid var(--border-color)' }}>
                      <td style={{ padding: '0.6rem 0.75rem', color: 'var(--on-surface-variant)' }}>{new Date(row.timestampUtc).toLocaleString()}</td>
                      <td style={{ padding: '0.6rem 0.75rem', color: 'var(--on-surface)' }}>{row.eventType}</td>
                      <td style={{ padding: '0.6rem 0.75rem', color: 'var(--on-surface-variant)' }}>{row.userId || 'system'}</td>
                      <td style={{ padding: '0.6rem 0.75rem' }}><Badge tone={row.severity === 'Warning' ? 'warning' : 'info'}>{row.severity}</Badge></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </section>
    </main>
  )
}

export function TrainingMissionsPage() {
  const {
    isAuthenticated,
    currentUser,
    trainingMissions,
    trainingPersonas,
    activeTrainingPersona,
    setTrainingPersona,
    loadTrainingMissions,
    loadTrainingPersonas,
    missionProgress,
    loadMissionProgress,
    beginMission,
    finishMission,
    missionLeaderboard,
    loadMissionLeaderboard,
    defectReports,
    loadDefectReports,
    submitDefectReport,
    reviewStudentDefectReport,
    resetClassSession,
    showToast,
  } = useShop()
  const [loading, setLoading] = useState(false)
  const [defectForm, setDefectForm] = useState({
    missionKey: '',
    title: '',
    severity: 'Medium',
    stepsToReproduce: '',
    expectedResult: '',
    actualResult: '',
    environmentNotes: '',
  })
  const [resetForm, setResetForm] = useState({ scenarioPackKey: 'happy_path_baseline', clearStudentData: true, clearAudit: false })
  const isInstructor = ['Admin', 'Manager', 'QaTester'].includes(currentUser?.role || '')

  useEffect(() => {
    if (!isAuthenticated) return
    setLoading(true)
    Promise.all([
      loadTrainingMissions(),
      loadTrainingPersonas(),
      loadMissionProgress(),
      loadMissionLeaderboard(),
      loadDefectReports(),
    ]).finally(() => setLoading(false))
  }, [isAuthenticated])

  if (!isAuthenticated) {
    return (
      <main className="page" style={{ maxWidth: '780px' }}>
        <Card style={{ textAlign: 'center', padding: '2.5rem' }}>
          <h1 style={{ color: 'var(--primary)', marginBottom: '0.75rem' }}>Sign in to open Training Missions</h1>
          <p style={{ color: 'var(--on-surface-variant)', marginBottom: '1.5rem' }}>
            Guided missions are available to authenticated training accounts only.
          </p>
          <Button to="/auth" variant="primary" style={{ padding: '0.9rem 2rem' }}>Go to Login / Register</Button>
        </Card>
      </main>
    )
  }

  const activePersona = trainingPersonas.find(p => p.key === activeTrainingPersona) || trainingPersonas[0]

  const handleStartMission = async (missionKey) => {
    try {
      await beginMission({ missionKey, personaKey: activeTrainingPersona })
    } catch {
      showToast('Unable to start mission.')
    }
  }

  const handleCompleteMission = async (missionKey) => {
    try {
      const reportCount = defectReports.filter(r => r.missionKey === missionKey).length
      await finishMission({ missionKey, personaKey: activeTrainingPersona, findingsCount: reportCount })
    } catch {
      showToast('Unable to complete mission.')
    }
  }

  const handleSubmitDefect = async (e) => {
    e.preventDefault()
    try {
      await submitDefectReport(defectForm)
      setDefectForm({
        missionKey: '',
        title: '',
        severity: 'Medium',
        stepsToReproduce: '',
        expectedResult: '',
        actualResult: '',
        environmentNotes: '',
      })
    } catch {
      showToast('Unable to submit defect report.')
    }
  }

  const handleReviewReport = async (id, status) => {
    try {
      await reviewStudentDefectReport(id, {
        status,
        instructorFeedback: status === 'Accepted' ? 'Well documented. Reproducible.' : 'Needs stronger reproduction detail.',
        score: status === 'Accepted' ? 90 : 60,
      })
    } catch {
      showToast('Unable to review defect report.')
    }
  }

  const handleResetSession = async (e) => {
    e.preventDefault()
    try {
      await resetClassSession(resetForm)
    } catch {
      showToast('Unable to reset class session.')
    }
  }

  const progressMap = missionProgress.reduce((acc, item) => {
    acc[item.missionKey] = item
    return acc
  }, {})

  return (
    <main className="page sidebar-layout">
      <SidePanel active={6} items={profileNavItems} />
      <section className="stack-md">
        <div>
          <h1 style={{ color: 'var(--primary)', marginBottom: '0.4rem' }}>Training Missions</h1>
          <p style={{ color: 'var(--on-surface-variant)' }}>
            Guided practice paths for students learning Lewis workflows, data checks, and defect discovery.
          </p>
        </div>

        <Card>
          <h3 style={{ color: 'var(--primary)', marginBottom: '0.75rem' }}>Role Simulation Helper</h3>
          <p style={{ color: 'var(--on-surface-variant)', marginBottom: '1rem' }}>
            Switch between training personas to practice the same system from different operational perspectives.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '1rem' }}>
            {trainingPersonas.map(persona => (
              <button
                key={persona.key}
                onClick={() => setTrainingPersona(persona.key)}
                style={{
                  textAlign: 'left',
                  padding: '1rem',
                  borderRadius: '8px',
                  border: persona.key === activeTrainingPersona ? '2px solid var(--primary)' : '1px solid var(--border-color)',
                  background: persona.key === activeTrainingPersona ? 'rgba(0,31,92,0.04)' : '#fff',
                  cursor: 'pointer',
                }}
              >
                <p style={{ color: 'var(--primary)', fontWeight: 700, marginBottom: '0.25rem' }}>{persona.label}</p>
                <p style={{ color: 'var(--on-surface-variant)', fontSize: '0.88rem', marginBottom: '0.5rem' }}>{persona.description}</p>
                <p style={{ color: 'var(--on-surface)', fontSize: '0.8rem', fontWeight: 600 }}>Role: {persona.role}</p>
              </button>
            ))}
          </div>
        </Card>

        {activePersona && (
          <Card>
            <h3 style={{ color: 'var(--primary)', marginBottom: '0.6rem' }}>{activePersona.label} View</h3>
            <p style={{ color: 'var(--on-surface-variant)', marginBottom: '0.8rem' }}>{activePersona.description}</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              {activePersona.capabilityNotes?.map(note => (
                <Badge key={note} tone="subtle">{note}</Badge>
              ))}
            </div>
          </Card>
        )}

        {isInstructor && (
          <Card>
            <h3 style={{ color: 'var(--primary)', marginBottom: '0.6rem' }}>Instructor Session Setup</h3>
            <p style={{ color: 'var(--on-surface-variant)', marginBottom: '1rem' }}>
              Reset class state, apply a scenario pack, and optionally clear student submissions.
            </p>
            <form className="form-grid" onSubmit={handleResetSession}>
              <div className="form-group">
                <label className="form-label">Scenario Pack</label>
                <select value={resetForm.scenarioPackKey} onChange={e => setResetForm(f => ({ ...f, scenarioPackKey: e.target.value }))}>
                  <option value="happy_path_baseline">happy_path_baseline</option>
                  <option value="data_integrity_hunt">data_integrity_hunt</option>
                  <option value="support_ops_breakdown">support_ops_breakdown</option>
                </select>
              </div>
              <div className="form-group" style={{ display: 'flex', alignItems: 'end', gap: '1rem' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <input type="checkbox" checked={resetForm.clearStudentData} onChange={e => setResetForm(f => ({ ...f, clearStudentData: e.target.checked }))} />
                  Clear student data
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <input type="checkbox" checked={resetForm.clearAudit} onChange={e => setResetForm(f => ({ ...f, clearAudit: e.target.checked }))} />
                  Clear audit logs
                </label>
              </div>
              <div className="full-width" style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Button type="submit" variant="secondary">Reset Class Session</Button>
              </div>
            </form>
          </Card>
        )}

        <Card>
          <div className="space-between" style={{ alignItems: 'center', marginBottom: '0.75rem' }}>
            <div>
              <h3 style={{ color: 'var(--primary)' }}>Mission Packs</h3>
              <p style={{ color: 'var(--on-surface-variant)', fontSize: '0.9rem' }}>Complete one mission at a time and record your findings.</p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              {loading && <span style={{ color: 'var(--on-surface-variant)', fontSize: '0.85rem' }}>Loading...</span>}
              <Button to="/qa-lab" variant="text" style={{ color: 'var(--primary)', padding: 0 }}>Open QA Lab</Button>
            </div>
          </div>
          <div className="stack-md">
            {trainingMissions.map(mission => (
              <article key={mission.key} style={{ border: '1px solid var(--border-color)', borderRadius: '10px', padding: '1rem' }}>
                <div className="space-between" style={{ alignItems: 'start' }}>
                  <div>
                    <p style={{ color: 'var(--primary)', fontSize: '1.05rem', fontWeight: 700 }}>{mission.title}</p>
                    <p style={{ color: 'var(--on-surface-variant)', marginTop: '0.25rem' }}>{mission.summary}</p>
                  </div>
                  <Badge tone="info">{mission.persona}</Badge>
                </div>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', margin: '0.9rem 0' }}>
                  {mission.focusAreas.map(area => <Badge key={area} tone="subtle">{area}</Badge>)}
                </div>

                <ol style={{ margin: 0, paddingLeft: '1.25rem', color: 'var(--on-surface)', lineHeight: 1.7 }}>
                  {mission.steps.map(step => <li key={step}>{step}</li>)}
                </ol>

                <div style={{ marginTop: '0.9rem', display: 'flex', justifyContent: 'flex-end' }}>
                  <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'center' }}>
                    {progressMap[mission.key] && (
                      <Badge tone={progressMap[mission.key].status === 'Completed' ? 'success' : 'info'}>
                        {progressMap[mission.key].status} {progressMap[mission.key].badge ? `• ${progressMap[mission.key].badge}` : ''}
                      </Badge>
                    )}
                    <Button variant="text" style={{ color: 'var(--primary)', padding: 0 }} onClick={() => handleStartMission(mission.key)}>
                      Start
                    </Button>
                    <Button variant="secondary" onClick={() => handleCompleteMission(mission.key)}>
                      Complete
                    </Button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </Card>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '1.25rem' }}>
          <Card>
            <h3 style={{ color: 'var(--primary)', marginBottom: '0.75rem' }}>Submit Defect Report</h3>
            <form className="form-grid" onSubmit={handleSubmitDefect}>
              <div className="form-group">
                <label className="form-label">Mission</label>
                <select value={defectForm.missionKey} onChange={e => setDefectForm(f => ({ ...f, missionKey: e.target.value }))} required>
                  <option value="">Select mission</option>
                  {trainingMissions.map(m => <option key={m.key} value={m.key}>{m.title}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Severity</label>
                <select value={defectForm.severity} onChange={e => setDefectForm(f => ({ ...f, severity: e.target.value }))}>
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                  <option value="Critical">Critical</option>
                </select>
              </div>
              <div className="form-group full-width">
                <label className="form-label">Title</label>
                <input type="text" value={defectForm.title} onChange={e => setDefectForm(f => ({ ...f, title: e.target.value }))} required />
              </div>
              <div className="form-group full-width">
                <label className="form-label">Steps to Reproduce</label>
                <textarea rows="3" value={defectForm.stepsToReproduce} onChange={e => setDefectForm(f => ({ ...f, stepsToReproduce: e.target.value }))} required style={{ width: '100%', padding: '0.7rem 0.9rem' }} />
              </div>
              <div className="form-group full-width">
                <label className="form-label">Expected Result</label>
                <input type="text" value={defectForm.expectedResult} onChange={e => setDefectForm(f => ({ ...f, expectedResult: e.target.value }))} />
              </div>
              <div className="form-group full-width">
                <label className="form-label">Actual Result</label>
                <input type="text" value={defectForm.actualResult} onChange={e => setDefectForm(f => ({ ...f, actualResult: e.target.value }))} />
              </div>
              <div className="form-group full-width">
                <label className="form-label">Environment Notes</label>
                <input type="text" placeholder="role, scenario pack, browser" value={defectForm.environmentNotes} onChange={e => setDefectForm(f => ({ ...f, environmentNotes: e.target.value }))} />
              </div>
              <div className="full-width" style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Button type="submit" variant="secondary">Submit Report</Button>
              </div>
            </form>
          </Card>

          <Card>
            <h3 style={{ color: 'var(--primary)', marginBottom: '0.75rem' }}>Mission Leaderboard</h3>
            {missionLeaderboard.length === 0 ? (
              <p style={{ color: 'var(--on-surface-variant)' }}>No mission scores yet.</p>
            ) : (
              <div style={{ maxHeight: '350px', overflowY: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.86rem' }}>
                  <thead style={{ background: 'var(--surface-low)' }}>
                    <tr>
                      <th style={{ textAlign: 'left', padding: '0.5rem' }}>Student</th>
                      <th style={{ textAlign: 'left', padding: '0.5rem' }}>Role</th>
                      <th style={{ textAlign: 'left', padding: '0.5rem' }}>Missions</th>
                      <th style={{ textAlign: 'left', padding: '0.5rem' }}>Avg</th>
                      <th style={{ textAlign: 'left', padding: '0.5rem' }}>Badge</th>
                    </tr>
                  </thead>
                  <tbody>
                    {missionLeaderboard.map((entry, idx) => (
                      <tr key={`${entry.userId}-${idx}`} style={{ borderTop: '1px solid var(--border-color)' }}>
                        <td style={{ padding: '0.5rem' }}>{entry.fullName}</td>
                        <td style={{ padding: '0.5rem' }}>{entry.role}</td>
                        <td style={{ padding: '0.5rem' }}>{entry.missionsCompleted}</td>
                        <td style={{ padding: '0.5rem', fontWeight: 700 }}>{entry.averageScore}</td>
                        <td style={{ padding: '0.5rem' }}><Badge tone="accent">{entry.bestBadge}</Badge></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Card>
        </div>

        <Card>
          <h3 style={{ color: 'var(--primary)', marginBottom: '0.75rem' }}>Defect Review Board</h3>
          {defectReports.length === 0 ? (
            <p style={{ color: 'var(--on-surface-variant)' }}>No defect reports submitted yet.</p>
          ) : (
            <div className="stack-sm">
              {defectReports.map(report => (
                <div key={report.id} style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '0.7rem' }}>
                  <div className="space-between" style={{ alignItems: 'start' }}>
                    <div>
                      <p style={{ color: 'var(--primary)', fontWeight: 700 }}>#{report.id} {report.title}</p>
                      <p style={{ color: 'var(--on-surface-variant)', fontSize: '0.82rem' }}>
                        Mission: {report.missionKey} • Severity: {report.severity} • By: {report.submittedByUserId}
                      </p>
                      <p style={{ color: 'var(--on-surface-variant)', fontSize: '0.82rem' }}>Status: {report.status} {report.score ? `• Score ${report.score}` : ''}</p>
                    </div>
                    {isInstructor && (
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <Button variant="text" style={{ color: 'var(--primary)', padding: 0 }} onClick={() => handleReviewReport(report.id, 'Accepted')}>Accept</Button>
                        <Button variant="text" style={{ color: 'var(--secondary)', padding: 0 }} onClick={() => handleReviewReport(report.id, 'NeedsWork')}>Needs Work</Button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </section>
    </main>
  )
}

export function AuthPage() {
  const { isAuthenticated, loginUser, registerUser, showToast } = useShop()
  const navigate = useNavigate()
  const [mode, setMode] = useState('login')
  const [form, setForm] = useState({ fullName: '', email: '', password: '', phone: '', address: '' })

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/profile')
    }
  }, [isAuthenticated])

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (mode === 'login') {
        await loginUser(form.email, form.password)
      } else {
        await registerUser(form)
      }
      navigate('/profile')
    } catch {
      showToast('Unable to authenticate. Please check your details.')
    }
  }

  return (
    <main className="page" style={{ maxWidth: '760px' }}>
      <Card>
        <h1 style={{ color: 'var(--primary)', marginBottom: '0.5rem' }}>{mode === 'login' ? 'Sign In' : 'Create Account'}</h1>
        <p style={{ color: 'var(--on-surface-variant)', marginBottom: '1.5rem' }}>
          {mode === 'login' ? 'Access your saved profile, orders, and payment methods.' : 'Create your account to save orders and checkout details.'}
        </p>

        <form className="form-grid" onSubmit={handleSubmit}>
          {mode === 'register' && (
            <>
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input type="text" value={form.fullName} onChange={e => setForm(f => ({ ...f, fullName: e.target.value }))} required />
              </div>
              <div className="form-group">
                <label className="form-label">Phone</label>
                <input type="tel" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} required />
              </div>
            </>
          )}
          <div className="form-group">
            <label className="form-label">Email</label>
            <input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} required />
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <input type="password" value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} required />
          </div>
          {mode === 'register' && (
            <div className="form-group full-width">
              <label className="form-label">Address</label>
              <input type="text" value={form.address} onChange={e => setForm(f => ({ ...f, address: e.target.value }))} required />
            </div>
          )}
          <div className="full-width" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <button
              type="button"
              onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
              style={{ border: 'none', background: 'none', color: 'var(--primary)', fontWeight: 600, cursor: 'pointer', padding: 0 }}
            >
              {mode === 'login' ? 'Need an account? Create one' : 'Already have an account? Sign in'}
            </button>
            <Button type="submit" variant="primary">{mode === 'login' ? 'Log In' : 'Create Account'}</Button>
          </div>
        </form>
      </Card>
    </main>
  )
}

/* ─────────────────────────────────────────────
   CREDIT INFO PAGE
────────────────────────────────────────────── */
export function CreditInfoPage() {
  return (
    <main className="page stack-lg" style={{ maxWidth: '1100px' }}>
      {/* Hero */}
      <section style={{
        background: 'linear-gradient(135deg, var(--primary) 0%, #0a3580 100%)',
        borderRadius: '6px',
        overflow: 'hidden',
        display: 'flex',
        minHeight: '380px',
      }}>
        <div style={{ padding: '3.5rem 4rem', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <span style={{ background: 'var(--secondary)', color: '#fff', fontSize: '0.72rem', fontWeight: 700, padding: '0.3rem 0.75rem', borderRadius: '3px', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'inline-block', width: 'fit-content', marginBottom: '1.25rem' }}>
            Lewis Credit
          </span>
          <h1 style={{ color: '#fff', fontSize: 'clamp(2rem, 4vw, 3rem)', lineHeight: 1.15, marginBottom: '1rem', maxWidth: '480px' }}>
            Shop Now, Pay Monthly — Your Way.
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.82)', fontSize: '1.05rem', marginBottom: '2rem', maxWidth: '440px', lineHeight: 1.7 }}>
            Get the furniture, appliances and electronics your family needs today. Apply for Lewis credit in minutes with flexible repayment terms.
          </p>
          <div className="row" style={{ gap: '1rem' }}>
            <Button to="/credit/form-1" variant="primary" style={{ background: '#fff', color: 'var(--primary)', fontWeight: 700, padding: '0.9rem 2rem' }}>
              Apply Now
            </Button>
            <Button variant="secondary" style={{ background: 'transparent', color: '#fff', borderColor: 'rgba(255,255,255,0.4)', padding: '0.9rem 2rem' }}
              onClick={() => {}}>
              How It Works
            </Button>
          </div>
        </div>
        <div style={{ flex: 1, backgroundImage: 'url("https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80&w=1200")', backgroundSize: 'cover', backgroundPosition: 'center', minHeight: '300px' }}></div>
      </section>

      {/* Benefits */}
      <section>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h2 style={{ color: 'var(--primary)', marginBottom: '0.5rem' }}>Why Choose Lewis Credit?</h2>
          <div style={{ width: '40px', height: '3px', background: 'var(--secondary)', margin: '1rem auto 0 auto', borderRadius: '2px' }}></div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem' }}>
          {[
            {
              icon: <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>,
              title: 'Flexible Repayment Terms',
              desc: 'Choose between 6 to 36 month repayment plans that fit your monthly budget.',
            },
            {
              icon: <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>,
              title: 'Built-in Insurance Cover',
              desc: 'Your credit account includes insurance protection for peace of mind.',
            },
            {
              icon: <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>,
              title: 'Shop Immediately',
              desc: 'Once approved, take your items home the same day. No waiting around.',
            },
          ].map(b => (
            <Card key={b.title} style={{ background: 'var(--surface-low)', border: 'none', padding: '2rem', textAlign: 'center' }}>
              <div style={{ color: 'var(--secondary)', marginBottom: '1.25rem', display: 'flex', justifyContent: 'center' }}>{b.icon}</div>
              <h3 style={{ color: 'var(--primary)', marginBottom: '0.75rem', fontSize: '1.05rem' }}>{b.title}</h3>
              <p style={{ fontSize: '0.92rem', color: 'var(--on-surface-variant)', lineHeight: 1.6 }}>{b.desc}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* Requirements */}
      <section>
        <Card>
          <h2 style={{ color: 'var(--primary)', marginBottom: '1.5rem', fontSize: '1.3rem' }}>What You'll Need to Apply</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
            {['South African ID document', 'Proof of income (last 3 months payslips)', 'Recent bank statement (3 months)', 'Proof of address (not older than 3 months)'].map(r => (
              <div key={r} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.9rem', background: 'var(--surface-low)', borderRadius: '4px' }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--secondary)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                <span style={{ fontSize: '0.92rem', color: 'var(--on-surface)' }}>{r}</span>
              </div>
            ))}
          </div>
          <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'flex-end' }}>
            <Button to="/credit/form-1" variant="primary" style={{ padding: '0.9rem 2rem', fontWeight: 700 }}>
              Start Application →
            </Button>
          </div>
        </Card>
      </section>

      <p style={{ textAlign: 'center', fontSize: '0.78rem', color: 'var(--on-surface-variant)', maxWidth: '700px', margin: '0 auto' }}>
        Lewis Stores is a registered credit provider. Credit is subject to affordability and credit assessment. NCA registered. Terms and conditions apply.
      </p>
    </main>
  )
}

/* ─────────────────────────────────────────────
   CREDIT FORM 1 — Personal & Financial Info
────────────────────────────────────────────── */
export function CreditFormOnePage() {
  const { creditForm, updateCreditForm, showToast } = useShop()
  const navigate = useNavigate()
  const [errors, setErrors] = useState({})

  const creditStepLabels = ['Personal Info', 'Employment', 'Review', 'Status']

  const validate = () => {
    const e = {}
    if (!creditForm.fullName.trim()) e.fullName = 'Full name is required'
    if (!creditForm.idNumber.trim()) e.idNumber = 'ID number is required'
    if (creditForm.idNumber.length !== 13) e.idNumber = 'ID number must be 13 digits'
    if (!creditForm.email.trim() || !creditForm.email.includes('@')) e.email = 'Valid email is required'
    if (!creditForm.phone.trim()) e.phone = 'Phone number is required'
    if (!creditForm.grossIncome) e.grossIncome = 'Gross monthly income is required'
    if (!creditForm.netIncome) e.netIncome = 'Net monthly income is required'
    if (!creditForm.expenses) e.expenses = 'Monthly expenses required'
    return e
  }

  const handle = (e) => {
    e.preventDefault()
    const errs = validate()
    setErrors(errs)
    if (Object.keys(errs).length === 0) {
      navigate('/credit/form-2')
    } else {
      showToast('Please fill in all required fields.')
    }
  }

  const f = (name, label, type = 'text', placeholder = '', hint = '') => (
    <div className="form-group">
      <label className="form-label">{label}</label>
      <input
        type={type}
        placeholder={placeholder}
        value={creditForm[name]}
        onChange={ev => { updateCreditForm({ [name]: ev.target.value }); setErrors(er => ({ ...er, [name]: undefined })) }}
        style={{ borderColor: errors[name] ? 'var(--secondary)' : 'transparent' }}
      />
      {hint && <small style={{ color: 'var(--on-surface-variant)', fontStyle: 'italic', fontSize: '0.75rem' }}>{hint}</small>}
      {errors[name] && <p style={{ color: 'var(--secondary)', fontSize: '0.78rem' }}>{errors[name]}</p>}
    </div>
  )

  return (
    <main className="page" style={{ maxWidth: '900px' }}>
      <Stepper steps={creditStepLabels} current={0} />
      <section className="stack-md">
        <div>
          <h1 style={{ color: 'var(--primary)', marginBottom: '0.4rem' }}>Personal Information</h1>
          <p style={{ color: 'var(--on-surface-variant)', fontSize: '1rem' }}>
            Fill in your details accurately. All information is encrypted and kept confidential.
          </p>
        </div>

        <Card>
          <h3 style={{ color: 'var(--primary)', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.05rem' }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--secondary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
            Your Personal Details
          </h3>
          <form className="form-grid">
            {f('fullName', 'Full Name', 'text', 'e.g. Thabo Nkosi')}
            {f('idNumber', 'South African ID Number', 'text', 'e.g. 9001015000081')}
            {f('email', 'Email Address', 'email', 'e.g. thabo@email.com')}
            {f('phone', 'Mobile Number', 'tel', '+27 82 000 0000')}
          </form>
        </Card>

        <Card>
          <h3 style={{ color: 'var(--primary)', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.05rem' }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--secondary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg>
            Monthly Income & Expenses
          </h3>
          <form className="form-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
            {f('grossIncome', 'Gross Monthly Income', 'text', 'R 25,000', 'Total before taxes and deductions')}
            {f('netIncome', 'Net Monthly Income (Take-home)', 'text', 'R 18,500', 'Your actual take-home pay')}
            {f('expenses', 'Monthly Expenses', 'text', 'R 9,000', 'Rent, food, insurance, transport')}
          </form>
        </Card>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <p style={{ color: 'var(--on-surface-variant)', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
            Your information is protected under POPIA regulations.
          </p>
          <Button onClick={handle} variant="primary" style={{ padding: '0.9rem 2rem', fontWeight: 700 }}>
            Next Step →
          </Button>
        </div>
      </section>
    </main>
  )
}

/* ─────────────────────────────────────────────
   CREDIT FORM 2 — Employment Info
────────────────────────────────────────────── */
export function CreditFormTwoPage() {
  const { creditForm, updateCreditForm, submitCreditApplication, showToast } = useShop()
  const navigate = useNavigate()
  const [errors, setErrors] = useState({})

  const creditStepLabels = ['Personal Info', 'Employment', 'Review', 'Status']

  const validate = () => {
    const e = {}
    if (!creditForm.employer.trim()) e.employer = 'Employer name is required'
    if (!creditForm.industry || creditForm.industry === 'Select Industry') e.industry = 'Please select an industry'
    if (!creditForm.yearsAtJob && creditForm.yearsAtJob !== 0) e.yearsAtJob = 'Years at job is required'
    if (!creditForm.employmentType) e.employmentType = 'Employment type is required'
    return e
  }

  const handle = (e) => {
    e.preventDefault()
    const errs = validate()
    setErrors(errs)
    if (Object.keys(errs).length === 0) {
      navigate('/credit/review')
    } else {
      showToast('Please fill in all employment details.')
    }
  }

  return (
    <main className="page" style={{ maxWidth: '900px' }}>
      <Stepper steps={creditStepLabels} current={1} />
      <section className="stack-md">
        <div>
          <h1 style={{ color: 'var(--primary)', marginBottom: '0.4rem' }}>Employment Details</h1>
          <p style={{ color: 'var(--on-surface-variant)', fontSize: '1rem' }}>
            Tell us about your current job so we can assess your credit application.
          </p>
        </div>

        <Card>
          <h3 style={{ color: 'var(--primary)', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.05rem' }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--secondary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
            Employment Information
          </h3>
          <form className="form-grid">
            <div className="form-group">
              <label className="form-label">Current Employer Name</label>
              <input type="text" placeholder="e.g. Shoprite Holdings" value={creditForm.employer}
                onChange={e => { updateCreditForm({ employer: e.target.value }); setErrors(er => ({ ...er, employer: undefined })) }}
                style={{ borderColor: errors.employer ? 'var(--secondary)' : 'transparent' }} />
              {errors.employer && <p style={{ color: 'var(--secondary)', fontSize: '0.78rem' }}>{errors.employer}</p>}
            </div>

            <div className="form-group">
              <label className="form-label">Employment Type</label>
              <select value={creditForm.employmentType}
                onChange={e => { updateCreditForm({ employmentType: e.target.value }); setErrors(er => ({ ...er, employmentType: undefined })) }}
                style={{ borderColor: errors.employmentType ? 'var(--secondary)' : 'transparent' }}>
                <option value="">Select Type</option>
                <option>Full-Time Permanent</option>
                <option>Part-Time</option>
                <option>Contract</option>
                <option>Self-Employed</option>
                <option>Pensioner</option>
              </select>
              {errors.employmentType && <p style={{ color: 'var(--secondary)', fontSize: '0.78rem' }}>{errors.employmentType}</p>}
            </div>

            <div className="form-group">
              <label className="form-label">Industry</label>
              <select value={creditForm.industry}
                onChange={e => { updateCreditForm({ industry: e.target.value }); setErrors(er => ({ ...er, industry: undefined })) }}
                style={{ borderColor: errors.industry ? 'var(--secondary)' : 'transparent' }}>
                <option value="">Select Industry</option>
                <option>Retail</option>
                <option>Finance & Banking</option>
                <option>Healthcare</option>
                <option>Government / Public Sector</option>
                <option>Education</option>
                <option>Technology</option>
                <option>Construction</option>
                <option>Transport & Logistics</option>
                <option>Other</option>
              </select>
              {errors.industry && <p style={{ color: 'var(--secondary)', fontSize: '0.78rem' }}>{errors.industry}</p>}
            </div>

            <div className="form-group">
              <label className="form-label">Years at Current Job</label>
              <input type="number" placeholder="0" min="0" max="50" value={creditForm.yearsAtJob}
                onChange={e => { updateCreditForm({ yearsAtJob: parseInt(e.target.value) || 0 }); setErrors(er => ({ ...er, yearsAtJob: undefined })) }}
                style={{ borderColor: errors.yearsAtJob ? 'var(--secondary)' : 'transparent' }} />
              {errors.yearsAtJob && <p style={{ color: 'var(--secondary)', fontSize: '0.78rem' }}>{errors.yearsAtJob}</p>}
            </div>
          </form>
        </Card>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Button to="/credit/form-1" variant="text" style={{ color: 'var(--primary)', padding: 0 }}>← Back</Button>
          <Button onClick={handle} variant="primary" style={{ padding: '0.9rem 2rem', fontWeight: 700 }}>
            Review Application →
          </Button>
        </div>
      </section>
    </main>
  )
}

/* ─────────────────────────────────────────────
   CREDIT REVIEW PAGE
────────────────────────────────────────────── */
export function CreditReviewPage() {
  const { creditForm, submitCreditApplication } = useShop()
  const navigate = useNavigate()

  const creditStepLabels = ['Personal Info', 'Employment', 'Review', 'Status']

  const net = parseFloat(String(creditForm.netIncome).replace(/[^0-9.]/g, '')) || 0
  const expenses = parseFloat(String(creditForm.expenses).replace(/[^0-9.]/g, '')) || 0
  const disposable = net - expenses

  const handleSubmit = () => {
    submitCreditApplication()
    navigate('/credit/status')
  }

  const Row = ({ label, value }) => (
    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem 0', borderBottom: '1px solid var(--border-color)' }}>
      <span style={{ color: 'var(--on-surface-variant)', fontSize: '0.9rem' }}>{label}</span>
      <span style={{ fontWeight: 600, color: 'var(--on-surface)' }}>{value || '—'}</span>
    </div>
  )

  return (
    <main className="page" style={{ maxWidth: '900px' }}>
      <Stepper steps={creditStepLabels} current={2} />
      <section className="stack-md">
        <div>
          <h1 style={{ color: 'var(--primary)', marginBottom: '0.4rem' }}>Review Your Application</h1>
          <p style={{ color: 'var(--on-surface-variant)' }}>
            Please check all details are correct before submitting. You can go back to make changes.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
          <Card>
            <h3 style={{ color: 'var(--primary)', marginBottom: '1.25rem', fontSize: '1rem', borderBottom: '2px solid var(--secondary)', paddingBottom: '0.75rem' }}>Personal Details</h3>
            <Row label="Full Name" value={creditForm.fullName} />
            <Row label="ID Number" value={creditForm.idNumber ? `****${creditForm.idNumber.slice(-4)}` : ''} />
            <Row label="Email" value={creditForm.email} />
            <Row label="Phone" value={creditForm.phone} />
          </Card>
          <Card>
            <h3 style={{ color: 'var(--primary)', marginBottom: '1.25rem', fontSize: '1rem', borderBottom: '2px solid var(--secondary)', paddingBottom: '0.75rem' }}>Employment Details</h3>
            <Row label="Employer" value={creditForm.employer} />
            <Row label="Employment Type" value={creditForm.employmentType} />
            <Row label="Industry" value={creditForm.industry} />
            <Row label="Years at Job" value={creditForm.yearsAtJob >= 0 ? `${creditForm.yearsAtJob} year(s)` : ''} />
          </Card>
        </div>

        <Card>
          <h3 style={{ color: 'var(--primary)', marginBottom: '1.25rem', fontSize: '1rem', borderBottom: '2px solid var(--secondary)', paddingBottom: '0.75rem' }}>Financial Summary</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
            {[
              { label: 'Gross Income', value: creditForm.grossIncome || '—' },
              { label: 'Net Income (Take-home)', value: creditForm.netIncome || '—' },
              { label: 'Monthly Expenses', value: creditForm.expenses || '—' },
            ].map(item => (
              <div key={item.label} style={{ background: 'var(--surface-low)', padding: '1rem', borderRadius: '4px' }}>
                <p style={{ fontSize: '0.78rem', color: 'var(--on-surface-variant)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.4rem' }}>{item.label}</p>
                <p style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--primary)' }}>{item.value}</p>
              </div>
            ))}
          </div>
          {disposable > 0 && (
            <div style={{ marginTop: '1rem', padding: '0.75rem 1rem', background: disposable >= 1000 ? '#dcfce7' : '#fef9c3', borderRadius: '4px', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={disposable >= 1000 ? '#166534' : '#854d0e'} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
              <span style={{ fontSize: '0.88rem', color: disposable >= 1000 ? '#166534' : '#854d0e', fontWeight: 600 }}>
                Estimated disposable income: R {disposable.toLocaleString('en-ZA')} per month
              </span>
            </div>
          )}
        </Card>

        <div style={{ background: 'var(--surface-low)', padding: '1.25rem', borderRadius: '4px', display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--on-surface-variant)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: '2px' }}><rect x="3" y="11" width="18" height="11" rx="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
          <p style={{ fontSize: '0.85rem', color: 'var(--on-surface-variant)', lineHeight: 1.6 }}>
            By submitting this application you confirm all information provided is correct and you consent to a credit and affordability assessment in accordance with the National Credit Act (NCA). Lewis Stores is a registered credit provider.
          </p>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Button to="/credit/form-2" variant="text" style={{ color: 'var(--primary)', padding: 0 }}>← Edit Details</Button>
          <Button onClick={handleSubmit} variant="primary" style={{ padding: '0.9rem 2.5rem', fontWeight: 700, background: 'var(--secondary)' }}>
            Submit Application
          </Button>
        </div>
      </section>
    </main>
  )
}

/* ─────────────────────────────────────────────
   CREDIT STATUS PAGE
────────────────────────────────────────────── */
export function CreditStatusPage() {
  const { creditForm, resetCreditForm, showToast } = useShop()
  const navigate = useNavigate()
  const creditStepLabels = ['Personal Info', 'Employment', 'Review', 'Status']

  // Guard: if not submitted, redirect
  if (!creditForm.submitted) {
    return (
      <main className="page" style={{ maxWidth: '700px', textAlign: 'center' }}>
        <div style={{ padding: '4rem 2rem', background: 'var(--surface-low)', borderRadius: '6px' }}>
          <h2 style={{ color: 'var(--primary)', marginBottom: '1rem' }}>No Application Found</h2>
          <p style={{ color: 'var(--on-surface-variant)', marginBottom: '2rem' }}>Please complete the credit application form first.</p>
          <Button to="/credit/form-1" variant="primary">Start Application</Button>
        </div>
      </main>
    )
  }

  const approved = creditForm.approved
  const creditLimit = creditForm.creditLimit
  const monthly12 = Math.round(creditLimit / 12)
  const monthly24 = Math.round(creditLimit / 24)

  return (
    <main className="page stack-md" style={{ maxWidth: '1000px' }}>
      <Stepper steps={creditStepLabels} current={3} />

      {/* Result Banner */}
      <div style={{
        background: approved
          ? 'linear-gradient(135deg, #14532d 0%, #166534 100%)'
          : 'linear-gradient(135deg, var(--secondary) 0%, #a00d1c 100%)',
        color: '#fff',
        padding: '2.5rem 3rem',
        borderRadius: '6px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '1.5rem',
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {approved ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
              )}
            </div>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'rgba(255,255,255,0.85)' }}>
              Application {approved ? 'Approved' : 'Unsuccessful'}
            </span>
          </div>
          <h1 style={{ color: '#fff', fontSize: 'clamp(1.6rem, 3vw, 2.5rem)', margin: 0, lineHeight: 1.2, maxWidth: '500px' }}>
            {approved
              ? `Congratulations, ${creditForm.fullName.split(' ')[0]}! You're Approved.`
              : 'We Could Not Approve Your Application at This Time.'}
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.82)', marginTop: '0.75rem', maxWidth: '480px', lineHeight: 1.6 }}>
            {approved
              ? 'Your Lewis credit account is ready. Visit any Lewis store or shop online with your approved credit limit.'
              : 'Unfortunately your current financial profile does not meet our affordability criteria. You may reapply in 90 days.'}
          </p>
        </div>
        <div style={{ background: 'rgba(255,255,255,0.12)', padding: '1.25rem 2rem', borderRadius: '6px', textAlign: 'right', flexShrink: 0 }}>
          <p style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.7)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.25rem' }}>Reference Number</p>
          <p style={{ fontSize: '1.15rem', fontWeight: 700, letterSpacing: '0.12em' }}>{creditForm.referenceNumber}</p>
        </div>
      </div>

      {approved ? (
        <>
          {/* Credit Details */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.25rem' }}>
            <Card style={{ background: 'var(--surface-low)', border: 'none', textAlign: 'center', padding: '2rem' }}>
              <p style={{ fontSize: '0.78rem', color: 'var(--on-surface-variant)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 700, marginBottom: '0.75rem' }}>Approved Credit Limit</p>
              <p style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--primary)' }}>{formatCurrency(creditLimit)}</p>
            </Card>
            <Card style={{ background: 'var(--surface-low)', border: 'none', textAlign: 'center', padding: '2rem' }}>
              <p style={{ fontSize: '0.78rem', color: 'var(--on-surface-variant)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 700, marginBottom: '0.75rem' }}>12-Month Instalment</p>
              <p style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--primary)' }}>R {monthly12.toLocaleString('en-ZA')}<span style={{ fontSize: '1rem', fontWeight: 500 }}>/mo</span></p>
            </Card>
            <Card style={{ background: 'var(--surface-low)', border: 'none', textAlign: 'center', padding: '2rem' }}>
              <p style={{ fontSize: '0.78rem', color: 'var(--on-surface-variant)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 700, marginBottom: '0.75rem' }}>24-Month Instalment</p>
              <p style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--primary)' }}>R {monthly24.toLocaleString('en-ZA')}<span style={{ fontSize: '1rem', fontWeight: 500 }}>/mo</span></p>
            </Card>
          </div>

          {/* Submitted Information Summary */}
          <Card>
            <h3 style={{ color: 'var(--primary)', marginBottom: '1.25rem', fontSize: '1rem', borderBottom: '2px solid var(--border-color)', paddingBottom: '0.75rem' }}>Application Summary — Submitted Details</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem 2rem' }}>
              {[
                { label: 'Applicant Name', value: creditForm.fullName },
                { label: 'Contact', value: creditForm.phone },
                { label: 'Email', value: creditForm.email },
                { label: 'Employer', value: creditForm.employer },
                { label: 'Employment Type', value: creditForm.employmentType },
                { label: 'Industry', value: creditForm.industry },
                { label: 'Years at Job', value: `${creditForm.yearsAtJob} year(s)` },
                { label: 'Net Monthly Income', value: `R ${creditForm.netIncome}` },
              ].map(r => (
                <div key={r.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.6rem 0', borderBottom: '1px solid var(--border-color)' }}>
                  <span style={{ fontSize: '0.85rem', color: 'var(--on-surface-variant)' }}>{r.label}</span>
                  <span style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--on-surface)' }}>{r.value}</span>
                </div>
              ))}
            </div>
          </Card>

          {/* Next Steps */}
          <Card>
            <h3 style={{ color: 'var(--primary)', marginBottom: '1.25rem', fontSize: '1rem' }}>What Happens Next?</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {[
                'An SMS will be sent to your registered number with your account details.',
                'Visit any Lewis store with your ID and reference number to activate your account.',
                'Start shopping immediately — in-store or online.',
                'Your first statement will arrive within 30 days.',
              ].map((step, i) => (
                <div key={i} style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                  <div style={{ width: '26px', height: '26px', borderRadius: '50%', background: 'var(--secondary)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.78rem', fontWeight: 700, flexShrink: 0 }}>{i + 1}</div>
                  <p style={{ fontSize: '0.92rem', color: 'var(--on-surface-variant)', lineHeight: 1.5 }}>{step}</p>
                </div>
              ))}
            </div>
          </Card>

          <div style={{ display: 'flex', gap: '1rem' }}>
            <Button to="/products" variant="primary" style={{ flex: 1, padding: '1rem', fontWeight: 700, background: 'var(--secondary)' }}>
              Start Shopping →
            </Button>
            <Button variant="secondary" style={{ flex: 1, padding: '1rem' }} onClick={() => showToast('We\'ll send your terms document via email shortly.')}>
              View Terms & Conditions
            </Button>
          </div>
        </>
      ) : (
        <>
          <Card>
            <h3 style={{ color: 'var(--primary)', marginBottom: '1rem' }}>Why Was My Application Unsuccessful?</h3>
            <p style={{ color: 'var(--on-surface-variant)', lineHeight: 1.7, marginBottom: '1rem' }}>
              Based on the information you provided, your current disposable income does not meet our minimum affordability requirements. This could be due to:
            </p>
            <ul style={{ color: 'var(--on-surface-variant)', lineHeight: 2, paddingLeft: '1.25rem' }}>
              <li>Net income below the minimum threshold</li>
              <li>High existing monthly expenses relative to income</li>
              <li>Less than 1 year at current employer</li>
            </ul>
          </Card>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <Button to="/credit/form-1" variant="secondary" style={{ flex: 1, padding: '1rem' }}
              onClick={() => resetCreditForm()}>
              Try Again
            </Button>
            <Button to="/" variant="primary" style={{ flex: 1, padding: '1rem', fontWeight: 700 }}>
              Return to Home
            </Button>
          </div>
        </>
      )}
    </main>
  )
}

/* Aliases for backward-compatible routes */
export function CreditFinancialsPage() { return <CreditFormTwoPage /> }

/* ─────────────────────────────────────────────
   PAYMENT METHODS PAGE
────────────────────────────────────────────── */
export function PaymentMethodsPage() {
  const { showToast } = useShop()
  const [cards, setCards] = useState([
    { id: 1, type: 'Visa', last4: '4242', expiry: '12/27', isDefault: true },
    { id: 2, type: 'Mastercard', last4: '8765', expiry: '08/26', isDefault: false },
  ])
  const [showForm, setShowForm] = useState(false)
  const [newCard, setNewCard] = useState({ cardNumber: '', expiry: '', cvv: '', name: '' })

  const handleSetDefault = (id) => {
    setCards(cs => cs.map(c => ({ ...c, isDefault: c.id === id })))
    showToast('Card set as default.')
  }

  const handleRemoveCard = (id) => {
    setCards(cs => cs.filter(c => c.id !== id))
    showToast('Card removed.')
  }

  const handleAddCard = (e) => {
    e.preventDefault()
    const last4 = newCard.cardNumber.replace(/\s/g, '').slice(-4)
    const type = newCard.cardNumber.replace(/\s/g, '').startsWith('4') ? 'Visa' : 'Mastercard'
    setCards(cs => [...cs, { id: Date.now(), type, last4, expiry: newCard.expiry, isDefault: false }])
    showToast('New payment method saved successfully.')
    setShowForm(false)
    setNewCard({ cardNumber: '', expiry: '', cvv: '', name: '' })
  }

  return (
    <main className="page sidebar-layout">
      <SidePanel active={2} items={profileNavItems} />
      <section className="stack-md">
        <div>
          <h1 style={{ color: 'var(--primary)', marginBottom: '0.4rem' }}>Payment Methods</h1>
          <p style={{ color: 'var(--on-surface-variant)' }}>Manage your saved cards and payment options.</p>
        </div>

        <div className="stack-sm">
          {cards.map(card => (
            <Card key={card.id} style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', padding: '1.25rem 1.5rem' }}>
              <div style={{ width: '48px', height: '32px', background: card.type === 'Visa' ? '#1a1f71' : '#eb001b', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ color: '#fff', fontSize: '0.65rem', fontWeight: 800, letterSpacing: '0.03em' }}>{card.type.toUpperCase()}</span>
              </div>
              <div style={{ flexGrow: 1 }}>
                <p style={{ fontWeight: 600, color: 'var(--on-surface)', marginBottom: '0.15rem' }}>
                  {card.type} ending in {card.last4}
                  {card.isDefault && (
                    <span style={{ marginLeft: '0.75rem', background: 'var(--surface-low)', color: 'var(--on-surface-variant)', fontSize: '0.7rem', fontWeight: 700, padding: '0.15rem 0.5rem', borderRadius: '3px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Default</span>
                  )}
                </p>
                <p style={{ fontSize: '0.85rem', color: 'var(--on-surface-variant)' }}>Expires {card.expiry}</p>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                {!card.isDefault && (
                  <Button variant="secondary" style={{ padding: '0.35rem 0.85rem', fontSize: '0.82rem' }}
                    onClick={() => handleSetDefault(card.id)}>
                    Set Default
                  </Button>
                )}
                <Button variant="secondary" style={{ padding: '0.35rem 0.85rem', fontSize: '0.82rem', color: 'var(--secondary)', borderColor: 'var(--secondary)' }}
                  onClick={() => handleRemoveCard(card.id)}>
                  Remove
                </Button>
              </div>
            </Card>
          ))}
        </div>

        {showForm ? (
          <Card>
            <h3 style={{ color: 'var(--primary)', marginBottom: '1.5rem' }}>Add New Card</h3>
            <form className="form-grid" onSubmit={handleAddCard}>
              <div className="form-group full-width">
                <label className="form-label">Name on Card</label>
                <input type="text" placeholder="e.g. Thabo Nkosi" value={newCard.name}
                  onChange={e => setNewCard(c => ({ ...c, name: e.target.value }))} required />
              </div>
              <div className="form-group full-width">
                <label className="form-label">Card Number</label>
                <input type="text" placeholder="0000 0000 0000 0000" maxLength={19} value={newCard.cardNumber}
                  onChange={e => setNewCard(c => ({ ...c, cardNumber: e.target.value.replace(/\D/g, '').replace(/(\d{4})/g, '$1 ').trim() }))} required />
              </div>
              <div className="form-group">
                <label className="form-label">Expiry Date</label>
                <input type="text" placeholder="MM / YY" maxLength={7} value={newCard.expiry}
                  onChange={e => setNewCard(c => ({ ...c, expiry: e.target.value }))} required />
              </div>
              <div className="form-group">
                <label className="form-label">CVV</label>
                <input type="text" placeholder="000" maxLength={4} value={newCard.cvv}
                  onChange={e => setNewCard(c => ({ ...c, cvv: e.target.value }))} required />
              </div>
              <div className="full-width" style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                <Button variant="secondary" type="button" onClick={() => setShowForm(false)}>Cancel</Button>
                <Button variant="primary" type="submit">Save Card</Button>
              </div>
            </form>
          </Card>
        ) : (
          <Button variant="secondary" style={{ width: 'fit-content' }} onClick={() => setShowForm(true)}>
            + Add New Card
          </Button>
        )}
      </section>
    </main>
  )
}

/* ─────────────────────────────────────────────
   SHIPPING ADDRESSES PAGE
────────────────────────────────────────────── */
export function ShippingAddressesPage() {
  const { showToast } = useShop()
  const [addresses, setAddresses] = useState([
    { id: 1, label: 'Home', name: 'Thabo Nkosi', street: '12 Mandela Street', city: 'Sandton, Johannesburg', postal: '2196', phone: '+27 82 555 0123', isDefault: true },
    { id: 2, label: 'Work', name: 'Thabo Nkosi', street: '45 Commissioner Street', city: 'Johannesburg CBD', postal: '2001', phone: '+27 82 555 0123', isDefault: false },
  ])
  const [showForm, setShowForm] = useState(false)
  const [newAddress, setNewAddress] = useState({ label: '', name: '', street: '', city: '', postal: '', phone: '' })

  const handleAddAddress = (e) => {
    e.preventDefault()
    const id = Date.now()
    setAddresses(a => [...a, { ...newAddress, id, isDefault: false }])
    showToast('New shipping address saved.')
    setShowForm(false)
    setNewAddress({ label: '', name: '', street: '', city: '', postal: '', phone: '' })
  }

  const handleRemoveAddress = (id) => {
    setAddresses(a => a.filter(x => x.id !== id))
    showToast('Address removed.')
  }

  const handleSetDefaultAddress = (id) => {
    setAddresses(a => a.map(x => ({ ...x, isDefault: x.id === id })))
    showToast('Address set as default.')
  }

  return (
    <main className="page sidebar-layout">
      <SidePanel active={3} items={profileNavItems} />
      <section className="stack-md">
        <div>
          <h1 style={{ color: 'var(--primary)', marginBottom: '0.4rem' }}>Shipping Addresses</h1>
          <p style={{ color: 'var(--on-surface-variant)' }}>Manage your saved delivery addresses.</p>
        </div>

        <div className="stack-sm">
          {addresses.map(addr => (
            <Card key={addr.id} style={{ padding: '1.25rem 1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                    <p style={{ fontWeight: 700, color: 'var(--primary)' }}>{addr.label}</p>
                    {addr.isDefault && (
                      <span style={{ background: 'var(--surface-low)', color: 'var(--on-surface-variant)', fontSize: '0.7rem', fontWeight: 700, padding: '0.15rem 0.5rem', borderRadius: '3px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Default</span>
                    )}
                  </div>
                  <p style={{ color: 'var(--on-surface)', fontSize: '0.92rem', marginBottom: '0.2rem' }}>{addr.name}</p>
                  <p style={{ color: 'var(--on-surface-variant)', fontSize: '0.88rem' }}>{addr.street}</p>
                  <p style={{ color: 'var(--on-surface-variant)', fontSize: '0.88rem' }}>{addr.city}, {addr.postal}</p>
                  <p style={{ color: 'var(--on-surface-variant)', fontSize: '0.88rem', marginTop: '0.2rem' }}>{addr.phone}</p>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem', flexShrink: 0 }}>
                  {!addr.isDefault && (
                    <Button variant="secondary" style={{ padding: '0.35rem 0.85rem', fontSize: '0.82rem' }}
                      onClick={() => handleSetDefaultAddress(addr.id)}>
                      Set Default
                    </Button>
                  )}
                  <Button variant="secondary" style={{ padding: '0.35rem 0.85rem', fontSize: '0.82rem', color: 'var(--secondary)', borderColor: 'var(--secondary)' }}
                    onClick={() => handleRemoveAddress(addr.id)}>
                    Remove
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {showForm ? (
          <Card>
            <h3 style={{ color: 'var(--primary)', marginBottom: '1.5rem' }}>Add New Address</h3>
            <form className="form-grid" onSubmit={handleAddAddress}>
              <div className="form-group">
                <label className="form-label">Label (e.g. Home, Work)</label>
                <input type="text" placeholder="Home" value={newAddress.label}
                  onChange={e => setNewAddress(a => ({ ...a, label: e.target.value }))} required />
              </div>
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input type="text" placeholder="e.g. Thabo Nkosi" value={newAddress.name}
                  onChange={e => setNewAddress(a => ({ ...a, name: e.target.value }))} required />
              </div>
              <div className="form-group full-width">
                <label className="form-label">Street Address</label>
                <input type="text" placeholder="e.g. 12 Mandela Street" value={newAddress.street}
                  onChange={e => setNewAddress(a => ({ ...a, street: e.target.value }))} required />
              </div>
              <div className="form-group">
                <label className="form-label">City</label>
                <input type="text" placeholder="e.g. Johannesburg" value={newAddress.city}
                  onChange={e => setNewAddress(a => ({ ...a, city: e.target.value }))} required />
              </div>
              <div className="form-group">
                <label className="form-label">Postal Code</label>
                <input type="text" placeholder="e.g. 2196" value={newAddress.postal}
                  onChange={e => setNewAddress(a => ({ ...a, postal: e.target.value }))} required />
              </div>
              <div className="form-group full-width">
                <label className="form-label">Phone Number</label>
                <input type="tel" placeholder="+27 82 000 0000" value={newAddress.phone}
                  onChange={e => setNewAddress(a => ({ ...a, phone: e.target.value }))} required />
              </div>
              <div className="full-width" style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                <Button variant="secondary" type="button" onClick={() => setShowForm(false)}>Cancel</Button>
                <Button variant="primary" type="submit">Save Address</Button>
              </div>
            </form>
          </Card>
        ) : (
          <Button variant="secondary" style={{ width: 'fit-content' }} onClick={() => setShowForm(true)}>
            + Add New Address
          </Button>
        )}
      </section>
    </main>
  )
}

/* ─────────────────────────────────────────────
   SETTINGS PAGE
────────────────────────────────────────────── */
function SettingsToggle({ checked, onChange }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      style={{
        width: '44px', height: '24px', borderRadius: '12px', border: 'none', cursor: 'pointer',
        background: checked ? 'var(--primary)' : 'var(--surface-high)',
        position: 'relative', transition: 'background 0.2s', flexShrink: 0,
      }}
    >
      <span style={{
        position: 'absolute', top: '3px',
        left: checked ? '23px' : '3px',
        width: '18px', height: '18px', borderRadius: '50%',
        background: '#fff', transition: 'left 0.2s',
        boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
      }} />
    </button>
  )
}

export function SettingsPage() {
  const { showToast } = useShop()
  const [notifications, setNotifications] = useState({ orderUpdates: true, promotions: true, newsletter: false, sms: true })
  const [pwForm, setPwForm] = useState({ current: '', newPw: '', confirm: '' })
  const [pwErrors, setPwErrors] = useState({})

  const handleNotificationSave = () => {
    showToast('Notification preferences updated.')
  }

  const handlePasswordChange = (e) => {
    e.preventDefault()
    const errs = {}
    if (!pwForm.current) errs.current = 'Current password is required'
    if (!pwForm.newPw || pwForm.newPw.length < 8) errs.newPw = 'Password must be at least 8 characters long'
    if (pwForm.newPw !== pwForm.confirm) errs.confirm = 'Passwords do not match'
    setPwErrors(errs)
    if (Object.keys(errs).length === 0) {
      showToast('Password changed successfully.')
      setPwForm({ current: '', newPw: '', confirm: '' })
    }
  }

  return (
    <main className="page sidebar-layout">
      <SidePanel active={4} items={profileNavItems} />
      <section className="stack-md">
        <div>
          <h1 style={{ color: 'var(--primary)', marginBottom: '0.4rem' }}>Settings</h1>
          <p style={{ color: 'var(--on-surface-variant)' }}>Manage your account preferences and security.</p>
        </div>

        {/* Notification Preferences */}
        <Card>
          <h3 style={{ color: 'var(--primary)', marginBottom: '1.5rem' }}>Notification Preferences</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {[
              { key: 'orderUpdates', label: 'Order Updates', desc: 'Get notified about your order status changes' },
              { key: 'promotions', label: 'Promotions & Deals', desc: 'Receive alerts on sales and special offers' },
              { key: 'newsletter', label: 'Newsletter', desc: 'Monthly newsletter with new arrivals and tips' },
              { key: 'sms', label: 'SMS Notifications', desc: 'Receive important updates via SMS' },
            ].map(item => (
              <div key={item.key} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem 0', borderBottom: '1px solid var(--border-color)' }}>
                <div>
                  <p style={{ fontWeight: 600, color: 'var(--on-surface)', marginBottom: '0.2rem' }}>{item.label}</p>
                  <p style={{ fontSize: '0.85rem', color: 'var(--on-surface-variant)' }}>{item.desc}</p>
                </div>
                <SettingsToggle checked={notifications[item.key]} onChange={val => setNotifications(n => ({ ...n, [item.key]: val }))} />
              </div>
            ))}
          </div>
          <div style={{ marginTop: '1.25rem', display: 'flex', justifyContent: 'flex-end' }}>
            <Button variant="primary" onClick={handleNotificationSave}>Save Preferences</Button>
          </div>
        </Card>

        {/* Change Password */}
        <Card>
          <h3 style={{ color: 'var(--primary)', marginBottom: '1.5rem' }}>Change Password</h3>
          <form className="form-grid" onSubmit={handlePasswordChange}>
            <div className="form-group full-width">
              <label className="form-label">Current Password</label>
              <input type="password" placeholder="Enter current password" value={pwForm.current}
                onChange={e => { setPwForm(f => ({ ...f, current: e.target.value })); setPwErrors(er => ({ ...er, current: undefined })) }}
                style={{ borderColor: pwErrors.current ? 'var(--secondary)' : 'transparent' }} />
              {pwErrors.current && <p style={{ color: 'var(--secondary)', fontSize: '0.78rem', marginTop: '0.2rem' }}>{pwErrors.current}</p>}
            </div>
            <div className="form-group">
              <label className="form-label">New Password</label>
              <input type="password" placeholder="Min. 8 characters" value={pwForm.newPw}
                onChange={e => { setPwForm(f => ({ ...f, newPw: e.target.value })); setPwErrors(er => ({ ...er, newPw: undefined })) }}
                style={{ borderColor: pwErrors.newPw ? 'var(--secondary)' : 'transparent' }} />
              {pwErrors.newPw && <p style={{ color: 'var(--secondary)', fontSize: '0.78rem', marginTop: '0.2rem' }}>{pwErrors.newPw}</p>}
            </div>
            <div className="form-group">
              <label className="form-label">Confirm New Password</label>
              <input type="password" placeholder="Repeat new password" value={pwForm.confirm}
                onChange={e => { setPwForm(f => ({ ...f, confirm: e.target.value })); setPwErrors(er => ({ ...er, confirm: undefined })) }}
                style={{ borderColor: pwErrors.confirm ? 'var(--secondary)' : 'transparent' }} />
              {pwErrors.confirm && <p style={{ color: 'var(--secondary)', fontSize: '0.78rem', marginTop: '0.2rem' }}>{pwErrors.confirm}</p>}
            </div>
            <div className="full-width" style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button variant="primary" type="submit">Update Password</Button>
            </div>
          </form>
        </Card>

        {/* Danger Zone */}
        <Card style={{ border: '1px solid rgba(211,17,33,0.25)', background: 'rgba(211,17,33,0.03)' }}>
          <h3 style={{ color: 'var(--secondary)', marginBottom: '0.5rem' }}>Danger Zone</h3>
          <p style={{ color: 'var(--on-surface-variant)', fontSize: '0.9rem', marginBottom: '1.25rem' }}>
            Permanently delete your account and all associated data. This action cannot be undone.
          </p>
          <Button variant="secondary" style={{ color: 'var(--secondary)', borderColor: 'var(--secondary)' }}
            onClick={() => showToast('Please contact Lewis support to delete your account.')}>
            Delete Account
          </Button>
        </Card>
      </section>
    </main>
  )
}
