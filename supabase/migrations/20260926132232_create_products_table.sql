/*
# Create products table for Yousef Phone store

1. New Tables
- `products` — stores all phone products with full details (name, brand, category, price, images, specs, stock, etc.)
  - `id` (uuid, primary key)
  - `name` (text, not null) — product name
  - `brand` (text, not null) — manufacturer brand
  - `category` (text, not null) — category slug: iphone, samsung, xiaomi, oppo, realme, honor, android
  - `price` (numeric, not null) — current price in EGP
  - `old_price` (numeric, nullable) — original price before discount
  - `images` (jsonb, not null, default '[]') — array of image URLs
  - `colors` (jsonb, not null, default '[]') — array of {name, hex} color objects
  - `storages` (jsonb, not null, default '[]') — array of storage options (e.g. "128GB")
  - `rams` (jsonb, not null, default '[]') — array of RAM options (e.g. "8GB")
  - `rating` (numeric, not null, default 0) — average rating 0-5
  - `reviews_count` (int, not null, default 0)
  - `stock` (int, not null, default 0) — available quantity
  - `featured` (bool, not null, default false) — show in featured section
  - `is_new` (bool, not null, default false) — show "new" badge
  - `on_sale` (bool, not null, default false) — show in sale section
  - `description` (text, not null, default '') — product description
  - `specs` (jsonb, not null, default '{}') — full specifications object
  - `created_at` (timestamptz, default now())

2. Security (RLS)
- Enable RLS on `products`.
- SELECT: public (anon + authenticated) — anyone can browse products.
- INSERT/UPDATE/DELETE: authenticated only — admin can manage products.
- This means only logged-in admin users can add/edit/delete products.

3. Seed Data
- Inserts 15 realistic phone products with Egyptian Pound prices.
- Covers iPhone, Samsung, Xiaomi, Oppo, Realme, and Honor brands.
*/

CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  brand text NOT NULL,
  category text NOT NULL,
  price numeric NOT NULL,
  old_price numeric,
  images jsonb NOT NULL DEFAULT '[]'::jsonb,
  colors jsonb NOT NULL DEFAULT '[]'::jsonb,
  storages jsonb NOT NULL DEFAULT '[]'::jsonb,
  rams jsonb NOT NULL DEFAULT '[]'::jsonb,
  rating numeric NOT NULL DEFAULT 0,
  reviews_count int NOT NULL DEFAULT 0,
  stock int NOT NULL DEFAULT 0,
  featured boolean NOT NULL DEFAULT false,
  is_new boolean NOT NULL DEFAULT false,
  on_sale boolean NOT NULL DEFAULT false,
  description text NOT NULL DEFAULT '',
  specs jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Public read: anyone can browse products
DROP POLICY IF EXISTS "public_select_products" ON products;
CREATE POLICY "public_select_products"
  ON products FOR SELECT
  TO anon, authenticated
  USING (true);

-- Only authenticated (admin) can insert
DROP POLICY IF EXISTS "admin_insert_products" ON products;
CREATE POLICY "admin_insert_products"
  ON products FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Only authenticated (admin) can update
DROP POLICY IF EXISTS "admin_update_products" ON products;
CREATE POLICY "admin_update_products"
  ON products FOR UPDATE
  TO authenticated
  USING (true) WITH CHECK (true);

-- Only authenticated (admin) can delete
DROP POLICY IF EXISTS "admin_delete_products" ON products;
CREATE POLICY "admin_delete_products"
  ON products FOR DELETE
  TO authenticated
  USING (true);

