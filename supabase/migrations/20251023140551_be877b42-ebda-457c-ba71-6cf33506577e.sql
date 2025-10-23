-- Create orders table
CREATE TABLE public.orders (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  seller_id UUID NOT NULL,
  total_amount NUMERIC NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT,
  shipping_address TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  admin_approved BOOLEAN DEFAULT false
);

-- Create order_items table
CREATE TABLE public.order_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES public.products(id),
  quantity INTEGER NOT NULL,
  price NUMERIC NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

-- Orders policies
CREATE POLICY "Users can view their own orders"
ON public.orders FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create orders"
ON public.orders FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Sellers can view orders for their products"
ON public.orders FOR SELECT
USING (EXISTS (
  SELECT 1 FROM sellers
  WHERE sellers.id = orders.seller_id
  AND sellers.user_id = auth.uid()
));

CREATE POLICY "Sellers can update their orders"
ON public.orders FOR UPDATE
USING (EXISTS (
  SELECT 1 FROM sellers
  WHERE sellers.id = orders.seller_id
  AND sellers.user_id = auth.uid()
));

-- Order items policies
CREATE POLICY "Users can view their order items"
ON public.order_items FOR SELECT
USING (EXISTS (
  SELECT 1 FROM orders
  WHERE orders.id = order_items.order_id
  AND orders.user_id = auth.uid()
));

CREATE POLICY "Sellers can view their order items"
ON public.order_items FOR SELECT
USING (EXISTS (
  SELECT 1 FROM orders o
  JOIN sellers s ON s.id = o.seller_id
  WHERE o.id = order_items.order_id
  AND s.user_id = auth.uid()
));

-- Trigger for updated_at
CREATE TRIGGER update_orders_updated_at
BEFORE UPDATE ON public.orders
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Enable realtime for orders (for notifications)
ALTER PUBLICATION supabase_realtime ADD TABLE public.orders;