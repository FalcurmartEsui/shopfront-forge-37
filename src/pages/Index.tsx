import { useEffect, useState } from "react";
import { Navbar } from "@/components/Navbar";
import { ProductCard } from "@/components/ProductCard";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import "./Index.css";
import heroImage from "@/assets/hero-banner.jpg";

const Index = () => {
  const [newArrivals, setNewArrivals] = useState<any[]>([]);
  const [featuredProducts, setFeaturedProducts] = useState<any[]>([]);
  const [electronics, setElectronics] = useState<any[]>([]);
  const [fashion, setFashion] = useState<any[]>([]);
  const [cosmetics, setCosmetics] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      // Load new arrivals (last 30 days, randomized)
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      
      const { data: arrivals } = await supabase
        .from("products")
        .select("*")
        .gte("created_at", thirtyDaysAgo.toISOString())
        .limit(20);

      if (arrivals) {
        // Randomize the order
        const shuffled = [...arrivals].sort(() => Math.random() - 0.5);
        setNewArrivals(shuffled.slice(0, 8));
      }

      // Load featured products
      const { data: featured } = await supabase
        .from("products")
        .select("*")
        .eq("is_featured", true)
        .limit(8);

      if (featured) setFeaturedProducts(featured);

      // Load by category
      const { data: electronicsData } = await supabase
        .from("products")
        .select("*")
        .eq("category", "Electronics")
        .limit(8);

      if (electronicsData) setElectronics(electronicsData);

      const { data: fashionData } = await supabase
        .from("products")
        .select("*")
        .eq("category", "Fashion")
        .limit(8);

      if (fashionData) setFashion(fashionData);

      const { data: cosmeticsData } = await supabase
        .from("products")
        .select("*")
        .eq("category", "Cosmetics")
        .limit(8);

      if (cosmeticsData) setCosmetics(cosmeticsData);

      setLoading(false);
    } catch (error) {
      console.error("Error loading products:", error);
      setLoading(false);
    }
  };

  const renderCategorySection = (title: string, products: any[], categoryLink: string) => {
    if (products.length === 0) return null;

    return (
      <section className="category-section">
        <div className="section-header">
          <h2 className="category-title">{title}</h2>
          <Link to={categoryLink} className="view-all-link">
            View All →
          </Link>
        </div>
        <div className="products-grid">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    );
  };

  return (
    <main className="home-page">
      <div className="marquee">
        <div className="animate-marquee whitespace-nowrap">
          🎉 Welcome to Falccur Mart - Your Campus Shopping Destination! 🎉
        </div>
      </div>

      <Navbar />

      <section
        className="hero-section"
        style={{ backgroundImage: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url(${heroImage})` }}
      >
        <div className="hero-content">
          <h1 className="hero-title">Discover Amazing Products</h1>
          <p className="hero-subtitle">Shop from trusted campus vendors</p>
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

      <div className="products-container">
        {loading ? (
          <div className="loading-state">
            <Loader2 className="loading-spinner" />
          </div>
        ) : (
          <>
            {renderCategorySection("New Arrivals", newArrivals, "/category/new-arrivals")}
            {renderCategorySection("Featured Products", featuredProducts, "/category/featured")}
            {renderCategorySection("Electronics", electronics, "/category/electronics")}
            {renderCategorySection("Fashion", fashion, "/category/fashion")}
            {renderCategorySection("Cosmetics", cosmetics, "/category/cosmetics")}
          </>
        )}
      </div>
    </main>
  );
};

export default Index;