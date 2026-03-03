# PROMPT — SoloKit E-Commerce Platform

Copia questo prompt in Claude Code per costruire tutto il progetto.

---

## PROMPT START

Costruiscimi un e-commerce completo per vendere template digitali (Excel, Notion, PDF) chiamato **SoloKit** — "Run your business like a pro. Alone."

Stack: Next.js 14 App Router, TypeScript, Tailwind CSS, Supabase (DB + Auth + Storage), Stripe Checkout, Vercel deploy.

---

### ARCHITETTURA

```
solokit/
├── src/
│   ├── app/
│   │   ├── layout.tsx              # Root layout con font, metadata, analytics
│   │   ├── page.tsx                # Homepage / Landing page
│   │   ├── products/
│   │   │   └── [slug]/
│   │   │       └── page.tsx        # Pagina singolo prodotto
│   │   ├── shop/
│   │   │   └── page.tsx            # Catalogo prodotti con filtri
│   │   ├── bundles/
│   │   │   └── [slug]/
│   │   │       └── page.tsx        # Pagina bundle
│   │   ├── checkout/
│   │   │   └── success/
│   │   │       └── page.tsx        # Thank you page post-acquisto
│   │   ├── api/
│   │   │   ├── checkout/
│   │   │   │   └── route.ts        # Crea Stripe Checkout Session
│   │   │   ├── webhook/
│   │   │   │   └── route.ts        # Stripe Webhook → invia file via email
│   │   │   └── products/
│   │   │       └── route.ts        # CRUD prodotti (protetto)
│   │   ├── admin/
│   │   │   ├── layout.tsx          # Layout admin con sidebar
│   │   │   ├── page.tsx            # Dashboard admin (vendite, revenue)
│   │   │   ├── products/
│   │   │   │   ├── page.tsx        # Lista prodotti con edit/delete
│   │   │   │   └── new/
│   │   │   │       └── page.tsx    # Form nuovo prodotto
│   │   │   ├── bundles/
│   │   │   │   ├── page.tsx        # Lista bundle
│   │   │   │   └── new/
│   │   │   │       └── page.tsx    # Form nuovo bundle
│   │   │   └── orders/
│   │   │       └── page.tsx        # Lista ordini
│   │   ├── blog/
│   │   │   ├── page.tsx            # Blog listing (SEO)
│   │   │   └── [slug]/
│   │   │       └── page.tsx        # Singolo articolo blog
│   │   ├── legal/
│   │   │   ├── privacy/page.tsx
│   │   │   ├── terms/page.tsx
│   │   │   └── refund/page.tsx
│   │   └── sitemap.ts              # Sitemap dinamica
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Navbar.tsx
│   │   │   ├── Footer.tsx
│   │   │   └── MobileMenu.tsx
│   │   ├── home/
│   │   │   ├── Hero.tsx
│   │   │   ├── FeaturedProducts.tsx
│   │   │   ├── Testimonials.tsx
│   │   │   ├── HowItWorks.tsx
│   │   │   ├── FAQ.tsx
│   │   │   └── NewsletterSignup.tsx
│   │   ├── products/
│   │   │   ├── ProductCard.tsx
│   │   │   ├── ProductGallery.tsx
│   │   │   ├── PriceTag.tsx
│   │   │   └── BuyButton.tsx
│   │   ├── admin/
│   │   │   ├── ProductForm.tsx
│   │   │   ├── BundleForm.tsx
│   │   │   ├── ImageUploader.tsx
│   │   │   ├── RichTextEditor.tsx
│   │   │   └── StatsCard.tsx
│   │   └── ui/
│   │       ├── Button.tsx
│   │       ├── Badge.tsx
│   │       ├── Input.tsx
│   │       └── Modal.tsx
│   ├── lib/
│   │   ├── supabase/
│   │   │   ├── client.ts           # Browser client
│   │   │   ├── server.ts           # Server client
│   │   │   └── admin.ts            # Service role client
│   │   ├── stripe.ts               # Stripe instance + helpers
│   │   ├── email.ts                # Resend per email transazionali
│   │   └── utils.ts                # Helpers vari
│   └── types/
│       └── index.ts                # TypeScript types
├── public/
│   ├── og-image.jpg
│   └── favicon.ico
├── supabase/
│   └── migrations/
│       └── 001_initial.sql
└── .env.local.example
```

