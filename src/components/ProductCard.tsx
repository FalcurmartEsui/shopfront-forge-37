import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart } from "lucide-react";

interface ProductCardProps {
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  category?: string;
  sellerName?: string;
}

export const ProductCard = ({
  name,
  description,
  price,
  imageUrl,
  category,
  sellerName,
}: ProductCardProps) => {
  return (
    <Card className="overflow-hidden transition-all duration-300 hover:shadow-lg border-border">
      <div className="aspect-square overflow-hidden bg-muted">
        <img
          src={imageUrl || "/placeholder.svg"}
          alt={name}
          className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
        />
      </div>
      <CardContent className="p-4">
        <div className="space-y-2">
          {category && (
            <Badge variant="secondary" className="text-xs">
              {category}
            </Badge>
          )}
          <h3 className="font-semibold text-lg line-clamp-1">{name}</h3>
          <p className="text-sm text-muted-foreground line-clamp-2">{description}</p>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-primary">₦{price.toLocaleString()}</span>
          </div>
          {sellerName && (
            <p className="text-xs text-muted-foreground">by {sellerName}</p>
          )}
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button className="w-full bg-gradient-to-r from-primary to-secondary">
          <ShoppingCart className="mr-2 h-4 w-4" />
          Add to Cart
        </Button>
      </CardFooter>
    </Card>
  );
};
