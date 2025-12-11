import { Link, Outlet, useNavigate } from "react-router-dom";
import { NavLink } from "@/components/NavLink";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChefHat, Sparkles, User, LogOut, Menu, X } from "lucide-react";
import { useEffect, useState, useCallback, useRef } from "react";
import { useAuth } from "@/contexts/AuthContext";

export const Layout = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  // Optimized scroll handler with requestAnimationFrame for better performance
  const rafRef = useRef<number | null>(null);
  const lastScrollY = useRef(0);

  const handleScroll = useCallback(() => {
    // Cancel any pending animation frame
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
    }

    rafRef.current = requestAnimationFrame(() => {
      const currentScrollY = window.scrollY;
      // Only update state if threshold is crossed (reduces re-renders)
      const shouldBeScrolled = currentScrollY > 20;
      const wasScrolled = lastScrollY.current > 20;

      if (shouldBeScrolled !== wasScrolled) {
        setScrolled(shouldBeScrolled);
      }
      lastScrollY.current = currentScrollY;
    });
  }, []);

  useEffect(() => {
    // Use passive listener for better scroll performance
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [handleScroll]);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const navItems = [
    { name: "Create Recipe", path: "/create" },
    { name: "Meal Planner", path: "/meal-planner" },
    { name: "Explore", path: "/explore" },
    { name: "Tips & Swaps", path: "/tips-swaps" },
    { name: "Favorites", path: "/favorites" },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className={`sticky top-0 z-50 w-full transition-all duration-300 pointer-events-auto ${
        scrolled 
          ? "bg-background/70 backdrop-blur-xl border-b border-border/50 shadow-lg" 
          : "bg-transparent"
      }`}>
        <div className="container flex h-20 items-center justify-between relative pointer-events-auto">
          <Link 
            to="/" 
            className="flex items-center space-x-3 hover:opacity-80 transition-all group relative z-10"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center group-hover:scale-110 transition-transform">
              <ChefHat className="h-6 w-6 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">Mix&Match</span>
          </Link>
          
          <nav className="hidden md:flex items-center space-x-1 relative z-10 pointer-events-auto">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className="px-4 py-2 text-sm font-medium transition-all duration-300 rounded-lg hover:bg-primary/10 text-muted-foreground relative z-10 cursor-pointer pointer-events-auto"
                activeClassName="text-primary bg-primary/10"
              >
                {item.name}
              </NavLink>
            ))}
          </nav>
          
          <div className="flex items-center space-x-2 relative z-10 pointer-events-auto">
            {/* Mobile menu button - positioned next to profile */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden relative z-10 pointer-events-auto"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
            {isAuthenticated ? (
              <>
                <Button 
                  size="sm" 
                  asChild 
                  className="group hidden sm:inline-flex relative z-10"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Link to="/create" onClick={(e) => e.stopPropagation()}>
                    <Sparkles className="h-4 w-4 mr-2 group-hover:rotate-12 transition-transform" />
                    Try Here
                  </Link>
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="flex items-center space-x-2"
                    >
                      <div className="w-8 h-8 rounded-full bg-gradient-primary flex items-center justify-center">
                        <User className="h-4 w-4 text-white" />
                      </div>
                      <span className="hidden md:inline-block">{user?.name}</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => navigate("/profile")}>
                      <User className="h-4 w-4 mr-2" />
                      Profile
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate("/favorites")}>
                      <Sparkles className="h-4 w-4 mr-2" />
                      Favorites
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate("/pantry")}>
                      <ChefHat className="h-4 w-4 mr-2" />
                      My Pantry
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout}>
                      <LogOut className="h-4 w-4 mr-2" />
                      Log out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="hidden sm:inline-flex relative z-10" 
                  asChild
                  onClick={(e) => e.stopPropagation()}
                >
                  <Link to="/login" onClick={(e) => e.stopPropagation()}>Login</Link>
                </Button>
                <Button 
                  size="sm" 
                  asChild 
                  className="group relative z-10"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Link to="/signup" onClick={(e) => e.stopPropagation()}>
                    <Sparkles className="h-4 w-4 mr-2 group-hover:rotate-12 transition-transform" />
                    Try Here
                  </Link>
                </Button>
              </>
            )}
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-border bg-background/95 backdrop-blur-xl">
            <nav className="container py-4 space-y-2">
              {navItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className="block px-4 py-2 text-sm font-medium transition-all duration-300 rounded-lg hover:bg-primary/10 text-muted-foreground pointer-events-auto"
                  activeClassName="text-primary bg-primary/10"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.name}
                </NavLink>
              ))}
            </nav>
          </div>
        )}
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      <footer className="border-t-2 border-border/50 bg-muted/20 backdrop-blur py-12 mt-20">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center">
                  <ChefHat className="h-5 w-5 text-white" />
                </div>
                <span className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">Mix&Match</span>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                AI-powered cooking assistant that turns your pantry chaos into chef-level meals.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Quick Links</h3>
              <div className="space-y-2">
                <Link to="/about" className="block text-sm text-muted-foreground hover:text-primary transition-colors">
                  About
                </Link>
                <Link to="/contact" className="block text-sm text-muted-foreground hover:text-primary transition-colors">
                  Contact
                </Link>
                <Link to="/privacy" className="block text-sm text-muted-foreground hover:text-primary transition-colors">
                  Privacy Policy
                </Link>
                <Link to="/terms" className="block text-sm text-muted-foreground hover:text-primary transition-colors">
                  Terms of Service
                </Link>
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Safety Notice</h3>
              <p className="text-sm text-muted-foreground">
                Always check for allergies and food safety. AI-generated recipes should be reviewed before cooking.
              </p>
            </div>
          </div>
          
          <div className="mt-8 pt-8 border-t border-border text-center text-sm text-muted-foreground">
            © 2025 Mix&Match. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};