---

### DATABASE (Supabase PostgreSQL)

```sql
-- Prodotti
CREATE TABLE products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  tagline TEXT, -- breve, 1 riga
  description TEXT NOT NULL, -- descrizione lunga (markdown supportato)
  price DECIMAL(10,2) NOT NULL,
  compare_at_price DECIMAL(10,2), -- prezzo barrato (opzionale)
  currency TEXT DEFAULT 'USD',
  category TEXT NOT NULL, -- 'money', 'clients', 'productivity', 'marketing', 'career', 'life', 'niche'
  tags TEXT[], -- array di tag per filtri e SEO
  features TEXT[], -- lista feature bullet points
  images TEXT[], -- array URL immagini (Supabase Storage)
  file_url TEXT NOT NULL, -- URL file scaricabile (Supabase Storage, bucket privato)
  file_name TEXT, -- nome originale file
  stripe_price_id TEXT, -- collegamento a Stripe Price
  is_featured BOOLEAN DEFAULT false,
  is_published BOOLEAN DEFAULT false,
  seo_title TEXT, -- override titolo SEO (opzionale)
  seo_description TEXT, -- override meta description
  sales_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Bundle
CREATE TABLE bundles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  tagline TEXT,
  description TEXT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  compare_at_price DECIMAL(10,2),
  currency TEXT DEFAULT 'USD',
  images TEXT[],
  stripe_price_id TEXT,
  is_featured BOOLEAN DEFAULT false,
  is_published BOOLEAN DEFAULT false,
  seo_title TEXT,
  seo_description TEXT,
  sales_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Relazione bundle <-> prodotti
CREATE TABLE bundle_products (
  bundle_id UUID REFERENCES bundles(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  PRIMARY KEY (bundle_id, product_id)
);

-- Ordini
CREATE TABLE orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  stripe_session_id TEXT UNIQUE,
  stripe_payment_intent TEXT,
  customer_email TEXT NOT NULL,
  customer_name TEXT,
  product_id UUID REFERENCES products(id),
  bundle_id UUID REFERENCES bundles(id),
  amount DECIMAL(10,2) NOT NULL,
  currency TEXT DEFAULT 'USD',
  status TEXT DEFAULT 'completed', -- 'completed', 'refunded'
  download_count INTEGER DEFAULT 0,
  download_token TEXT UNIQUE DEFAULT gen_random_uuid()::text,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Blog posts (per SEO)
CREATE TABLE posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  excerpt TEXT,
  content TEXT NOT NULL, -- markdown
  cover_image TEXT,
  author TEXT DEFAULT 'SoloKit',
  category TEXT,
  tags TEXT[],
  is_published BOOLEAN DEFAULT false,
  seo_title TEXT,
  seo_description TEXT,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Newsletter subscribers
CREATE TABLE subscribers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  source TEXT, -- 'homepage', 'blog', 'checkout'
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Testimonianze
CREATE TABLE testimonials (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  role TEXT, -- "Freelance Designer"
  content TEXT NOT NULL,
  rating INTEGER DEFAULT 5,
  product_id UUID REFERENCES products(id),
  is_featured BOOLEAN DEFAULT false,
  is_published BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- RLS policies
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE bundles ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;

-- Public read per prodotti pubblicati
CREATE POLICY "Public can view published products" ON products
  FOR SELECT USING (is_published = true);

CREATE POLICY "Public can view published bundles" ON bundles
  FOR SELECT USING (is_published = true);

CREATE POLICY "Public can view published posts" ON posts
  FOR SELECT USING (is_published = true);

CREATE POLICY "Public can view published testimonials" ON testimonials
  FOR SELECT USING (is_published = true);

-- Admin full access (via service role, no policy needed)

-- Indexes
CREATE INDEX idx_products_slug ON products(slug);
CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_products_featured ON products(is_featured) WHERE is_featured = true;
CREATE INDEX idx_bundles_slug ON bundles(slug);
CREATE INDEX idx_posts_slug ON posts(slug);
CREATE INDEX idx_orders_email ON orders(customer_email);
```

