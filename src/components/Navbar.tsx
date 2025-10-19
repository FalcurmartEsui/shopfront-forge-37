import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Store, LogOut } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";

export const Navbar = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast({
      title: "Logged out successfully",
    });
    navigate("/");
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <Store className="h-6 w-6 text-primary" />
          <span className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Falccur Mart
          </span>
        </Link>

        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon">
            <ShoppingCart className="h-5 w-5" />
          </Button>

          {user ? (
            <>
              <Button onClick={() => navigate("/seller/dashboard")} variant="outline">
                <Store className="mr-2 h-4 w-4" />
                Dashboard
              </Button>
              <Button onClick={handleLogout} variant="ghost" size="icon">
                <LogOut className="h-5 w-5" />
              </Button>
            </>
          ) : (
            <Button onClick={() => navigate("/seller/auth")} className="bg-gradient-to-r from-primary to-secondary">
              <Store className="mr-2 h-4 w-4" />
              Become a Seller
            </Button>
          )}
        </div>
      </div>
    </nav>
  );
};
