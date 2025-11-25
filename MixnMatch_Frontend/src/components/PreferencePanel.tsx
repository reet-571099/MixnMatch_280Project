import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { 
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronDown, Users, Clock, ChefHat, X } from "lucide-react";
import { useState } from "react";

interface PreferencesPanelProps {
  servings: number;
  onServingsChange: (servings: number) => void;
  makingLeftovers: boolean;
  onLeftoversChange: (value: boolean) => void;
  allergens: string[];
  onAllergensChange: (allergens: string[]) => void;
  recentRecipes: Array<{ id: string; title: string; time?: number; macros?: any }>;
  onUseRecipeAsBase?: (recipeId: string) => void;
}

const COMMON_ALLERGENS = [
  "Peanuts", "Tree nuts", "Milk", "Eggs", "Wheat", "Soy", 
  "Fish", "Shellfish", "Sesame", "Mustard", "Celery", "Lupin"
];

const EXCLUSIONS = [
  "Cilantro", "Mushrooms", "Olives", "Anchovies", "Blue cheese",
  "Liver", "Oysters", "Eggplant", "Beets"
];

export const PreferencesPanel = ({
  servings,
  onServingsChange,
  makingLeftovers,
  onLeftoversChange,
  allergens,
  onAllergensChange,
  recentRecipes,
  onUseRecipeAsBase,
}: PreferencesPanelProps) => {
  const [goalsOpen, setGoalsOpen] = useState(true);
  const [servingsOpen, setServingsOpen] = useState(true);
  const [allergensOpen, setAllergensOpen] = useState(true);

  const toggleAllergen = (allergen: string) => {
    if (allergens.includes(allergen)) {
      onAllergensChange(allergens.filter(a => a !== allergen));
    } else {
      onAllergensChange([...allergens, allergen]);
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-lg">Your Preferences</h3>

      {/* Active Filters Summary */}
      {allergens.length > 0 && (
        <Card className="p-3 bg-destructive/10 border-destructive/20">
          <p className="text-xs font-medium text-destructive mb-2">Active Exclusions:</p>
          <div className="flex flex-wrap gap-1">
            {allergens.map(a => (
              <Badge key={a} variant="destructive" className="text-xs gap-1">
                {a}
                <button onClick={() => toggleAllergen(a)}>
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
        </Card>
      )}

      {/* Goals Section */}
      <Collapsible open={goalsOpen} onOpenChange={setGoalsOpen}>
        <Card className="overflow-hidden">
          <CollapsibleTrigger className="flex items-center justify-between w-full p-4 hover:bg-muted/50 transition-colors">
            <div className="flex items-center gap-2">
              <ChefHat className="h-4 w-4 text-primary" />
              <span className="font-medium">Goals</span>
            </div>
            <ChevronDown className={`h-4 w-4 transition-transform ${goalsOpen ? "rotate-180" : ""}`} />
          </CollapsibleTrigger>
          <CollapsibleContent>
            <div className="p-4 pt-0 space-y-3 text-sm">
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">Meal Type</Label>
                <div className="flex flex-wrap gap-2">
                  {["Breakfast", "Lunch", "Dinner", "Snack"].map(t => (
                    <Badge key={t} variant="outline" className="cursor-pointer">
                      {t}
                    </Badge>
                  ))}
                </div>
              </div>
              <Separator />
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">Dietary Style</Label>
                <div className="flex flex-wrap gap-2">
                  {["Balanced", "High-Protein", "Low-Carb", "Keto", "Mediterranean"].map(s => (
                    <Badge key={s} variant="outline" className="cursor-pointer">
                      {s}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </CollapsibleContent>
        </Card>
      </Collapsible>

      {/* Servings & Leftovers */}
      <Collapsible open={servingsOpen} onOpenChange={setServingsOpen}>
        <Card className="overflow-hidden">
          <CollapsibleTrigger className="flex items-center justify-between w-full p-4 hover:bg-muted/50 transition-colors">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-primary" />
              <span className="font-medium">Servings & Leftovers</span>
            </div>
            <ChevronDown className={`h-4 w-4 transition-transform ${servingsOpen ? "rotate-180" : ""}`} />
          </CollapsibleTrigger>
          <CollapsibleContent>
            <div className="p-4 pt-0 space-y-4">
              <div className="flex items-center justify-between">
                <Label>Servings</Label>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => onServingsChange(Math.max(1, servings - 1))}
                  >
                    -
                  </Button>
                  <span className="w-8 text-center font-medium">{servings}</span>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => onServingsChange(Math.min(12, servings + 1))}
                  >
                    +
                  </Button>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="leftovers">Make leftovers</Label>
                <Switch
                  id="leftovers"
                  checked={makingLeftovers}
                  onCheckedChange={onLeftoversChange}
                />
              </div>
            </div>
          </CollapsibleContent>
        </Card>
      </Collapsible>

      {/* Allergens & Exclusions */}
      <Collapsible open={allergensOpen} onOpenChange={setAllergensOpen}>
        <Card className="overflow-hidden">
          <CollapsibleTrigger className="flex items-center justify-between w-full p-4 hover:bg-muted/50 transition-colors">
            <div className="flex items-center gap-2">
              <span className="font-medium">Allergens & Exclusions</span>
              {allergens.length > 0 && (
                <Badge variant="destructive" className="text-xs">
                  {allergens.length}
                </Badge>
              )}
            </div>
            <ChevronDown className={`h-4 w-4 transition-transform ${allergensOpen ? "rotate-180" : ""}`} />
          </CollapsibleTrigger>
          <CollapsibleContent>
            <div className="p-4 pt-0 space-y-4">
              <div>
                <Label className="text-xs text-muted-foreground mb-2 block">Allergens</Label>
                <div className="flex flex-wrap gap-2">
                  {COMMON_ALLERGENS.map(a => (
                    <Badge
                      key={a}
                      variant={allergens.includes(a) ? "destructive" : "outline"}
                      className="cursor-pointer"
                      onClick={() => toggleAllergen(a)}
                    >
                      {a}
                    </Badge>
                  ))}
                </div>
              </div>
              <Separator />
              <div>
                <Label className="text-xs text-muted-foreground mb-2 block">Dislikes</Label>
                <div className="flex flex-wrap gap-2">
                  {EXCLUSIONS.map(e => (
                    <Badge
                      key={e}
                      variant={allergens.includes(e) ? "destructive" : "outline"}
                      className="cursor-pointer"
                      onClick={() => toggleAllergen(e)}
                    >
                      {e}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </CollapsibleContent>
        </Card>
      </Collapsible>

      {/* Recent Recipes */}
      {recentRecipes.length > 0 && (
        <Card className="p-4">
          <h4 className="font-medium mb-3 flex items-center gap-2">
            <Clock className="h-4 w-4 text-primary" />
            Recent Recipes
          </h4>
          <div className="space-y-2">
            {recentRecipes.slice(0, 5).map(recipe => (
              <Card key={recipe.id} className="p-3 hover:shadow-md transition-shadow cursor-pointer group">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <p className="font-medium text-sm">{recipe.title}</p>
                    <div className="flex gap-2 mt-1">
                      {recipe.time && (
                        <Badge variant="secondary" className="text-xs">
                          {recipe.time}m
                        </Badge>
                      )}
                      {recipe.macros && (
                        <Badge variant="outline" className="text-xs">
                          {recipe.macros.calories} kcal
                        </Badge>
                      )}
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => onUseRecipeAsBase?.(recipe.id)}
                  >
                    Use as base
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};