---

### STRIPE INTEGRATION

#### Checkout Flow:
1. User clicca "Buy Now" → chiama `POST /api/checkout` con `productId` o `bundleId`
2. API crea una Stripe Checkout Session (mode: 'payment') con:
   - Il prodotto/bundle come line item
   - success_url: `/checkout/success?session_id={CHECKOUT_SESSION_ID}`
   - cancel_url: back alla pagina prodotto
   - metadata: { productId/bundleId, type: 'product'|'bundle' }
   - allow_promotion_codes: true (per futuri coupon)
3. Redirect a Stripe Checkout
4. Dopo il pagamento, Stripe manda webhook `checkout.session.completed`
5. Webhook handler:
   - Crea record in `orders`
   - Incrementa `sales_count` sul prodotto
   - Genera download link sicuro (token-based, max 5 download)
   - Invia email con link download via Resend

```typescript
// api/checkout/route.ts - esempio
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: Request) {
  const { productId, bundleId } = await req.json();
  
  // Fetch product/bundle da Supabase
  // Crea o usa stripe_price_id esistente
  
  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    payment_method_types: ['card'],
    line_items: [{
      price: stripePriceId,
      quantity: 1,
    }],
    success_url: `${process.env.NEXT_PUBLIC_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.NEXT_PUBLIC_URL}/products/${slug}`,
    customer_email: undefined, // Stripe chiederà l'email
    metadata: {
      productId: productId || '',
      bundleId: bundleId || '',
      type: productId ? 'product' : 'bundle',
    },
    allow_promotion_codes: true,
  });
  
  return Response.json({ url: session.url });
}
```

```typescript
// api/webhook/route.ts - esempio
import { headers } from 'next/headers';
import Stripe from 'stripe';

export async function POST(req: Request) {
  const body = await req.text();
  const sig = headers().get('stripe-signature')!;
  
  const event = stripe.webhooks.constructEvent(
    body, sig, process.env.STRIPE_WEBHOOK_SECRET!
  );
  
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    // 1. Salva ordine in Supabase
    // 2. Incrementa sales_count
    // 3. Genera download token
    // 4. Invia email con Resend
  }
  
  return Response.json({ received: true });
}
```

#### Download sicuro:
- Dopo l'acquisto, il cliente riceve un link tipo `/api/download?token=xxx`
- Il token è unico per ordine, max 5 download
- Il file viene servito da Supabase Storage (bucket privato) con signed URL

---

### MINI CMS ADMIN (/admin)

L'accesso admin è protetto da Supabase Auth. Un solo utente admin (hardcoded email in env).

#### Middleware di protezione:
```typescript
// middleware.ts
if (pathname.startsWith('/admin')) {
  // Check Supabase session
  // Redirect to login se non autenticato
  // Check se email === ADMIN_EMAIL env var
}
```

#### Dashboard Admin (/admin):
- Revenue totale (somma ordini)
- Ordini questo mese
- Prodotti pubblicati
- Top 5 prodotti per vendite
- Grafico revenue ultimi 30 giorni (usa Recharts)

#### Product Form (/admin/products/new):
Campi del form:
- Nome prodotto (text)
- Slug (auto-generato da nome, editabile)
- Tagline (text, 1 riga)
- Descrizione (textarea con markdown preview)
- Prezzo (number)
- Prezzo comparativo/barrato (number, opzionale)
- Categoria (select: Money, Clients, Productivity, Marketing, Career, Life, Niche)
- Tags (input con chips, comma separated)
- Features (lista dinamica, add/remove)
- Immagini (drag & drop upload multiplo → Supabase Storage bucket "product-images" pubblico)
- File prodotto (upload singolo → Supabase Storage bucket "product-files" privato)
- SEO Title (text, opzionale — se vuoto usa nome)
- SEO Description (textarea, opzionale — se vuoto usa tagline)
- Featured? (toggle)
- Published? (toggle)

