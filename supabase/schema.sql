-- ╔══════════════════════════════════════════════════════════════╗
-- ║  HERMED Dental Supplies — Supabase Database Schema         ║
-- ║  Run this SQL in Supabase Dashboard → SQL Editor            ║
-- ╚══════════════════════════════════════════════════════════════╝

-- ─── 1. PROFILES (extends auth.users) ─────────────────────────
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  name text,
  email text,
  role text default 'user' check (role in ('user', 'admin')),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.profiles enable row level security;

-- Everyone can read profiles (for admin dashboard)
create policy "Public profiles are viewable by everyone"
  on public.profiles for select using (true);

-- Users can update their own profile
create policy "Users can update own profile"
  on public.profiles for update using (auth.uid() = id);

-- Users can insert their own profile
create policy "Users can insert own profile"
  on public.profiles for insert with check (auth.uid() = id);

-- Auto-create profile on user signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, name, email, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
    new.email,
    'user'
  );
  return new;
end;
$$ language plpgsql security definer;

create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();


-- ─── 2. CATEGORIES ────────────────────────────────────────────
create table if not exists public.categories (
  id text primary key,
  name text not null,
  icon text,
  description text,
  sort_order int default 0
);

alter table public.categories enable row level security;

create policy "Categories are viewable by everyone"
  on public.categories for select using (true);

