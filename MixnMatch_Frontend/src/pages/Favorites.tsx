import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, Clock, Trash2, ChefHat, Users, BarChart3, Utensils, Calendar, Star } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { getUserRecipes, type SavedRecipe } from "@/lib/authClient";
import { useToast } from "@/hooks/use-toast";

const Favorites = () => {
  const [favoriteRecipes, setFavoriteRecipes] = useState<SavedRecipe[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();

  // Load user's saved recipes from backend
  useEffect(() => {
    const loadFavoriteRecipes = async () => {
      if (!isAuthenticated || !user) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);
        
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("No authentication token found");
        }

        const recipes = await getUserRecipes(token);
        setFavoriteRecipes(recipes);
      } catch (error) {
        console.error("Failed to load favorite recipes:", error);
        setError("Failed to load your saved recipes. Please try again.");
        
        toast({
          title: "Error loading recipes",
          description: "Failed to load your saved recipes. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadFavoriteRecipes();
  }, [isAuthenticated, user, toast]);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "easy": return "bg-green-100 text-green-800";
      case "medium": return "bg-yellow-100 text-yellow-800";
      case "hard": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Show login prompt if not authenticated
  if (!isAuthenticated || !user) {
    return (
      <div className="container py-8 max-w-6xl">
        <div className="mb-8">
          <h1 className="text-4xl lg:text-5xl font-bold mb-4 flex items-center gap-3">
            <Heart className="h-10 w-10 text-primary fill-primary" />
            My Favorites
          </h1>
          <p className="text-xl text-muted-foreground">
            Sign in to view your saved recipes
          </p>
        </div>
        <Card className="border-2 border-dashed">
          <CardContent className="py-16 text-center">
            <Heart className="h-16 w-16 mx-auto mb-6 text-muted-foreground" />
            <h3 className="text-2xl font-bold mb-3">Sign in required</h3>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              Please sign in to view and manage your saved recipe collection.
            </p>
            <div className="flex gap-3 justify-center">
              <Button asChild>
                <Link to="/login">Sign In</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link to="/signup">Create Account</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="container py-8 max-w-6xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
            <Heart className="h-10 w-10 text-primary fill-primary animate-pulse" />
            Favorites
          </h1>
          <p className="text-muted-foreground">Loading your saved recipes...</p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1,2,3].map((i) => (
            <Card key={i} className="overflow-hidden">
              <CardContent className="p-6">
                <div className="animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-full mb-4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8 max-w-6xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-4xl lg:text-5xl font-bold mb-4 flex items-center gap-3">
          <Heart className="h-10 w-10 text-primary fill-primary" />
          My Favorites
          <span className="bg-gradient-primary bg-clip-text text-transparent">
            Collection
          </span>
        </h1>
        <p className="text-xl text-muted-foreground">
          Your personally saved recipes - ready to cook anytime
        </p>
        <div className="mt-4 flex items-center gap-6 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <ChefHat className="h-4 w-4 text-primary" />
            <span>{favoriteRecipes.length} saved recipes</span>
          </div>
          <div className="flex items-center gap-2">
            <Star className="h-4 w-4 text-secondary" />
            <span>Your personal cookbook</span>
          </div>
        </div>
      </motion.div>

      {favoriteRecipes.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <Card className="border-2 border-dashed">
            <CardContent className="py-16 text-center">
              <Heart className="h-16 w-16 mx-auto mb-6 text-muted-foreground" />
              <h3 className="text-2xl font-bold mb-3">No saved recipes yet</h3>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                Start building your personal recipe collection by saving recipes you love from our explore page or chat.
              </p>
              <div className="flex gap-3 justify-center">
                <Button asChild>
                  <Link to="/explore">Explore Recipes</Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link to="/create">Create Recipe</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <AnimatePresence>
            {favoriteRecipes.map((recipe, index) => (
              <motion.div
                key={recipe.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -8 }}
              >
                <Card className="overflow-hidden hover:shadow-glow transition-all duration-300 group h-full flex flex-col">
                  {/* Header */}
                  <div className="bg-gradient-to-r from-primary/10 to-secondary/10 p-4 border-b">
                    <h3 className="font-bold text-lg line-clamp-2 group-hover:text-primary transition-colors">
                      {recipe.name}
                    </h3>
                  </div>

                  <CardContent className="p-6 flex-1 flex flex-col">
                    {/* Description */}
                    <p className="text-sm text-muted-foreground line-clamp-3 mb-4 flex-1">
                      {recipe.description}
                    </p>

                    {/* Recipe stats */}
                    <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-blue-500" />
                        <span>{recipe.totalTimeMinutes} min</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-green-500" />
                        <span>{recipe.servings} serving{recipe.servings > 1 ? 's' : ''}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <BarChart3 className="h-4 w-4 text-purple-500" />
                        <Badge className={`text-xs ${getDifficultyColor(recipe.difficulty)}`}>
                          {recipe.difficulty}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2">
                        <Utensils className="h-4 w-4 text-orange-500" />
                        <span>{recipe.ingredients.length} items</span>
                      </div>
                    </div>

                    {/* Saved date */}
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mb-4">
                      <Calendar className="h-3 w-3" />
                      <span>Saved {formatDate(recipe.createdAt)}</span>
                    </div>

                    {/* Action buttons */}
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="flex-1" asChild>
                        <Link to={`/saved-recipes/${recipe.id}`}>
                          View Full Recipe
                        </Link>
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="text-destructive hover:text-destructive hover:bg-red-50"
                        title="Remove from favorites"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  );
};

export default Favorites;