Stessa struttura per Bundle Form, con in più un multi-select per scegliere i prodotti inclusi.

#### Blog Editor (/admin/posts):
- Titolo, slug, excerpt
- Content in markdown (textarea grande con preview affiancata)
- Cover image upload
- Categoria, tags
- SEO fields
- Published toggle + data pubblicazione

#### Orders (/admin/orders):
- Tabella con: data, email cliente, prodotto, importo, status
- Filtri per data e status
- Export CSV

---

### DESIGN & ESTETICA

FONDAMENTALE: il design NON deve sembrare fatto da AI. Niente gradientoni viola, niente layout generici.

#### Identità visiva:
- **Palette**: sfondo scuro (#0a0a0f, #111118), accento teal (#53C0B4), verde (#2ECC71), testi chiari
- **Font**: usa un Google Font distintivo — suggerisco "Satoshi" (da CDN) per headings e "Inter" solo per body text piccolo. In alternativa "Cabinet Grotesk" o "General Sans"
- **Vibe**: premium, dark mode, clean ma con personalità. Pensa a Linear, Raycast, Vercel come riferimento estetico
- **Angoli**: rounded-2xl generosi
- **Spacing**: generoso, tanto breathing room
- **Hover effects**: subtle, scale + shadow
- **Transizioni**: smooth su tutto (300ms ease)
- **NO**: emoji nei titoli, gradientoni, icone generiche ovunque, troppe animazioni

#### Navbar:
- Logo "SoloKit" a sinistra (testo, font bold, colore teal)
- Link: Shop, Bundles, Blog, About
- CTA button a destra: "Browse Templates"
- Mobile: hamburger con slide-in menu
- Sticky, blur background on scroll

#### Homepage sections (in ordine):
1. **Hero**: titolo grande "Templates that run your business", sottotitolo, CTA "Browse Templates", sotto mostra 3 mockup prodotti sfalsati
2. **Social proof bar**: "Join 1,000+ freelancers" + stats (opzionale, da aggiungere dopo)
3. **Featured Products**: griglia 3 colonne dei prodotti featured, card con immagine, nome, tagline, prezzo
4. **How It Works**: 3 step — "Choose your template" → "Download instantly" → "Customize & profit"
5. **Testimonials**: carousel (anche con placeholder iniziali)
6. **Categories**: griglia delle categorie (Money, Clients, ecc) con icone e conteggio prodotti
7. **Newsletter CTA**: "Get free templates & tips" + email input
8. **FAQ**: accordion con domande frequenti
9. **Footer**: link utili, social, copyright, link legali

#### Product Page:
- Gallery immagini a sinistra (carousel/grid)
- Info a destra: badge categoria, nome, tagline, prezzo (con barrato se presente), lista features con check, CTA "Buy Now — $XX", garanzia 30 giorni, "Instant download"
- Sotto: descrizione lunga (rendered markdown), testimonials del prodotto, prodotti correlati

#### Shop Page:
- Filtri sidebar: categoria, prezzo range, ordinamento
- Griglia prodotti responsive (2-3-4 colonne)
- Ogni card: immagine, nome, tagline, prezzo, badge "Best Seller" se featured

---

### SEO OPTIMIZATION

#### Metadata dinamica per ogni pagina:
```typescript
// products/[slug]/page.tsx
export async function generateMetadata({ params }): Promise<Metadata> {
  const product = await getProduct(params.slug);
  return {
    title: product.seo_title || `${product.name} — SoloKit`,
    description: product.seo_description || product.tagline,
    openGraph: {
      title: product.name,
      description: product.tagline,
      images: [product.images[0]],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: product.name,
      description: product.tagline,
      images: [product.images[0]],
    },
  };
}
```

#### Sitemap dinamica:
```typescript
// app/sitemap.ts
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const products = await getAllProducts();
  const posts = await getAllPosts();
  
  return [
    { url: 'https://solokit.co', lastModified: new Date(), priority: 1 },
    { url: 'https://solokit.co/shop', lastModified: new Date(), priority: 0.9 },
    ...products.map(p => ({
      url: `https://solokit.co/products/${p.slug}`,
      lastModified: p.updated_at,
      priority: 0.8,
    })),
    ...posts.map(p => ({
      url: `https://solokit.co/blog/${p.slug}`,
      lastModified: p.updated_at,
      priority: 0.7,
    })),
  ];
}
```

#### JSON-LD Schema per prodotti:
```typescript
// Su ogni pagina prodotto, inserisci nel <head>:
const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Product',
  name: product.name,
  description: product.tagline,
  image: product.images[0],
  offers: {
    '@type': 'Offer',
    price: product.price,
    priceCurrency: product.currency,
    availability: 'https://schema.org/InStock',
  },
  aggregateRating: product.sales_count > 0 ? {
    '@type': 'AggregateRating',
    ratingValue: '4.9',
    reviewCount: product.sales_count,
  } : undefined,
};
```

#### Altre SEO best practices:
- robots.txt con allow all + sitemap reference
- Canonical URL su ogni pagina
- Alt text su tutte le immagini
- H1 unico per pagina
- Internal linking tra prodotti correlati
- Blog posts ottimizzati per keyword long-tail tipo "best freelance expense tracker template", "how to track freelance income"
- OG images per social sharing (1200x630)
- next/image per ottimizzazione automatica immagini

---

### ENV VARIABLES

```env
# .env.local
NEXT_PUBLIC_URL=https://solokit.co
NEXT_PUBLIC_SUPABASE_URL=xxx
NEXT_PUBLIC_SUPABASE_ANON_KEY=xxx
SUPABASE_SERVICE_ROLE_KEY=xxx