create policy "Only admins can manage categories"
  on public.categories for all using (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

-- Seed categories
insert into public.categories (id, name, icon, description, sort_order) values
  ('handpieces', 'Handpieces', '🔧', 'High & low speed handpieces', 1),
  ('instruments', 'Instruments', '🪛', 'Diagnostic & surgical tools', 2),
  ('materials', 'Materials', '🧪', 'Composites, cements & more', 3),
  ('imaging', 'Imaging', '📡', 'X-ray & digital sensors', 4),
  ('hygiene', 'Hygiene & PPE', '🧤', 'Gloves, masks & sterilization', 5),
  ('chairs', 'Dental Chairs', '🪑', 'Premium dental units', 6),
  ('orthodontics', 'Orthodontics', '🦷', 'Brackets, wires & aligners', 7),
  ('endodontics', 'Endodontics', '⚕️', 'Files, motors & apex locators', 8)
on conflict (id) do nothing;


-- ─── 3. PRODUCTS ──────────────────────────────────────────────
create table if not exists public.products (
  id bigint generated always as identity primary key,
  slug text unique not null,
  name text not null,
  category_id text references public.categories(id),
  price numeric(10,2) not null,
  original_price numeric(10,2),
  rating numeric(3,2) default 0,
  reviews int default 0,
  badge text,
  image text,
  images text[] default '{}',
  description text,
  features text[] default '{}',
  in_stock boolean default true,
  stock_count int default 0,
  sku text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.products enable row level security;

create policy "Products are viewable by everyone"
  on public.products for select using (true);

create policy "Only admins can insert products"
  on public.products for insert with check (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

create policy "Only admins can update products"
  on public.products for update using (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

create policy "Only admins can delete products"
  on public.products for delete using (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

-- Seed demo products
insert into public.products (slug, name, category_id, price, original_price, rating, reviews, badge, image, images, description, features, in_stock, stock_count, sku) values
  ('kavo-multiflex-coupler', 'KaVo Multiflex LED Coupler', 'handpieces', 245.00, 290.00, 4.8, 124, 'Best Seller',
   'https://images.unsplash.com/photo-1609840114035-3c981b782dfe?w=500&q=80',
   ARRAY['https://images.unsplash.com/photo-1609840114035-3c981b782dfe?w=800&q=80', 'https://images.unsplash.com/photo-1588776814546-1ffbb9f2f42c?w=800&q=80'],
   'The KaVo Multiflex LED Coupler provides brilliant LED illumination directly in the treatment field. Compatible with all KaVo handpieces, this coupler features a quick-connect system for fast instrument changes.',
   ARRAY['360° rotation', 'LED illumination', 'Quick-connect system', 'Autoclavable'], true, 10, 'KV-MFC-LED'),

  ('nsk-ti-max-z95l', 'NSK Ti-Max Z95L Air Turbine', 'handpieces', 389.00, null, 4.9, 87, 'New',
   'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?w=500&q=80',
   ARRAY['https://images.unsplash.com/photo-1606811841689-23dfddce3e95?w=800&q=80'],
   'NSK''s flagship air turbine handpiece with titanium body construction. Features the Optic TiMax LED system for superior illumination and anti-retraction valve for infection control.',
   ARRAY['Titanium body', 'Anti-retraction valve', 'LED optic', 'High torque'], true, 10, 'NSK-Z95L'),

  ('xcp-film-holders', 'Dentsply XCP Film Holder Kit', 'imaging', 68.50, 82.00, 4.7, 203, 'Sale',
   'https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=500&q=80',
   ARRAY['https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=800&q=80'],
   'Complete XCP film holder kit for accurate parallel technique radiography. Includes all components for anterior and posterior bitewing and periapical exposures.',
   ARRAY['Complete kit', 'Color-coded rings', 'Autoclavable', 'Bite blocks included'], true, 10, 'DENT-XCP-KIT'),

  ('3m-filtek-supreme', '3M Filtek Supreme Ultra Composite', 'materials', 112.00, null, 4.9, 341, 'Best Seller',
   'https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?w=500&q=80',
   ARRAY['https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?w=800&q=80'],
   '3M Filtek Supreme Ultra is a nanofilled composite resin offering exceptional esthetics and strength. The nanoparticle technology delivers a high polish that lasts.',
   ARRAY['Nanofilled technology', 'High polishability', 'Multiple shades', 'Low shrinkage'], true, 10, '3M-FSU-A2'),

  ('nitrile-exam-gloves', 'Medicom SafeSkin Nitrile Gloves (200pk)', 'hygiene', 24.99, 29.99, 4.6, 512, 'Sale',
   'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=500&q=80',
   ARRAY['https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=800&q=80'],
   'Powder-free nitrile examination gloves with textured fingertips for enhanced grip. FDA-cleared, AQL 1.5, ideal for dental procedures requiring tactile sensitivity.',
   ARRAY['Powder-free', 'Textured fingertips', 'AQL 1.5', 'FDA cleared'], true, 10, 'MED-NITRILE-M'),

  ('hu-friedy-gracey-curettes', 'Hu-Friedy Gracey Curette Set', 'instruments', 178.00, null, 4.9, 96, 'Professional',
   'https://images.unsplash.com/photo-1530026405186-ed1f139313f8?w=500&q=80',
   ARRAY['https://images.unsplash.com/photo-1530026405186-ed1f139313f8?w=800&q=80'],
   'The Hu-Friedy Gracey Curette set is the gold standard in periodontal instrumentation. Crafted from German surgical steel with precision-ground blades for effortless scaling.',
   ARRAY['German surgical steel', 'Ergonomic handle', 'Full set 1-18', 'Autoclavable'], true, 10, 'HF-GCY-SET'),

  ('dentsply-protaper-gold', 'Dentsply ProTaper Gold Files (6pk)', 'endodontics', 89.00, 99.00, 4.8, 178, 'New',
   'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=500&q=80',
   ARRAY['https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800&q=80'],
   'ProTaper Gold rotary files feature a proprietary gold thermal treatment that increases flexibility and cyclic fatigue resistance. Ideal for calcified and curved canals.',
   ARRAY['Gold thermal treatment', 'Improved flexibility', '25mm working length', 'NiTi alloy'], true, 10, 'DENT-PTG-F1'),

  ('ormco-damon-clear-brackets', 'Ormco Damon Clear Bracket Kit', 'orthodontics', 298.00, 350.00, 4.7, 64, 'Sale',
   'https://images.unsplash.com/photo-1606811971618-4486d14f3f99?w=500&q=80',
   ARRAY['https://images.unsplash.com/photo-1606811971618-4486d14f3f99?w=800&q=80'],
   'Damon Clear self-ligating brackets combine esthetics with the biological and clinical advantages of the Damon System. The slide mechanism reduces friction for faster treatment.',
   ARRAY['Self-ligating', 'Ceramic construction', 'Passive slide mechanism', 'Complete upper & lower'], true, 10, 'ORM-DC-KIT'),

  ('ritter-m9-autoclave', 'Midmark M9 UltraClave Autoclave', 'hygiene', 2150.00, null, 4.9, 43, 'Premium',
   'https://images.unsplash.com/photo-1583912267550-d6fef34e3e97?w=500&q=80',
   ARRAY['https://images.unsplash.com/photo-1583912267550-d6fef34e3e97?w=800&q=80'],
   'The Midmark M9 UltraClave is the most trusted autoclave in dentistry. Fully automatic gravity and vacuum cycles with advanced safety controls and digital display.',
   ARRAY['Fully automatic', 'Gravity & vacuum cycles', 'Digital display', 'FDA cleared'], true, 10, 'MDM-M9-AUTO'),

  ('planmeca-romexis-sensor', 'Planmeca ProSensor HD Digital X-Ray', 'imaging', 1890.00, 2100.00, 4.8, 29, 'Premium',
   'https://images.unsplash.com/photo-1516069677018-378515003435?w=500&q=80',
   ARRAY['https://images.unsplash.com/photo-1516069677018-378515003435?w=800&q=80'],
   'Planmeca ProSensor HD delivers the highest resolution intraoral images with minimal radiation. The thin, rounded sensor profile ensures maximum patient comfort.',
   ARRAY['Ultra-high resolution', 'Low radiation', 'Rounded edges', 'USB connection'], true, 10, 'PLM-PS-HD'),

  ('ivoclar-tetric-evoflow', 'Ivoclar Tetric EvoFlow Flowable', 'materials', 94.00, null, 4.7, 156, null,
   'https://images.unsplash.com/photo-1585435557343-3b092031a831?w=500&q=80',
   ARRAY['https://images.unsplash.com/photo-1585435557343-3b092031a831?w=800&q=80'],
   'Tetric EvoFlow is a nanohybrid flowable composite with Ivocerin photoinitiator for rapid and thorough polymerization. Ideal for small cavities and liner applications.',
   ARRAY['Nanohybrid filler', 'Ivocerin technology', 'Thixotropic consistency', '12 shades'], true, 10, 'IVO-TEF-A2'),

  ('henry-schein-explorer', 'Henry Schein Explorer & Mirror Set', 'instruments', 42.00, null, 4.5, 289, null,
   'https://images.unsplash.com/photo-1530026405186-ed1f139313f8?w=500&q=80',
   ARRAY['https://images.unsplash.com/photo-1530026405186-ed1f139313f8?w=800&q=80'],
   'Professional diagnostic set featuring a No. 23 shepherd''s hook explorer and front-surface rhodium mirror. Stainless steel construction with comfortable hex handle.',
   ARRAY['Stainless steel', 'Hex handle', 'Front-surface mirror', 'Autoclavable'], true, 10, 'HS-EXP-SET')
on conflict (slug) do nothing;


-- ─── 4. ORDERS ────────────────────────────────────────────────
create table if not exists public.orders (
  id text primary key,
  user_id uuid references auth.users(id),
  customer_name text,
  customer_email text,
  customer_phone text,
  shipping_address text,
  shipping_city text,
  shipping_country text default 'Egypt',
  notes text,
  payment_method text default 'cod',
  subtotal numeric(10,2) not null,
  shipping numeric(10,2) default 0,
  total numeric(10,2) not null,
  status text default 'Processing' check (status in ('Processing', 'Shipped', 'Delivered', 'Cancelled', 'Pending')),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.orders enable row level security;

-- Users can see their own orders
create policy "Users can view own orders"
  on public.orders for select using (auth.uid() = user_id);

-- Admins can see all orders
create policy "Admins can view all orders"
  on public.orders for select using (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

-- Users can create orders
create policy "Users can create orders"
  on public.orders for insert with check (auth.uid() = user_id);

-- Admins can update orders
create policy "Admins can update orders"
  on public.orders for update using (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );


-- ─── 5. ORDER ITEMS ──────────────────────────────────────────
create table if not exists public.order_items (
  id bigint generated always as identity primary key,
  order_id text references public.orders(id) on delete cascade,
  product_id bigint references public.products(id),
  product_name text not null,
  product_image text,
  quantity int not null,
  price numeric(10,2) not null,
  created_at timestamptz default now()
);

alter table public.order_items enable row level security;

create policy "Users can view own order items"
  on public.order_items for select using (
    exists (select 1 from public.orders where id = order_id and user_id = auth.uid())
  );

create policy "Admins can view all order items"
  on public.order_items for select using (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

create policy "Users can create order items"
  on public.order_items for insert with check (
    exists (select 1 from public.orders where id = order_id and user_id = auth.uid())
  );


-- ─── 6. WISHLIST ──────────────────────────────────────────────
create table if not exists public.wishlist (
  id bigint generated always as identity primary key,
  user_id uuid references auth.users(id) on delete cascade,
  product_id bigint references public.products(id) on delete cascade,
  created_at timestamptz default now(),
  unique(user_id, product_id)
);

alter table public.wishlist enable row level security;

create policy "Users can view own wishlist"
  on public.wishlist for select using (auth.uid() = user_id);

create policy "Users can add to own wishlist"
  on public.wishlist for insert with check (auth.uid() = user_id);

create policy "Users can remove from own wishlist"
  on public.wishlist for delete using (auth.uid() = user_id);


-- ─── 7. CONTACT MESSAGES ─────────────────────────────────────
create table if not exists public.contact_messages (
  id bigint generated always as identity primary key,
  name text not null,
  email text not null,
  subject text,
  message text not null,
  is_read boolean default false,
  created_at timestamptz default now()
);

alter table public.contact_messages enable row level security;

-- Anyone can insert a message
create policy "Anyone can send a contact message"
  on public.contact_messages for insert with check (true);

-- Only admins can read messages
create policy "Admins can view messages"
  on public.contact_messages for select using (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

create policy "Admins can update messages"
  on public.contact_messages for update using (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );


-- ─── 8. STORAGE BUCKET ──────────────────────────────────────
-- Create a public bucket for product images
insert into storage.buckets (id, name, public) values ('products', 'products', true)
on conflict (id) do nothing;

-- Allow everyone to view product images  
create policy "Product images are publicly accessible"
  on storage.objects for select using (bucket_id = 'products');

-- Only admins can upload product images
create policy "Only admins can upload product images"
  on storage.objects for insert with check (
    bucket_id = 'products' and
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

create policy "Only admins can delete product images"
  on storage.objects for delete using (
    bucket_id = 'products' and
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );


-- ═══════════════════════════════════════════════════════════════
-- IMPORTANT: After running this schema, sign up with your email
-- then run this to make yourself admin:
--
--   UPDATE public.profiles SET role = 'admin' WHERE email = 'YOUR_EMAIL';
--
-- ═══════════════════════════════════════════════════════════════
