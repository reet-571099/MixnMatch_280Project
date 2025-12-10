import { useState } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Clock, Flame, Utensils, ChefHat, 
  Heart, Share2, RefreshCw, Edit, 
  Play, CheckCircle2 
} from "lucide-react";

export interface Recipe {
  title: string;
  summary?: string;
  ingredients: string[];
  steps: string[];
  macros?: {
    calories: number;
    protein: number;
    carbs: number;
    fats: number;
  };
  time?: number;
  difficulty?: "easy" | "medium" | "hard";
  servings?: number;
  explanation?: string;
  sources?: Array<{ name: string; confidence: number }>;
  pantryMatches?: string[];
}

interface RecipeCardProps {
  recipe: Recipe;
  onCookMode?: () => void;
  onSwapIngredient?: (ingredient: string) => void;
  onRegenerate?: () => void;
  onSave?: () => void;
  onShare?: () => void;
  isSaved?: boolean;
}

export const RecipeCard = ({
  recipe,
  onCookMode,
  onSwapIngredient,
  onRegenerate,
  onSave,
  onShare,
  isSaved = false,
}: RecipeCardProps) => {
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());

  const toggleStep = (index: number) => {
    const newCompleted = new Set(completedSteps);
    if (newCompleted.has(index)) {
      newCompleted.delete(index);
    } else {
      newCompleted.add(index);
    }
    setCompletedSteps(newCompleted);
  };

  const getDifficultyColor = (difficulty?: string) => {
    switch (difficulty) {
      case "easy": return "bg-success text-success-foreground";
      case "medium": return "bg-warning text-warning-foreground";
      case "hard": return "bg-destructive text-destructive-foreground";
      default: return "bg-muted text-muted-foreground";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Card className="p-6 space-y-5 shadow-card">
        {/* Header */}
        <div className="space-y-3">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1">
              <h3 className="text-2xl font-bold text-foreground mb-1">{recipe.title}</h3>
              {recipe.summary && (
                <p className="text-sm text-muted-foreground leading-relaxed">{recipe.summary}</p>
              )}
            </div>
            <div className="flex gap-1">
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={onSave} 
                title={isSaved ? "Recipe saved" : "Save recipe"}
                className={isSaved ? "text-primary" : ""}
              >
                <Heart className={`h-4 w-4 ${isSaved ? "fill-current" : ""}`} />
              </Button>
              <Button variant="ghost" size="icon" onClick={onShare} title="Share">
                <Share2 className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Badges row */}
          <div className="flex flex-wrap gap-2">
            {recipe.macros && (
              <>
                <Badge variant="secondary" className="gap-1">
                  <Flame className="h-3 w-3" />
                  {recipe.macros.calories} kcal
                </Badge>
                <Badge variant="outline">P: {recipe.macros.protein}g</Badge>
                <Badge variant="outline">C: {recipe.macros.carbs}g</Badge>
                <Badge variant="outline">F: {recipe.macros.fats}g</Badge>
              </>
            )}
            {recipe.time && (
              <Badge variant="secondary" className="gap-1">
                <Clock className="h-3 w-3" />
                {recipe.time} min
              </Badge>
            )}
            {recipe.difficulty && (
              <Badge className={getDifficultyColor(recipe.difficulty)}>
                <ChefHat className="h-3 w-3 mr-1" />
                {recipe.difficulty}
              </Badge>
            )}
            {recipe.servings && (
              <Badge variant="secondary" className="gap-1">
                <Utensils className="h-3 w-3" />
                {recipe.servings} servings
              </Badge>
            )}
          </div>

          {/* Explanation */}
          {recipe.explanation && (
            <div className="bg-accent/50 rounded-lg p-3 text-sm text-accent-foreground">
              <p className="font-medium mb-1">Why this fits:</p>
              <p>{recipe.explanation}</p>
            </div>
          )}
        </div>

        {/* Ingredients */}
        <div>
          <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
            <span className="text-primary">Ingredients</span>
            {recipe.pantryMatches && recipe.pantryMatches.length > 0 && (
              <Badge variant="outline" className="text-xs">
                <CheckCircle2 className="h-3 w-3 mr-1 text-success" />
                {recipe.pantryMatches.length} in pantry
              </Badge>
            )}
          </h4>
          <ul className="space-y-2">
            {recipe.ingredients.map((ing, i) => {
              const inPantry = recipe.pantryMatches?.some(p => 
                ing.toLowerCase().includes(p.toLowerCase())
              );
              return (
                <li key={i} className="flex items-center gap-2 group">
                  <span className={`text-sm flex-1 ${inPantry ? "font-medium text-success" : "text-foreground"}`}>
                    • {ing}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => onSwapIngredient?.(ing)}
                  >
                    <Edit className="h-3 w-3 mr-1" />
                    Swap
                  </Button>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Steps */}
        <div>
          <h4 className="font-semibold text-foreground mb-3">Steps</h4>
          <ol className="space-y-3">
            {recipe.steps.map((step, i) => (
              <li key={i} className="flex gap-3 group">
                <Checkbox
                  checked={completedSteps.has(i)}
                  onCheckedChange={() => toggleStep(i)}
                  className="mt-1"
                />
                <span className={`text-sm leading-relaxed flex-1 ${
                  completedSteps.has(i) ? "line-through text-muted-foreground" : "text-foreground"
                }`}>
                  <strong>{i + 1}.</strong> {step}
                </span>
              </li>
            ))}
          </ol>
        </div>

        {/* Sources */}
        {recipe.sources && recipe.sources.length > 0 && (
          <div className="pt-3 border-t border-border">
            <p className="text-xs text-muted-foreground mb-2">Based on:</p>
            <div className="flex flex-wrap gap-2">
              {recipe.sources.map((source, i) => (
                <Badge key={i} variant="outline" className="text-xs">
                  {source.name}
                  <span className="ml-1 text-muted-foreground">
                    ({Math.round(source.confidence * 100)}%)
                  </span>
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-wrap gap-2 pt-2">
          <Button onClick={onCookMode} className="gap-2">
            <Play className="h-4 w-4" />
            Cook Mode
          </Button>
          <Button variant="outline" onClick={onRegenerate} className="gap-2">
            <RefreshCw className="h-4 w-4" />
            Regenerate
          </Button>
        </div>
      </Card>
    </motion.div>
  );
};
