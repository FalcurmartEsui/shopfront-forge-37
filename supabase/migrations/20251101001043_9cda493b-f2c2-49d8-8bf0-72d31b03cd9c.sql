-- Add hall_number to sellers table
ALTER TABLE public.sellers ADD COLUMN hall_number integer CHECK (hall_number >= 1 AND hall_number <= 9);

-- Add is_featured to products table
ALTER TABLE public.products ADD COLUMN is_featured boolean DEFAULT false;

-- Create product_images table for multiple images per product
CREATE TABLE public.product_images (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id uuid NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  image_url text NOT NULL,
  display_order integer NOT NULL DEFAULT 0,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS on product_images
ALTER TABLE public.product_images ENABLE ROW LEVEL SECURITY;

-- RLS policies for product_images
CREATE POLICY "Public can view product images"
  ON public.product_images
  FOR SELECT
  USING (true);

CREATE POLICY "Sellers can insert images for own products"
  ON public.product_images
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.products p
      JOIN public.sellers s ON s.id = p.seller_id
      WHERE p.id = product_images.product_id AND s.user_id = auth.uid()
    )
  );

CREATE POLICY "Sellers can delete images for own products"
  ON public.product_images
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.products p
      JOIN public.sellers s ON s.id = p.seller_id
      WHERE p.id = product_images.product_id AND s.user_id = auth.uid()
    )
  );

-- Create profiles table for customer data
CREATE TABLE public.profiles (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  full_name text,
  phone text,
  address text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- RLS policies for profiles
CREATE POLICY "Users can view own profile"
  ON public.profiles
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own profile"
  ON public.profiles
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own profile"
  ON public.profiles
  FOR UPDATE
  USING (auth.uid() = user_id);

-- Add trigger for profiles updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to handle new user profile creation
CREATE OR REPLACE FUNCTION public.handle_new_customer()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id)
  VALUES (new.id);
  RETURN new;
END;
$$;

-- Trigger to create profile for new users
CREATE TRIGGER on_auth_customer_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_customer();