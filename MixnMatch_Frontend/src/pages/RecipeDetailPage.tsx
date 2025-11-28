import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { motion, MotionConfig } from "framer-motion";
import { ArrowLeft, Clock, Users, ChefHat, Check, Share2, Printer, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

interface Ingredient {
  name: string;
  quantity: number;
  unit: string;
  notes?: string;
}

interface Step {
  stepNumber: number;
  instruction: string;
}

interface Recipe {
  id: number;
  slug?: string;
  name: string;
  description: string;
  servings: number;
  prepTimeMinutes?: number;
  cookTimeMinutes: number;
  totalTimeMinutes?: number;
  difficulty: string;
  cuisine?: string;
  mealType?: string;
  tags: string[];
  ingredients: Ingredient[];
  steps: Step[];
  imageUrl: string;
  author?: {
    name: string;
    isAI?: boolean;
  };
  rating?: number;
  ratingCount?: number;
  createdAt?: string;
  sourceUrl?: string;
}

const RecipeDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const loadRecipe = async () => {
      try {
        setLoading(true);
        const response = await fetch('/Recipies.json');
        const data = await response.json();
        
        const foundRecipe = data.recipes.find((r: any) => r.id === parseInt(id || '0'));
        
        if (foundRecipe) {
          // Use placeholder images since JSON imageUrl points to example.com
          const imageOptions = [
            '/src/assets/recipe-curry.jpg',
            '/src/assets/recipe-stirfry.jpg',
            '/src/assets/recipe-mediterranean.jpg'
          ];
          const recipeWithImage = {
            ...foundRecipe,
            imageUrl: imageOptions[foundRecipe.id % 3],
          };
          setRecipe(recipeWithImage);
        } else {
          setError("Recipe not found");
        }
      } catch (err) {
        console.error('Error loading recipe:', err);
        setError("Failed to load recipe");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      loadRecipe();
    } else {
      setError("Invalid recipe ID");
      setLoading(false);
    }
  }, [id]);

  if (loading) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/20 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-lg text-muted-foreground">Loading recipe...</p>
        </motion.div>
      </main>
    );
  }

  if (error || !recipe) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/20 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-6 max-w-md mx-auto px-6"
        >
          <div className="text-6xl mb-4">🍽️</div>
          <h1 className="text-3xl font-bold text-foreground">Recipe Not Found</h1>
          <p className="text-lg text-muted-foreground">
            {error || "The recipe you're looking for doesn't exist or has been moved."}
          </p>
          <Button asChild className="mt-6">
            <Link to="/explore" className="inline-flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Recipes
            </Link>
          </Button>
        </motion.div>
      </main>
    );
  }

  const fadeInUp = {
    initial: { opacity: 0, y: 12 },
    animate: { opacity: 1, y: 0 },
  };

  const fadeIn = {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
  };

  const staggerContainer = {
    initial: {},
    animate: {
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  return (
    <MotionConfig reducedMotion="user">
      <main className="min-h-screen bg-gradient-to-br from-background via-background/95 to-secondary/10">
        <div className="container mx-auto px-4 py-6 max-w-7xl">
          {/* Back Link */}
          <motion.nav
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            className="mb-6"
          >
            <Button 
              variant="ghost" 
              asChild 
              className="gap-2 text-muted-foreground hover:text-foreground focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2" 
              aria-label="Go back to Explore recipes"
            >
              <Link to="/explore">
                <ArrowLeft className="h-4 w-4" />
                Back to Explore
              </Link>
            </Button>
          </motion.nav>

          {/* Top Chip Row */}
          <motion.header
            variants={fadeInUp}
            initial="initial"
            animate="animate"
            transition={{ duration: 0.4 }}
            className="mb-6"
            aria-labelledby="recipe-meta"
          >
            <div className="flex flex-wrap gap-2">
              {recipe.cuisine && (
                <Badge variant="outline" className="bg-primary/5 border-primary/20 text-primary font-medium">
                  {recipe.cuisine.charAt(0).toUpperCase() + recipe.cuisine.slice(1)}
                </Badge>
              )}
              {recipe.mealType && (
                <Badge variant="outline" className="bg-secondary/5 border-secondary/20 text-secondary-foreground font-medium">
                  {recipe.mealType.charAt(0).toUpperCase() + recipe.mealType.slice(1)}
                </Badge>
              )}
              {recipe.tags.filter(tag => ['vegan', 'vegetarian', 'gluten-free', 'dairy-free', 'keto', 'paleo'].includes(tag)).map((tag) => (
                <Badge key={tag} variant="secondary" className="font-medium capitalize">
                  {tag}
                </Badge>
              ))}
            </div>
          </motion.header>

          {/* Two-Column Layout */}
          <div className="grid lg:grid-cols-5 gap-8 recipe-content">
            {/* Left Column - Sticky Hero Card */}
            <motion.aside
              variants={fadeInUp}
              initial="initial"
              animate="animate"
              transition={{ duration: 0.5 }}
              className="lg:col-span-2 lg:sticky lg:top-6 lg:h-fit"
            >
              <Card className="overflow-hidden border-2 shadow-xl bg-gradient-to-br from-card/95 to-card/80 backdrop-blur-sm">
                <div className="relative h-64 lg:h-80 recipe-image">
                  <img
                    src={recipe.imageUrl}
                    alt={`${recipe.name} - Recipe hero image`}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                  
                  {/* Meta Pills */}
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="flex flex-wrap gap-2">
                      {recipe.cookTimeMinutes && (
                        <div className="flex items-center gap-2 bg-white/15 backdrop-blur-md px-3 py-2 rounded-full text-white text-sm font-medium border border-white/20">
                          <Clock className="h-4 w-4" />
                          {recipe.cookTimeMinutes} min
                        </div>
                      )}
                      {recipe.servings && (
                        <div className="flex items-center gap-2 bg-white/15 backdrop-blur-md px-3 py-2 rounded-full text-white text-sm font-medium border border-white/20">
                          <Users className="h-4 w-4" />
                          Serves {recipe.servings}
                        </div>
                      )}
                      {recipe.difficulty && (
                        <div className="flex items-center gap-2 bg-white/15 backdrop-blur-md px-3 py-2 rounded-full text-white text-sm font-medium border border-white/20">
                          <ChefHat className="h-4 w-4" />
                          {recipe.difficulty.charAt(0).toUpperCase() + recipe.difficulty.slice(1)}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="px-6 py-4 bg-gradient-to-r from-background/95 via-background/90 to-background/95 border-t border-border/30">
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1 gap-2 hover:bg-primary hover:text-primary-foreground transition-all duration-200"
                      onClick={async () => {
                        try {
                          if (navigator.share) {
                            await navigator.share({
                              title: recipe.name,
                              text: recipe.description,
                              url: window.location.href,
                            });
                            toast({
                              title: "Shared successfully! 🎉",
                              description: "Recipe shared via native share menu.",
                            });
                          } else {
                            await navigator.clipboard.writeText(window.location.href);
                            toast({
                              title: "Link copied! 📋",
                              description: "Recipe URL copied to clipboard.",
                            });
                          }
                        } catch (error) {
                          toast({
                            title: "Share failed 😕",
                            description: "Could not share the recipe. Please try again.",
                            variant: "destructive",
                          });
                        }
                      }}
                    >
                      <Share2 className="h-4 w-4" />
                      Share
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1 gap-2 hover:bg-orange-500 hover:text-white transition-all duration-200"
                      onClick={() => {
                        try {
                          const redditUrl = `https://www.reddit.com/submit?title=${encodeURIComponent(recipe.name)}&url=${encodeURIComponent(window.location.href)}`;
                          window.open(redditUrl, '_blank');
                          toast({
                            title: "Opening Reddit! 🤖",
                            description: "Redirecting to Reddit to share this recipe.",
                          });
                        } catch (error) {
                          toast({
                            title: "Reddit share failed 😕",
                            description: "Could not open Reddit. Please try again.",
                            variant: "destructive",
                          });
                        }
                      }}
                    >
                      <MessageCircle className="h-4 w-4" />
                      Reddit
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1 gap-2 hover:bg-green-500 hover:text-white transition-all duration-200"
                      onClick={() => {
                        try {
                          window.print();
                          toast({
                            title: "Printing recipe! 🖨️",
                            description: "Opening print dialog for PDF export.",
                          });
                        } catch (error) {
                          toast({
                            title: "Print failed 😕",
                            description: "Could not open print dialog. Please try again.",
                            variant: "destructive",
                          });
                        }
                      }}
                    >
                      <Printer className="h-4 w-4" />
                      Print
                    </Button>
                  </div>
                </div>

                <CardContent className="p-6 space-y-4">
                  <div>
                    <h1 className="text-2xl lg:text-3xl font-bold text-foreground leading-tight mb-3 recipe-title">
                      {recipe.name}
                    </h1>
                    <p className="text-muted-foreground leading-relaxed text-sm lg:text-base">
                      {recipe.description}
                    </p>
                  </div>

                  {/* Action Tags */}
                  {recipe.tags.filter(tag => !['ai-generated', 'vegan', 'vegetarian', 'gluten-free', 'dairy-free', 'keto', 'paleo'].includes(tag)).length > 0 && (
                    <div className="flex flex-wrap gap-2 pt-2 border-t border-border/50">
                      {recipe.tags.filter(tag => !['ai-generated', 'vegan', 'vegetarian', 'gluten-free', 'dairy-free', 'keto', 'paleo'].includes(tag)).map((tag) => (
                        <Badge
                          key={tag}
                          variant="secondary"
                          className="text-xs font-medium capitalize hover:bg-primary hover:text-primary-foreground transition-colors focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.aside>

            {/* Right Column - Scrollable Content */}
            <motion.div
              variants={staggerContainer}
              initial="initial"
              animate="animate"
              className="lg:col-span-3 space-y-6"
            >
              {/* Ingredients Section */}
              <motion.section 
                variants={fadeInUp}
                aria-labelledby="ingredients-heading"
              >
                <Card className="border-2 shadow-lg bg-gradient-to-br from-card/95 to-card/80 backdrop-blur-sm hover:shadow-xl transition-shadow duration-300">
                  <CardContent className="p-6">
                    <h2 id="ingredients-heading" className="text-xl font-bold mb-5 flex items-center gap-3">
                      🥘 Ingredients
                      <span className="text-sm font-normal text-muted-foreground">
                        ({recipe.ingredients.length} items)
                      </span>
                    </h2>
                    <div className="space-y-3">
                      {recipe.ingredients.map((ingredient, index) => (
                        <motion.div
                          key={index}
                          variants={fadeIn}
                          className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/30 transition-colors group"
                        >
                          <button 
                            className="flex-shrink-0 w-5 h-5 bg-primary/10 border-2 border-primary/30 rounded-sm flex items-center justify-center mt-0.5 hover:bg-primary/20 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 transition-colors"
                            aria-label={`Mark ${ingredient.name} as completed`}
                          >
                            <Check className="h-3 w-3 text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                          </button>
                          <div className="flex-1 min-w-0">
                            <span className="font-medium text-foreground block">
                              {ingredient.quantity} {ingredient.unit} {ingredient.name}
                            </span>
                            {ingredient.notes && (
                              <span className="text-sm text-muted-foreground block mt-1">
                                {ingredient.notes}
                              </span>
                            )}
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.section>

              {/* Instructions Section */}
              <motion.section 
                variants={fadeInUp}
                aria-labelledby="instructions-heading"
              >
                <Card className="border-2 shadow-lg bg-gradient-to-br from-card/95 to-card/80 backdrop-blur-sm hover:shadow-xl transition-shadow duration-300">
                  <CardContent className="p-6">
                    <h2 id="instructions-heading" className="text-xl font-bold mb-5 flex items-center gap-3">
                      👨‍🍳 Instructions
                      <span className="text-sm font-normal text-muted-foreground">
                        ({recipe.steps.length} steps)
                      </span>
                    </h2>
                    <div className="space-y-4">
                      {recipe.steps.map((step, index) => (
                        <motion.div
                          key={step.stepNumber}
                          variants={fadeIn}
                          className="flex items-start gap-4 p-4 rounded-lg hover:bg-muted/30 transition-colors border border-border/30"
                        >
                          <span className="flex-shrink-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold text-sm shadow-sm">
                            {step.stepNumber}
                          </span>
                          <div className="flex-1 pt-1">
                            <p className="text-foreground leading-relaxed">
                              {step.instruction}
                            </p>
                            {/* Add estimated time for steps if available */}
                            {index === 0 && recipe.prepTimeMinutes && (
                              <div className="mt-2">
                                <Badge variant="outline" className="text-xs">
                                  Prep: ~{Math.ceil(recipe.prepTimeMinutes / recipe.steps.length)} min
                                </Badge>
                              </div>
                            )}
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.section>
            </motion.div>
          </div>
        </div>
      </main>
    </MotionConfig>
  );
};

export default RecipeDetailPage;
