import { useEffect, useState } from "react";
import { Navbar } from "@/components/Navbar";
import { ProductCard } from "@/components/ProductCard";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";
import heroBanner from "@/assets/hero-banner.jpg";
import "./Index.css";

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

    if (data) setProducts(data);
    setLoading(false);
  };

  return (
    <div className="home-page">
      <div className="marquee">
        <div className="animate-marquee whitespace-nowrap">
          Welcome to Falcur mart - The best shop to shop for all your needs
        </div>
      </div>

      <Navbar />
      
      <section 
        className="hero-section"
        style={{ backgroundImage: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url(${heroBanner})` }}
      >
        <div className="hero-content">
          <h1 className="hero-title">Welcome to Falcur mart</h1>
          <p className="hero-subtitle">The best shop to shop for all your needs</p>
        </div>
      </section>

      <section className="features-section">
        <div className="features-grid">
          <div className="feature-item">
            <div className="feature-icon">
              <i className="fas fa-credit-card"></i>
            </div>
            <h4 className="feature-title">Secure payment</h4>
            <p className="feature-desc">Secure online payment</p>
          </div>
          <div className="feature-item">
            <div className="feature-icon">
              <i className="fas fa-exchange-alt"></i>
            </div>
            <h4 className="feature-title">7-14 days returns</h4>
            <p className="feature-desc">Money back guaranteed</p>
          </div>
          <div className="feature-item">
            <div className="feature-icon">
              <i className="fas fa-headset"></i>
            </div>
            <h4 className="feature-title">Customer support</h4>
            <p className="feature-desc">Available 24/7</p>
          </div>
          <div className="feature-item">
            <div className="feature-icon">
              <i className="fas fa-truck"></i>
            </div>
            <h4 className="feature-title">Free delivery</h4>
            <p className="feature-desc">On orders over ₦100,000</p>
          </div>
        </div>
      </section>

      <section className="products-section">
        <div className="section-header">
          <div>
            <h2 className="section-title">New Arrivals</h2>
            <a href="#" className="view-all-link">View all</a>
          </div>
        </div>

        {loading ? (
          <div className="loading-state">
            <Loader2 className="loading-spinner" />
          </div>
        ) : products.length === 0 ? (
          <div className="empty-state">
            <p>No products available yet</p>
          </div>
        ) : (
          <div className="products-grid">
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