STRIPE_SECRET_KEY=sk_live_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_xxx

RESEND_API_KEY=re_xxx
ADMIN_EMAIL=tua@email.com
```

---

### SERVIZI NECESSARI (tutti free tier o quasi)

1. **Vercel** — hosting Next.js (free)
2. **Supabase** — database + auth + storage (free tier: 500MB DB, 1GB storage)
3. **Stripe** — pagamenti (1.4% + €0.25 per transazione EU)
4. **Resend** — email transazionali (free: 3000 email/mese)
5. **Dominio** — solokit.co o simile (~€10/anno su Namecheap/Cloudflare)

---

### FLUSSO COMPLETO UTENTE

1. Utente arriva su solokit.co (da TikTok, Google, ecc)
2. Vede homepage con prodotti featured
3. Clicca su un prodotto → pagina prodotto con immagini, descrizione, prezzo
4. Clicca "Buy Now" → redirect a Stripe Checkout
5. Paga con carta → Stripe processa
6. Redirect a /checkout/success con messaggio "Check your email!"
7. Webhook Stripe → salva ordine → invia email con download link
8. Cliente clicca link nell'email → scarica il file (max 5 download)

### FLUSSO ADMIN

1. Vai su solokit.co/admin → login con Supabase Auth (magic link o password)
2. Dashboard con stats
3. Crea nuovo prodotto: compila form, upload immagini e file, pubblica
4. Il prodotto appare automaticamente nello shop e nella sitemap
5. Scrivi blog post per SEO
6. Monitora ordini e revenue

---

### ISTRUZIONI FINALI

- Il codice deve essere production-ready, type-safe, con error handling
- Usa Server Components dove possibile, Client Components solo dove serve interattività
- Loading states con skeleton/shimmer
- Error boundaries
- Responsive al 100% (mobile first)
- Accessibilità base (aria labels, focus states, contrast)
- Performance: lazy load immagini, prefetch link
- Nessun console.log in produzione

Costruisci tutto il progetto completo e funzionante. Inizia dal setup del progetto, poi database, poi le pagine pubbliche, poi l'admin, poi Stripe integration.