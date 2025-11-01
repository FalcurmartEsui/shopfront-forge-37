import { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { useCart } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { checkoutSchema, type CheckoutFormData } from "@/lib/validations";

const Checkout = () => {
  const { items, totalPrice, clearCart } = useCart();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });

  useEffect(() => {
    const loadUserData = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
      
      if (session?.user) {
        // Load profile data
        const { data: profile } = await supabase
          .from("profiles")
          .select("*")
          .eq("user_id", session.user.id)
          .single();

        setFormData({
          name: profile?.full_name || "",
          email: session.user.email || "",
          phone: profile?.phone || "",
          address: profile?.address || "",
        });
      }
    };
    
    loadUserData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "Please create an account",
        description: "You need to register to place an order",
        variant: "destructive",
      });
      navigate("/customer/register");
      return;
    }

    if (items.length === 0) {
      toast({
        title: "Cart is empty",
        variant: "destructive",
      });
      return;
    }

    // Validate form data
    const validation = checkoutSchema.safeParse(formData);
    if (!validation.success) {
      const firstError = validation.error.issues[0];
      toast({
        title: "Validation Error",
        description: firstError.message,
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      // Save/update profile data
      const { data: existingProfile } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (existingProfile) {
        await supabase
          .from("profiles")
          .update({
            full_name: validation.data.name,
            phone: validation.data.phone || null,
            address: validation.data.address,
          })
          .eq("user_id", user.id);
      } else {
        await supabase
          .from("profiles")
          .insert({
            user_id: user.id,
            full_name: validation.data.name,
            phone: validation.data.phone || null,
            address: validation.data.address,
          });
      }

      // Group items by seller
      const itemsBySeller = items.reduce((acc, item) => {
        if (!acc[item.seller_id]) {
          acc[item.seller_id] = [];
        }
        acc[item.seller_id].push(item);
        return acc;
      }, {} as Record<string, typeof items>);

      // Create an order for each seller
      for (const [sellerId, sellerItems] of Object.entries(itemsBySeller)) {
        const orderTotal = sellerItems.reduce(
          (sum, item) => sum + item.price * item.quantity,
          0
        );

        const { data: order, error: orderError } = await supabase
          .from("orders")
          .insert({
            user_id: user.id,
            seller_id: sellerId,
            total_amount: orderTotal,
            customer_name: validation.data.name,
            customer_email: validation.data.email,
            customer_phone: validation.data.phone || null,
            shipping_address: validation.data.address,
          })
          .select()
          .single();

        if (orderError) throw orderError;

        const orderItems = sellerItems.map((item) => ({
          order_id: order.id,
          product_id: item.id,
          quantity: item.quantity,
          price: item.price,
        }));

        const { error: itemsError } = await supabase
          .from("order_items")
          .insert(orderItems);

        if (itemsError) throw itemsError;
      }

      toast({
        title: "Order placed successfully!",
        description: "The seller will be notified",
      });

      clearCart();
      navigate("/");
    } catch (error: any) {
      toast({
        title: "Error placing order",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-16">
          <Card className="max-w-md mx-auto">
            <CardHeader>
              <CardTitle className="text-center text-3xl">Join Us!</CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <p>Create an account to complete your purchase</p>
              <Button onClick={() => navigate("/customer/register")} className="w-full">
                Create Account
              </Button>
              <Button onClick={() => navigate("/seller/auth")} variant="outline" className="w-full">
                Already have an account? Login
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8">Checkout</h1>
        <div className="grid lg:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Shipping Information</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                  placeholder="Full Name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
                <Input
                  type="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
                <Input
                  placeholder="Phone Number"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
                <Textarea
                  placeholder="Shipping Address"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  required
                />
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Processing..." : "Receive Products"}
                </Button>
              </form>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {items.map((item) => (
                  <div key={item.id} className="flex justify-between">
                    <span>{item.name} x {item.quantity}</span>
                    <span>${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
                <div className="border-t pt-4 flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span>${totalPrice.toFixed(2)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
