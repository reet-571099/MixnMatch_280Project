import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { getCurrentUser, type User } from "@/lib/authClient";

const AuthCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { setUser } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    const token = searchParams.get("token");

    if (!token) {
      toast({
        title: "Authentication failed",
        description: "No token received from OAuth provider.",
        variant: "destructive",
      });
      navigate("/login");
      return;
    }

    // Store token and fetch user data
    const handleAuth = async () => {
      try {
        // Store token
        localStorage.setItem("token", token);

        // Fetch user data
        const user = await getCurrentUser(token);
        
        if (user) {
          // Store user data
          localStorage.setItem("user", JSON.stringify(user));
          
          // Update auth context
          setUser(user);

          toast({
            title: "Welcome!",
            description: "You've successfully signed in with Google.",
          });

          // Redirect to create page or home
          navigate("/");
        } else {
          throw new Error("Failed to fetch user data");
        }
      } catch (error) {
        console.error("Auth callback error:", error);
        toast({
          title: "Authentication failed",
          description: "Failed to complete authentication. Please try again.",
          variant: "destructive",
        });
        navigate("/login");
      }
    };

    handleAuth();
  }, [searchParams, navigate, setUser, toast]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
        <p className="mt-4 text-muted-foreground">Completing authentication...</p>
      </div>
    </div>
  );
};

export default AuthCallback;

