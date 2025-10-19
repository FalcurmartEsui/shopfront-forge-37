-- Create sellers table
CREATE TABLE public.sellers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  shop_name TEXT NOT NULL,
  business_description TEXT,
  phone TEXT,
  profile_image_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable RLS on sellers
ALTER TABLE public.sellers ENABLE ROW LEVEL SECURITY;

-- Sellers can view their own data
CREATE POLICY "Sellers can view own data"
  ON public.sellers
  FOR SELECT
  USING (auth.uid() = user_id);

-- Sellers can insert their own data
CREATE POLICY "Sellers can insert own data"
  ON public.sellers
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Sellers can update their own data
CREATE POLICY "Sellers can update own data"
  ON public.sellers
  FOR UPDATE
  USING (auth.uid() = user_id);

-- Everyone can view seller info (for public display)
CREATE POLICY "Public can view sellers"
  ON public.sellers
  FOR SELECT
  USING (true);

-- Create products table
CREATE TABLE public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  seller_id UUID NOT NULL REFERENCES public.sellers(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  image_url TEXT,
  category TEXT,
  stock_quantity INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable RLS on products
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Sellers can manage their own products
CREATE POLICY "Sellers can view own products"
  ON public.products
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.sellers
      WHERE sellers.id = products.seller_id
      AND sellers.user_id = auth.uid()
    )
  );

CREATE POLICY "Sellers can insert own products"
  ON public.products
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.sellers
      WHERE sellers.id = products.seller_id
      AND sellers.user_id = auth.uid()
    )
  );

CREATE POLICY "Sellers can update own products"
  ON public.products
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.sellers
      WHERE sellers.id = products.seller_id
      AND sellers.user_id = auth.uid()
    )
  );

CREATE POLICY "Sellers can delete own products"
  ON public.products
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.sellers
      WHERE sellers.id = products.seller_id
      AND sellers.user_id = auth.uid()
    )
  );

-- Everyone can view products (for public display)
CREATE POLICY "Public can view products"
  ON public.products
  FOR SELECT
  USING (true);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_sellers_updated_at
  BEFORE UPDATE ON public.sellers
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_products_updated_at
  BEFORE UPDATE ON public.products
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();