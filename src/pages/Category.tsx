import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { ProductCard } from "@/components/ProductCard";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Loader2, ArrowLeft } from "lucide-react";
import "./Category.css";

const Category = () => {
  const { category } = useParams();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [displayCount, setDisplayCount] = useState(30);

  useEffect(() => {
    loadProducts();
  }, [category]);

  const loadProducts = async () => {
    setLoading(true);
    try {
      let query = supabase.from("products").select("*");

      if (category === "new-arrivals") {
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        query = query.gte("created_at", thirtyDaysAgo.toISOString());
      } else if (category === "featured") {
        query = query.eq("is_featured", true);
      } else {
        // Capitalize first letter for category name
        const categoryName = category?.charAt(0).toUpperCase() + category?.slice(1);
        query = query.eq("category", categoryName);
      }

      const { data } = await query.order("created_at", { ascending: false });

      if (data) {
        setProducts(data);
      }
      setLoading(false);
    } catch (error) {
      console.error("Error loading products:", error);
      setLoading(false);
    }
  };

  const getCategoryTitle = () => {
    if (!category) return "Products";
    
    if (category === "new-arrivals") return "New Arrivals";
    if (category === "featured") return "Featured Products";
    
    return category.charAt(0).toUpperCase() + category.slice(1);
  };

  const visibleProducts = products.slice(0, displayCount);
  const hasMore = products.length > displayCount;

  return (
    <div className="category-page">
      <Navbar />
      
      <div className="category-container">
        <div className="category-header">
          <Link to="/" className="back-button">
            <ArrowLeft className="h-5 w-5" />
            Back to Home
          </Link>
          <h1 className="category-page-title">{getCategoryTitle()}</h1>
          <p className="category-description">
            {products.length} {products.length === 1 ? "product" : "products"} available
          </p>
        </div>

        {loading ? (
          <div className="loading-container">
            <Loader2 className="loading-spinner" />
          </div>
        ) : products.length === 0 ? (
          <div className="empty-container">
            <p className="empty-text">No products found in this category</p>
          </div>
        ) : (
          <>
            <div className="category-products-grid">
              {visibleProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            {hasMore && (
              <div className="view-more-container">
                <Button
                  onClick={() => setDisplayCount(prev => prev + 30)}
                  className="view-more-button"
                >
                  View More Products
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Category;