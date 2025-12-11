import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Search, SlidersHorizontal, X, ChevronDown } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

interface FilterOption {
  label: string;
  value: string;
  color?: string;
}

interface FilterCategory {
  title: string;
  options: FilterOption[];
  type: "multi" | "single";
}

interface EnhancedFilterProps {
  onFilterChange?: (filters: Record<string, any>) => void;
}

export const EnhancedFilter = ({ onFilterChange }: EnhancedFilterProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({});
  const [cookTime, setCookTime] = useState([300]);
  const [isExpanded, setIsExpanded] = useState(true);
  const [quickFiltersOpen, setQuickFiltersOpen] = useState(true);
  const [quickOptions, setQuickOptions] = useState({
    onePot: false,
    highProtein: false,
    budgetFriendly: false,
  });

  // Notify parent component when filters change
  useEffect(() => {
    onFilterChange?.({
      searchQuery,
      cookTime,
      quickOptions,
      ...activeFilters
    });
  }, [searchQuery, cookTime, activeFilters, quickOptions, onFilterChange]);

  const filterCategories: FilterCategory[] = [
    {
      title: "Dietary Preferences",
      type: "multi",
      options: [
        { label: "Vegan", value: "vegan", color: "text-secondary" },
        { label: "Vegetarian", value: "vegetarian", color: "text-secondary" },
        { label: "Gluten-Free", value: "gluten-free", color: "text-accent" },
        { label: "Dairy-Free", value: "dairy-free", color: "text-accent" },
        { label: "Keto", value: "keto", color: "text-primary" },
        { label: "Paleo", value: "paleo", color: "text-primary" },
      ],
    },
    {
      title: "Cuisine Type",
      type: "multi",
      options: [
        { label: "Italian", value: "italian" },
        { label: "Mexican", value: "mexican" },
        { label: "Asian", value: "asian" },
        { label: "Mediterranean", value: "mediterranean" },
        { label: "American", value: "american" },
        { label: "Indian", value: "indian" },
        { label: "Thai", value: "thai" },
        { label: "French", value: "french" },
      ],
    },
    {
      title: "Meal Type",
      type: "multi",
      options: [
        { label: "Breakfast", value: "breakfast" },
        { label: "Lunch", value: "lunch" },
        { label: "Dinner", value: "dinner" },
        { label: "Snack", value: "snack" },
        { label: "Dessert", value: "dessert" },
      ],
    },
  ];

  const toggleFilter = (category: string, value: string) => {
    setActiveFilters((prev) => {
      const categoryFilters = prev[category] || [];
      const newFilters = categoryFilters.includes(value)
        ? categoryFilters.filter((v) => v !== value)
        : [...categoryFilters, value];
      
      return { ...prev, [category]: newFilters };
    });
  };

  const clearAllFilters = () => {
    setActiveFilters({});
    setCookTime([300]);
    setSearchQuery("");
    setQuickOptions({
      onePot: false,
      highProtein: false,
      budgetFriendly: false,
    });
  };

  const activeFilterCount = Object.values(activeFilters).flat().length;

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input
          id="recipe-search"
          placeholder="Search recipes, ingredients..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-12 pr-12 h-14 text-lg border-2 focus:border-primary transition-all duration-300 bg-card/50 backdrop-blur"
          aria-label="Search recipes and ingredients"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery("")}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Clear search"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      {/* Filter Header */}
      <Card className="p-4 bg-card/50 backdrop-blur border-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <SlidersHorizontal className="h-5 w-5 text-primary" />
            <h2 className="font-semibold text-lg">Filters</h2>
            {activeFilterCount > 0 && (
              <Badge variant="default" className="animate-scale-in">
                {activeFilterCount}
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-2">
            {activeFilterCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearAllFilters}
                className="text-sm"
                aria-label="Clear all active filters"
              >
                Clear All
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
              aria-label={isExpanded ? "Collapse filters" : "Expand filters"}
              aria-expanded={isExpanded}
            >
              <ChevronDown
                className={`h-4 w-4 transition-transform duration-300 ${
                  isExpanded ? "rotate-180" : ""
                }`}
              />
            </Button>
          </div>
        </div>
      </Card>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-4 overflow-hidden"
          >
            {/* Cook Time Slider */}
            <Card className="p-6 bg-card/50 backdrop-blur border-2">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="cook-time-slider" className="text-base font-semibold">
                    Maximum Cook Time
                  </Label>
                  <Badge variant="secondary" className="text-base">
                    {cookTime[0]} min
                  </Badge>
                </div>
                <Slider
                  id="cook-time-slider"
                  value={cookTime}
                  onValueChange={setCookTime}
                  max={120}
                  min={5}
                  step={5}
                  className="py-4"
                  aria-label={`Maximum cook time: ${cookTime[0]} minutes`}
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>5 min</span>
                  <span>Quick</span>
                  <span>Medium</span>
                  <span>120+ min</span>
                </div>
              </div>
            </Card>

            {/* Filter Categories */}
            {filterCategories.map((category, index) => (
              <Collapsible
                key={category.title}
                open={quickFiltersOpen}
                onOpenChange={setQuickFiltersOpen}
              >
                <Card className="overflow-hidden bg-card/50 backdrop-blur border-2">
                  <CollapsibleTrigger className="w-full p-4 hover:bg-muted/50 transition-colors">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-base">{category.title}</h3>
                      <ChevronDown
                        className={`h-4 w-4 transition-transform duration-300 ${
                          quickFiltersOpen ? "rotate-180" : ""
                        }`}
                      />
                    </div>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="p-4 pt-0"
                    >
                      <div className="flex flex-wrap gap-2">
                        {category.options.map((option) => {
                          const isActive = activeFilters[category.title]?.includes(
                            option.value
                          );
                          return (
                            <motion.div
                              key={option.value}
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              <Badge
                                variant={isActive ? "default" : "outline"}
                                className={`cursor-pointer px-4 py-2 text-sm transition-all duration-300 ${
                                  isActive
                                    ? "shadow-glow"
                                    : "hover:border-primary/50"
                                } ${option.color || ""}`}
                                onClick={() => toggleFilter(category.title, option.value)}
                                role="button"
                                aria-pressed={isActive}
                                aria-label={`${isActive ? 'Remove' : 'Add'} ${option.label} filter`}
                              >
                                {option.label}
                              </Badge>
                            </motion.div>
                          );
                        })}
                      </div>
                    </motion.div>
                  </CollapsibleContent>
                </Card>
              </Collapsible>
            ))}

            {/* Quick Toggles */}
            <Card className="p-6 bg-card/50 backdrop-blur border-2">
              <h3 className="font-semibold text-base mb-4">Quick Options</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="one-pot-switch" className="text-sm font-medium">One-Pot Meals</Label>
                    <p className="text-xs text-muted-foreground">Minimal cleanup</p>
                  </div>
                  <Switch 
                    id="one-pot-switch"
                    checked={quickOptions.onePot}
                    onCheckedChange={(checked) => 
                      setQuickOptions(prev => ({ ...prev, onePot: checked }))
                    }
                    aria-label="Filter for one-pot meals with minimal cleanup"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="high-protein-switch" className="text-sm font-medium">High Protein</Label>
                    <p className="text-xs text-muted-foreground">
                      Protein-rich recipes
                    </p>
                  </div>
                  <Switch 
                    id="high-protein-switch"
                    checked={quickOptions.highProtein}
                    onCheckedChange={(checked) => 
                      setQuickOptions(prev => ({ ...prev, highProtein: checked }))
                    }
                    aria-label="Filter for high protein recipes"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="budget-friendly-switch" className="text-sm font-medium">Budget Friendly</Label>
                    <p className="text-xs text-muted-foreground">
                      Affordable ingredients
                    </p>
                  </div>
                  <Switch 
                    id="budget-friendly-switch"
                    checked={quickOptions.budgetFriendly}
                    onCheckedChange={(checked) => 
                      setQuickOptions(prev => ({ ...prev, budgetFriendly: checked }))
                    }
                    aria-label="Filter for budget-friendly recipes with affordable ingredients"
                  />
                </div>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
