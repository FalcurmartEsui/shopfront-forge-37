import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { loginSchema } from "@/lib/validations";

const CustomerRegister = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleScroll = () => {
    const scrollY = window.scrollY;
    if (scrollY > 200) {
      setShowForm(true);
    }
  };

  useState(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  });

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Validate input
    const validation = loginSchema.safeParse({ email, password });

    if (!validation.success) {
      const firstError = validation.error.issues[0];
      toast({
        title: "Validation Error",
        description: firstError.message,
        variant: "destructive",
      });
      setLoading(false);
      return;
    }

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
        },
      });

      if (error) throw error;

      toast({
        title: "Account created!",
        description: "Welcome to Falccur Mart",
      });

      navigate("/checkout");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Dancing Animation Section */}
      <div className="h-screen flex items-center justify-center bg-gradient-to-br from-primary/20 to-secondary/20">
        <div className="text-center space-y-8">
          <div className="animate-bounce">
            <div className="text-9xl animate-pulse">🎉</div>
          </div>
          <h1 className="text-5xl font-bold animate-fade-in">
            Welcome to Falccur Mart!
          </h1>
          <p className="text-2xl animate-fade-in">
            Scroll down to create your account
          </p>
          <div className="animate-bounce mt-8">
            <div className="text-4xl">⬇️</div>
          </div>
        </div>
      </div>

      {/* Registration Form */}
      <div className={`min-h-screen flex items-center justify-center transition-all duration-1000 ${showForm ? 'opacity-100' : 'opacity-0'}`}>
        <Card className="w-full max-w-md animate-scale-in">
          <CardHeader>
            <CardTitle className="text-3xl text-center">Create Account</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSignup} className="space-y-4">
              <Input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <Input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Creating Account..." : "Sign Up"}
              </Button>
              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={() => navigate("/seller/auth")}
              >
                Already have an account? Login
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CustomerRegister;
