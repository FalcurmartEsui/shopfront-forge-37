import { useEffect, useState } from "react";
import { Navbar } from "@/components/Navbar";
import { ProductCard } from "@/components/ProductCard";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, ShoppingCart } from "lucide-react";
import heroBanner from "@/assets/hero-banner.jpg";

const Index = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    const { data } = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false });

    if (data) {
      setProducts(data);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Marquee Banner */}
      <div className="marquee">
        <div className="animate-marquee whitespace-nowrap">
          Welcome to Falcur mart - The best shop to shop for all your needs
        </div>
      </div>

      <Navbar />
      
      {/* Hero Section */}
      <section 
        className="relative h-[500px] bg-cover bg-center flex items-center justify-center text-white"
        style={{ backgroundImage: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url(${heroBanner})` }}
      >
        <div className="text-center space-y-4 px-4">
          <h1 className="text-4xl md:text-5xl font-bold">Welcome to Falcur mart</h1>
          <p className="text-lg md:text-xl">The best shop to shop for all your needs</p>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-secondary py-8">
        <div className="container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                <i className="fas fa-credit-card text-primary"></i>
              </div>
              <h4 className="font-semibold text-sm">Secure payment</h4>
              <p className="text-xs text-muted-foreground">Secure online payment</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                <i className="fas fa-exchange-alt text-primary"></i>
              </div>
              <h4 className="font-semibold text-sm">7-14 days returns</h4>
              <p className="text-xs text-muted-foreground">Money back guaranteed</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                <i className="fas fa-headset text-primary"></i>
              </div>
              <h4 className="font-semibold text-sm">Customer support</h4>
              <p className="text-xs text-muted-foreground">Available 24/7</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                <i className="fas fa-truck text-primary"></i>
              </div>
              <h4 className="font-semibold text-sm">Free delivery</h4>
              <p className="text-xs text-muted-foreground">On orders over ₦100,000</p>
            </div>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section className="container py-16">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-bold mb-2">New Arrivals</h2>
            <a href="#" className="text-accent hover:underline">View all</a>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No products available yet</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Index;
