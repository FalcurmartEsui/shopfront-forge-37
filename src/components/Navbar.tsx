import { Link, useNavigate } from "react-router-dom";
import { ShoppingCart, Store, LogOut } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";
import { useCart } from "@/contexts/CartContext";
import "./Navbar.css";

export const Navbar = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { totalItems } = useCart();
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
    toast({ title: "Logged out successfully" });
    navigate("/");
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand">
          <Store size={24} style={{ marginRight: '8px', display: 'inline-block', verticalAlign: 'middle' }} />
          <span>Falccur Mart</span>
        </Link>

        <div className="navbar-menu">
          <button onClick={() => navigate("/cart")} className="cart-button">
            <ShoppingCart size={20} />
            {totalItems > 0 && <span className="cart-badge">{totalItems}</span>}
          </button>

          {user ? (
            <>
              <button onClick={() => navigate("/seller/dashboard")} className="dashboard-button">
                <Store size={16} style={{ marginRight: '8px' }} />
                Dashboard
              </button>
              <button onClick={handleLogout} className="logout-button">
                <LogOut size={20} />
              </button>
            </>
          ) : (
            <button onClick={() => navigate("/seller/auth")} className="seller-button">
              <Store size={16} style={{ marginRight: '8px' }} />
              Become a Seller
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};
