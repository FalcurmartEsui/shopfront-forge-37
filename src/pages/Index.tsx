import { useEffect, useState } from "react";
import { Navbar } from "@/components/Navbar";
import { ProductCard } from "@/components/ProductCard";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";
import heroBanner from "@/assets/hero-banner.jpg";

const Index = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    const { data: productsData } = await supabase
      .from("products")
      .select(`
        *,
        sellers (
          shop_name
        )
      `)
      .order("created_at", { ascending: false });

    if (productsData) {
      setProducts(productsData);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative h-[400px] overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={heroBanner}
            alt="Falccur Mart Banner"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-primary/80 to-secondary/60" />
        </div>
        <div className="relative container h-full flex items-center">
          <div className="max-w-2xl text-white">
            <h1 className="text-5xl font-bold mb-4">Welcome to Falccur Mart</h1>
            <p className="text-xl mb-6">
              Discover amazing products from trusted sellers across the marketplace
            </p>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section className="container py-12">
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2">Featured Products</h2>
          <p className="text-muted-foreground">Browse our latest collection</p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-12">
            <h3 className="text-xl font-semibold mb-2">No products yet</h3>
            <p className="text-muted-foreground">Check back soon for amazing deals!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                name={product.name}
                description={product.description || ""}
                price={product.price}
                imageUrl={product.image_url || ""}
                category={product.category}
                sellerName={product.sellers?.shop_name}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Index;
