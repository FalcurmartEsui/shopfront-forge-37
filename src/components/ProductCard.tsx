interface ProductCardProps {
  product: {
    name: string;
    description?: string;
    price: number;
    image_url?: string;
    category?: string;
  };
}

export const ProductCard = ({ product }: ProductCardProps) => {
  return (
    <div className="group relative overflow-hidden rounded-lg border bg-card transition-all hover:shadow-lg">
      <div className="aspect-square overflow-hidden bg-muted">
        <img
          src={product.image_url || "https://images.unsplash.com/photo-1505740420928-5e560c06d30e"}
          alt={product.name}
          className="h-full w-full object-cover transition-transform group-hover:scale-105"
        />
      </div>
      <div className="p-4 space-y-2">
        <h3 className="font-semibold text-base line-clamp-1">{product.name}</h3>
        <div className="flex items-baseline gap-1">
          <span className="text-xs text-muted-foreground">#</span>
          <span className="text-xl font-bold text-foreground">
            {product.price.toLocaleString()}
          </span>
        </div>
        {product.description && (
          <p className="text-xs text-muted-foreground line-clamp-2">{product.description}</p>
        )}
        <button className="w-full bg-primary text-primary-foreground py-2.5 px-4 rounded hover:bg-primary/90 transition-colors text-sm font-medium uppercase flex items-center justify-center gap-2">
          Add to Cart 
          <i className="fas fa-shopping-cart"></i>
        </button>
      </div>
    </div>
  );
};