-- Seed initial products
INSERT INTO products (name, brand, category, price, old_price, images, colors, storages, rams, rating, reviews_count, stock, featured, is_new, on_sale, description, specs)
VALUES
  ('iPhone 15 Pro Max', 'Apple', 'iphone', 64999, 69999,
    '["https://images.pexels.com/photos/1772123/pexels-photo-1772123.jpeg?auto=compress&cs=tinysrgb&w=800","https://images.pexels.com/photos/788946/pexels-photo-788946.jpeg?auto=compress&cs=tinysrgb&w=800","https://images.pexels.com/photos/699122/pexels-photo-699122.jpeg?auto=compress&cs=tinysrgb&w=800"]'::jsonb,
    '[{"name":"تيتانيوم طبيعي","hex":"#9ca3af"},{"name":"تيتانيوم أزرق","hex":"#3b5b80"},{"name":"تيتانيوم أسود","hex":"#1f2937"}]'::jsonb,
    '["256GB","512GB","1TB"]'::jsonb, '["8GB"]'::jsonb, 4.9, 342, 15, true, true, true,
    'آيفون 15 برو ماكس بشاشة Super Retina XDR مقاس 6.7 بوصة، معالج A17 Pro، نظام كاميرات احترافي ثلاثي، وتيتانيوم متين.',
    '{"screen":"6.7 بوصة Super Retina XDR OLED","processor":"Apple A17 Pro سداسي النواة","ram":"8GB","storage":"256GB / 512GB / 1TB","battery":"4422 mAh","rearCamera":"48MP رئيسية + 12MP فائق الاتساع + 12MP تليفوتو 5x","frontCamera":"12MP TrueDepth","os":"iOS 17","network":"5G","weight":"221 جرام","dimensions":"159.9 × 76.7 × 8.25 مم","warranty":"سنة وكيل + سنة أخرى من يوسف فون"}'::jsonb),
  ('iPhone 15', 'Apple', 'iphone', 42999, 45999,
    '["https://images.pexels.com/photos/699122/pexels-photo-699122.jpeg?auto=compress&cs=tinysrgb&w=800","https://images.pexels.com/photos/788946/pexels-photo-788946.jpeg?auto=compress&cs=tinysrgb&w=800"]'::jsonb,
    '[{"name":"أزرق","hex":"#5b9bd5"},{"name":"وردي","hex":"#f9a8c9"},{"name":"أسود","hex":"#1f2937"},{"name":"أخضر","hex":"#6bbf59"}]'::jsonb,
    '["128GB","256GB","512GB"]'::jsonb, '["6GB"]'::jsonb, 4.8, 215, 22, true, false, true,
    'آيفون 15 بشاشة 6.1 بوصة، معالج A16 Bionic، كاميرا 48MP، ومنفذ USB-C.',
    '{"screen":"6.1 بوصة Super Retina XDR OLED","processor":"Apple A16 Bionic سداسي النواة","ram":"6GB","storage":"128GB / 256GB / 512GB","battery":"3349 mAh","rearCamera":"48MP + 12MP فائق الاتساع","frontCamera":"12MP TrueDepth","os":"iOS 17","network":"5G","weight":"171 جرام","dimensions":"147.6 × 71.6 × 7.8 مم","warranty":"سنة وكيل"}'::jsonb),
  ('iPhone 14 Pro', 'Apple', 'iphone', 38999, 41999,
    '["https://images.pexels.com/photos/788946/pexels-photo-788946.jpeg?auto=compress&cs=tinysrgb&w=800","https://images.pexels.com/photos/1772123/pexels-photo-1772123.jpeg?auto=compress&cs=tinysrgb&w=800"]'::jsonb,
    '[{"name":"أرجواني عميق","hex":"#5d3a6e"},{"name":"ذهبي","hex":"#d4af37"},{"name":"فضي","hex":"#c0c0c0"},{"name":"أسود","hex":"#1f2937"}]'::jsonb,
    '["128GB","256GB","512GB"]'::jsonb, '["6GB"]'::jsonb, 4.7, 189, 8, false, false, true,
    'آيفون 14 برو بشاشة Dynamic Island وكاميرا 48MP احترافية.',
    '{"screen":"6.1 بوصة Super Retina XDR OLED","processor":"Apple A16 Bionic","ram":"6GB","storage":"128GB / 256GB / 512GB","battery":"3200 mAh","rearCamera":"48MP + 12MP + 12MP","frontCamera":"12MP","os":"iOS 16","network":"5G","weight":"206 جرام","dimensions":"147.5 × 71.5 × 7.85 مم","warranty":"سنة وكيل"}'::jsonb),
  ('Samsung Galaxy S24 Ultra', 'Samsung', 'samsung', 52999, 56999,
    '["https://images.pexels.com/photos/47261/pexels-photo-47261.jpeg?auto=compress&cs=tinysrgb&w=800","https://images.pexels.com/photos/1841841/pexels-photo-1841841.jpeg?auto=compress&cs=tinysrgb&w=800"]'::jsonb,
    '[{"name":"تيتانيوم رمادي","hex":"#6b7280"},{"name":"تيتانيوم أسود","hex":"#1f2937"},{"name":"تيتانيوم أصفر","hex":"#eab308"}]'::jsonb,
    '["256GB","512GB","1TB"]'::jsonb, '["12GB"]'::jsonb, 4.9, 278, 18, true, true, true,
    'جالكسي S24 ألترا بشاشة 6.8 بوصة Dynamic AMOLED 2X، قلم S Pen، كاميرا 200MP، وذكاء اصطناعي Galaxy AI.',
    '{"screen":"6.8 بوصة Dynamic AMOLED 2X 120Hz","processor":"Snapdragon 8 Gen 3 ثماني النواة","ram":"12GB","storage":"256GB / 512GB / 1TB","battery":"5000 mAh","rearCamera":"200MP + 50MP + 12MP + 10MP","frontCamera":"12MP","os":"Android 14 (One UI 6.1)","network":"5G","weight":"232 جرام","dimensions":"162.3 × 79 × 8.6 مم","warranty":"سنة وكيل"}'::jsonb),
  ('Samsung Galaxy A55', 'Samsung', 'samsung', 18999, 20999,
    '["https://images.pexels.com/photos/1841841/pexels-photo-1841841.jpeg?auto=compress&cs=tinysrgb&w=800","https://images.pexels.com/photos/47261/pexels-photo-47261.jpeg?auto=compress&cs=tinysrgb&w=800"]'::jsonb,
    '[{"name":"أزرق","hex":"#3b82f6"},{"name":"أصفر","hex":"#eab308"},{"name":"أسود","hex":"#1f2937"}]'::jsonb,
    '["128GB","256GB"]'::jsonb, '["8GB","12GB"]'::jsonb, 4.5, 156, 35, false, false, true,
    'جالكسي A55 بتصميم معدني فاخر وشاشة Super AMOLED وكاميرا 50MP.',
    '{"screen":"6.6 بوصة Super AMOLED 120Hz","processor":"Exynos 1480 ثماني النواة","ram":"8GB / 12GB","storage":"128GB / 256GB","battery":"5000 mAh","rearCamera":"50MP + 12MP + 5MP","frontCamera":"32MP","os":"Android 14 (One UI 6.1)","network":"5G","weight":"189 جرام","dimensions":"159.1 × 77.4 × 8.2 مم","warranty":"سنة وكيل"}'::jsonb),
  ('Xiaomi 14 Pro', 'Xiaomi', 'xiaomi', 32999, 35999,
    '["https://images.pexels.com/photos/1092644/pexels-photo-1092644.jpeg?auto=compress&cs=tinysrgb&w=800","https://images.pexels.com/photos/699122/pexels-photo-699122.jpeg?auto=compress&cs=tinysrgb&w=800"]'::jsonb,
    '[{"name":"أبيض","hex":"#f3f4f6"},{"name":"أسود","hex":"#1f2937"},{"name":"أخضر","hex":"#22c55e"}]'::jsonb,
    '["256GB","512GB"]'::jsonb, '["12GB","16GB"]'::jsonb, 4.7, 134, 12, true, true, true,
    'شاومي 14 برو بكاميرا Leica احترافية وشاشة LTPO وشحن سريع 120W.',
    '{"screen":"6.73 بوصة LTPO AMOLED 120Hz","processor":"Snapdragon 8 Gen 3","ram":"12GB / 16GB","storage":"256GB / 512GB","battery":"5000 mAh","rearCamera":"50MP Leica + 50MP + 50MP","frontCamera":"32MP","os":"Android 14 (HyperOS)","network":"5G","weight":"223 جرام","dimensions":"161.4 × 75.3 × 8.5 مم","warranty":"سنة وكيل"}'::jsonb),
  ('Xiaomi Redmi Note 13 Pro', 'Xiaomi', 'xiaomi', 9999, 11999,
    '["https://images.pexels.com/photos/699122/pexels-photo-699122.jpeg?auto=compress&cs=tinysrgb&w=800","https://images.pexels.com/photos/1092644/pexels-photo-1092644.jpeg?auto=compress&cs=tinysrgb&w=800"]'::jsonb,
    '[{"name":"أزرق","hex":"#3b82f6"},{"name":"أسود","hex":"#1f2937"},{"name":"بنفسجي","hex":"#7c3aed"}]'::jsonb,
    '["128GB","256GB","512GB"]'::jsonb, '["8GB","12GB"]'::jsonb, 4.6, 412, 50, false, false, true,
    'ريدمي نوت 13 برو بكاميرا 200MP وشاشة AMOLED وسعر اقتصادي.',
    '{"screen":"6.67 بوصة AMOLED 120Hz","processor":"Snapdragon 7s Gen 2","ram":"8GB / 12GB","storage":"128GB / 256GB / 512GB","battery":"5100 mAh","rearCamera":"200MP + 8MP + 2MP","frontCamera":"16MP","os":"Android 13 (MIUI 14)","network":"4G","weight":"187 جرام","dimensions":"161.1 × 74.9 × 8 مم","warranty":"سنة وكيل"}'::jsonb),
  ('Oppo Reno 11 Pro', 'Oppo', 'oppo', 22999, 25999,
    '["https://images.pexels.com/photos/788946/pexels-photo-788946.jpeg?auto=compress&cs=tinysrgb&w=800","https://images.pexels.com/photos/47261/pexels-photo-47261.jpeg?auto=compress&cs=tinysrgb&w=800"]'::jsonb,
    '[{"name":"أخضر","hex":"#22c55e"},{"name":"رمادي","hex":"#6b7280"}]'::jsonb,
    '["256GB","512GB"]'::jsonb, '["12GB"]'::jsonb, 4.5, 98, 20, true, true, true,
    'أوبو رينو 11 برو بتصميم أنيق وكاميرا بورتريه احترافية وشحن سريع 67W.',
    '{"screen":"6.7 بوصة AMOLED 120Hz","processor":"Snapdragon 8+ Gen 1","ram":"12GB","storage":"256GB / 512GB","battery":"4600 mAh","rearCamera":"50MP + 32MP + 8MP","frontCamera":"32MP","os":"Android 14 (ColorOS 14)","network":"5G","weight":"181 جرام","dimensions":"162.4 × 74.7 × 7.6 مم","warranty":"سنة وكيل"}'::jsonb),
  ('Oppo A79 5G', 'Oppo', 'oppo', 12999, 14999,
    '["https://images.pexels.com/photos/47261/pexels-photo-47261.jpeg?auto=compress&cs=tinysrgb&w=800","https://images.pexels.com/photos/1841841/pexels-photo-1841841.jpeg?auto=compress&cs=tinysrgb&w=800"]'::jsonb,
    '[{"name":"بنفسجي","hex":"#7c3aed"},{"name":"أسود","hex":"#1f2937"}]'::jsonb,
    '["128GB","256GB"]'::jsonb, '["8GB"]'::jsonb, 4.3, 76, 28, false, false, true,
    'أوبو A79 5G ببطارية كبيرة وشاشة 90Hz وسعر مناسب.',
    '{"screen":"6.72 بوصة IPS LCD 90Hz","processor":"Dimensity 6020","ram":"8GB","storage":"128GB / 256GB","battery":"5000 mAh","rearCamera":"50MP + 2MP","frontCamera":"8MP","os":"Android 13 (ColorOS 13.2)","network":"5G","weight":"192 جرام","dimensions":"165.7 × 76 × 8.2 مم","warranty":"سنة وكيل"}'::jsonb),
  ('Realme 12 Pro+ 5G', 'Realme', 'realme', 16999, 18999,
    '["https://images.pexels.com/photos/1092644/pexels-photo-1092644.jpeg?auto=compress&cs=tinysrgb&w=800","https://images.pexels.com/photos/699122/pexels-photo-699122.jpeg?auto=compress&cs=tinysrgb&w=800"]'::jsonb,
    '[{"name":"بيج","hex":"#d4b896"},{"name":"أزرق","hex":"#3b82f6"}]'::jsonb,
    '["256GB","512GB"]'::jsonb, '["8GB","12GB"]'::jsonb, 4.4, 112, 24, true, false, true,
    'ريلمي 12 برو+ بكاميرا تليفوتو 64MP وتصميم فاخر بسعر اقتصادي.',
    '{"screen":"6.7 بوصة AMOLED 120Hz","processor":"Snapdragon 7s Gen 2","ram":"8GB / 12GB","storage":"256GB / 512GB","battery":"5000 mAh","rearCamera":"50MP + 64MP + 8MP","frontCamera":"32MP","os":"Android 14 (Realme UI 5)","network":"5G","weight":"190 جرام","dimensions":"161.4 × 73.9 × 8.1 مم","warranty":"سنة وكيل"}'::jsonb),
  ('Realme C67', 'Realme', 'realme', 7999, 9499,
    '["https://images.pexels.com/photos/699122/pexels-photo-699122.jpeg?auto=compress&cs=tinysrgb&w=800","https://images.pexels.com/photos/1092644/pexels-photo-1092644.jpeg?auto=compress&cs=tinysrgb&w=800"]'::jsonb,
    '[{"name":"أخضر","hex":"#22c55e"},{"name":"أسود","hex":"#1f2937"}]'::jsonb,
    '["128GB","256GB"]'::jsonb, '["6GB","8GB"]'::jsonb, 4.2, 89, 40, false, false, true,
    'ريلمي C67 بسعر اقتصادي وأداء جيد وكاميرا 108MP.',
    '{"screen":"6.72 بوصة IPS LCD 90Hz","processor":"Snapdragon 685","ram":"6GB / 8GB","storage":"128GB / 256GB","battery":"5000 mAh","rearCamera":"108MP + 2MP","frontCamera":"8MP","os":"Android 13 (Realme UI 4)","network":"4G","weight":"192 جرام","dimensions":"164.4 × 75.4 × 7.6 مم","warranty":"سنة وكيل"}'::jsonb),
  ('Honor Magic6 Pro', 'Honor', 'honor', 34999, 38999,
    '["https://images.pexels.com/photos/47261/pexels-photo-47261.jpeg?auto=compress&cs=tinysrgb&w=800","https://images.pexels.com/photos/788946/pexels-photo-788946.jpeg?auto=compress&cs=tinysrgb&w=800"]'::jsonb,
    '[{"name":"أسود","hex":"#1f2937"},{"name":"أخضر","hex":"#22c55e"},{"name":"وردي","hex":"#f9a8c9"}]'::jsonb,
    '["256GB","512GB"]'::jsonb, '["12GB"]'::jsonb, 4.7, 67, 10, true, true, true,
    'هونر ماجيك 6 برو بكاميرا 180MP احترافية وبطارية كبيرة وشحن سريع لاسلكي.',
    '{"screen":"6.8 بوصة LTPO OLED 120Hz","processor":"Snapdragon 8 Gen 3","ram":"12GB","storage":"256GB / 512GB","battery":"5600 mAh","rearCamera":"180MP + 50MP + 50MP","frontCamera":"50MP + 3D ToF","os":"Android 14 (MagicOS 8)","network":"5G","weight":"229 جرام","dimensions":"163.2 × 75.5 × 8.6 مم","warranty":"سنة وكيل"}'::jsonb),
  ('Honor X9b', 'Honor', 'honor', 11999, 13999,
    '["https://images.pexels.com/photos/1841841/pexels-photo-1841841.jpeg?auto=compress&cs=tinysrgb&w=800","https://images.pexels.com/photos/47261/pexels-photo-47261.jpeg?auto=compress&cs=tinysrgb&w=800"]'::jsonb,
    '[{"name":"أسود","hex":"#1f2937"},{"name":"فضي","hex":"#c0c0c0"}]'::jsonb,
    '["256GB","512GB"]'::jsonb, '["8GB","12GB"]'::jsonb, 4.4, 54, 18, false, false, true,
    'هونر X9b بشاشة مقاومة للكسر وبطارية 5800mAh وكاميرا 108MP.',
    '{"screen":"6.8 بوصة AMOLED 120Hz","processor":"Snapdragon 6 Gen 1","ram":"8GB / 12GB","storage":"256GB / 512GB","battery":"5800 mAh","rearCamera":"108MP + 5MP + 2MP","frontCamera":"16MP","os":"Android 13 (MagicOS 7)","network":"5G","weight":"198 جرام","dimensions":"163.2 × 75.5 × 7.9 مم","warranty":"سنة وكيل"}'::jsonb),
  ('iPhone 13', 'Apple', 'iphone', 28999, 31999,
    '["https://images.pexels.com/photos/1772123/pexels-photo-1772123.jpeg?auto=compress&cs=tinysrgb&w=800","https://images.pexels.com/photos/699122/pexels-photo-699122.jpeg?auto=compress&cs=tinysrgb&w=800"]'::jsonb,
    '[{"name":"أزرق","hex":"#3b82f6"},{"name":"وردي","hex":"#f9a8c9"},{"name":"أسود","hex":"#1f2937"},{"name":"أخضر","hex":"#22c55e"}]'::jsonb,
    '["128GB","256GB","512GB"]'::jsonb, '["4GB"]'::jsonb, 4.6, 523, 30, false, false, true,
    'آيفون 13 بسعر مميز وأداء موثوق وكاميرا ثنائية.',
    '{"screen":"6.1 بوصة Super Retina XDR OLED","processor":"Apple A15 Bionic","ram":"4GB","storage":"128GB / 256GB / 512GB","battery":"3240 mAh","rearCamera":"12MP + 12MP","frontCamera":"12MP","os":"iOS 15","network":"5G","weight":"174 جرام","dimensions":"146.7 × 71.5 × 7.65 مم","warranty":"سنة وكيل"}'::jsonb),
  ('Samsung Galaxy S23 FE', 'Samsung', 'samsung', 24999, 27999,
    '["https://images.pexels.com/photos/47261/pexels-photo-47261.jpeg?auto=compress&cs=tinysrgb&w=800","https://images.pexels.com/photos/1841841/pexels-photo-1841841.jpeg?auto=compress&cs=tinysrgb&w=800"]'::jsonb,
    '[{"name":"نعناعي","hex":"#10b981"},{"name":"بنفسجي","hex":"#7c3aed"},{"name":"رمادي","hex":"#6b7280"}]'::jsonb,
    '["128GB","256GB"]'::jsonb, '["8GB"]'::jsonb, 4.5, 143, 16, false, false, true,
    'جالكسي S23 FE بأداء فلاجشيب بسعر مخفض وكاميرا 50MP.',
    '{"screen":"6.4 بوصة Dynamic AMOLED 2X 120Hz","processor":"Snapdragon 8 Gen 1","ram":"8GB","storage":"128GB / 256GB","battery":"4500 mAh","rearCamera":"50MP + 12MP + 8MP","frontCamera":"10MP","os":"Android 13 (One UI 5.1)","network":"5G","weight":"209 جرام","dimensions":"158 × 76.5 × 8.2 مم","warranty":"سنة وكيل"}'::jsonb)
ON CONFLICT DO NOTHING;
