import { motion } from "framer-motion";
import { useState, useEffect, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, Heart } from "lucide-react";
import { EnhancedFilter } from "@/components/EnhancedFilter";
import { Link } from "react-router-dom";

interface Recipe {
  id: number;
  name: string;
  description: string;
  cookTimeMinutes: number;
  cuisine: string;
  mealType: string;
  tags: string[];
  imageUrl: string;
}

const Explore = () => {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [cookTimeMax, setCookTimeMax] = useState(300);
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({});
  const [quickOptions, setQuickOptions] = useState({
    onePot: false,
    highProtein: false,
    budgetFriendly: false,
  });

  // Load recipes from JSON on component mount
  useEffect(() => {
    const loadRecipes = async () => {
      try {
        const response = await fetch('/Recipies.json');
        const data = await response.json();
        const recipesData = data.recipes.map((recipe: any) => ({
          ...recipe,
          // Use slug-based image URLs from assets
          imageUrl: `/src/assets/${recipe.name}.jpg`,
        }));
        setRecipes(recipesData);
      } catch (error) {
        console.error('Error loading recipes:', error);
        // Fallback to empty array
        setRecipes([]);
      }
    };

    loadRecipes();
  }, []);

  // Filter recipes based on all active filters
  const filteredRecipes = useMemo(() => {
    return recipes.filter((recipe) => {
      // Search filter
      if (searchQuery && !recipe.name.toLowerCase().includes(searchQuery.toLowerCase()) && 
          !recipe.description.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false;
      }

      // Cook time filter
      if (recipe.cookTimeMinutes > cookTimeMax) {
        return false;
      }

      // Dietary preferences filter
      if (activeFilters["Dietary Preferences"]?.length > 0) {
        const hasMatchingDiet = activeFilters["Dietary Preferences"].some(diet => 
          recipe.tags.includes(diet)
        );
        if (!hasMatchingDiet) return false;
      }

      // Cuisine type filter
      if (activeFilters["Cuisine Type"]?.length > 0) {
        const hasMatchingCuisine = activeFilters["Cuisine Type"].some(cuisine => 
          recipe.cuisine.toLowerCase() === cuisine.toLowerCase()
        );
        if (!hasMatchingCuisine) return false;
      }

      // Meal type filter
      if (activeFilters["Meal Type"]?.length > 0) {
        const hasMatchingMealType = activeFilters["Meal Type"].some(mealType => 
          recipe.mealType.toLowerCase() === mealType.toLowerCase()
        );
        if (!hasMatchingMealType) return false;
      }

      // Quick options filters
      if (quickOptions.onePot && !recipe.tags.some(tag => tag.includes('one-pot'))) {
        return false;
      }
      
      if (quickOptions.highProtein && !recipe.tags.some(tag => tag.includes('protein-rich'))) {
        return false;
      }
      
      if (quickOptions.budgetFriendly && !recipe.tags.some(tag => tag.includes('budget-friendly'))) {
        return false;
      }

      return true;
    });
  }, [recipes, searchQuery, cookTimeMax, activeFilters, quickOptions]);

  // Handle filter changes from EnhancedFilter
  const handleFilterChange = (filters: Record<string, any>) => {
    // Extract search query and cook time
    if (filters.searchQuery !== undefined) {
      setSearchQuery(filters.searchQuery);
    }
    if (filters.cookTime !== undefined) {
      setCookTimeMax(filters.cookTime[0]);
    }
    if (filters.quickOptions !== undefined) {
      setQuickOptions(filters.quickOptions);
    }
    
    // Extract category filters
    const categoryFilters: Record<string, string[]> = {};
    Object.keys(filters).forEach(key => {
      if (key !== 'searchQuery' && key !== 'cookTime' && key !== 'quickOptions') {
        categoryFilters[key] = filters[key];
      }
    });
    setActiveFilters(categoryFilters);
  };

  return (
    <div className="container py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-4xl lg:text-5xl font-bold mb-4">
          Explore{" "}
          <span className="bg-gradient-primary bg-clip-text text-transparent">
            Recipes
          </span>
        </h1>
        <p className="text-xl text-muted-foreground">
          Discover new recipes tailored to your taste and pantry
        </p>
      </motion.div>

      <div className="grid lg:grid-cols-[350px_1fr] gap-8">
        {/* Filters Sidebar */}
        <motion.aside
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:sticky lg:top-24 h-fit"
        >
          <EnhancedFilter onFilterChange={handleFilterChange} />
        </motion.aside>

        {/* Recipe Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="space-y-6"
        >
          <div className="flex items-center justify-between">
            <p className="text-muted-foreground">
              Showing <span className="font-semibold text-foreground">{filteredRecipes.length}</span> recipes
            </p>
            <Badge variant="secondary" className="text-sm">
              Updated daily
            </Badge>
          </div>

          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredRecipes.map((recipe, index) => (
              <motion.div
                key={recipe.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
                whileHover={{ y: -8 }}
              >
                <Link to={`/recipes/${recipe.id}`} className="block h-full">
                  <Card className="overflow-hidden hover:shadow-glow transition-all duration-500 group border-2 h-full flex flex-col cursor-pointer">
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={recipe.imageUrl}
                        alt={recipe.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                      <div className="absolute top-4 right-4 flex gap-2">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className="w-8 h-8 rounded-full bg-card/80 backdrop-blur flex items-center justify-center"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            // Handle favorite toggle here
                          }}
                        >
                          <Heart className="h-4 w-4 text-foreground hover:fill-primary hover:text-primary transition-colors" />
                        </motion.button>
                      </div>
                      <div className="absolute bottom-4 left-4 flex items-center gap-2 text-white">
                        <Clock className="h-4 w-4" />
                        <span className="text-sm font-medium">{recipe.cookTimeMinutes} min</span>
                      </div>
                    </div>
                    <CardContent className="p-6 space-y-4 flex-1 flex flex-col">
                      <h3 className="font-bold text-lg line-clamp-2">{recipe.name}</h3>
                      <p className="text-sm text-muted-foreground line-clamp-2 flex-1">{recipe.description}</p>
                      <div className="flex flex-wrap gap-2">
                        {recipe.tags.filter(tag => tag !== 'ai-generated').slice(0, 3).map((tag) => (
                          <Badge key={tag} variant="secondary" className="hover:bg-primary hover:text-primary-foreground transition-colors cursor-pointer">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      <div className="flex gap-2 pt-2">
                        <Button variant="outline" size="sm" className="w-full">
                          View Recipe
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Explore;
