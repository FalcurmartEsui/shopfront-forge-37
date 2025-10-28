import { useCart } from "@/contexts/CartContext";
import { useToast } from "@/hooks/use-toast";
import "./ProductCard.css";

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    description?: string;
    price: number;
    image_url?: string;
    category?: string;
    seller_id: string;
  };
}

export const ProductCard = ({ product }: ProductCardProps) => {
  const { addToCart } = useCart();
  const { toast } = useToast();

  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image_url: product.image_url || "/placeholder.svg",
      seller_id: product.seller_id,
    });
    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart`,
    });
  };

  return (
    <article className="product-card">
      <div className="product-image-wrapper">
        <img
          src={product.image_url || "https://images.unsplash.com/photo-1505740420928-5e560c06d30e"}
          alt={product.name}
          className="product-image"
        />
      </div>
      <div className="product-content">
        <h3 className="product-name">{product.name}</h3>
        <div className="product-price-wrapper">
          <span className="currency-symbol">#</span>
          <span className="product-price">{product.price.toLocaleString()}</span>
        </div>
        {product.description && (
          <p className="product-description">{product.description}</p>
        )}
        <button onClick={handleAddToCart} className="add-to-cart-button">
          Add to Cart 
          <i className="fas fa-shopping-cart"></i>
        </button>
      </div>
    </article>
  );
};
