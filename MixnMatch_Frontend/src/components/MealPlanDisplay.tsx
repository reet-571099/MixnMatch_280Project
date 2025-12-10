import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sun, Cloud, Moon, ChevronDown, ChevronUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Meal {
  title: string;
  description: string;
  type: "breakfast" | "lunch" | "dinner";
  ingredients?: string[];
  steps?: string[];
  time?: number;
}

interface Day {
  day: number;
  meals: Meal[];
}

interface MealPlanDisplayProps {
  data: {
    title: string;
    description: string;
    days: Day[];
  };
}

const DAY_NAMES = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

const MealIcon = ({ type }: { type: string }) => {
  switch (type) {
    case "breakfast":
      return <Sun className="h-4 w-4 text-amber-500" />;
    case "lunch":
      return <Cloud className="h-4 w-4 text-blue-500" />;
    case "dinner":
      return <Moon className="h-4 w-4 text-purple-500" />;
    default:
      return null;
  }
};

const MealBorderColor = (type: string) => {
  switch (type) {
    case "breakfast":
      return "border-l-amber-400";
    case "lunch":
      return "border-l-blue-400";
    case "dinner":
      return "border-l-purple-400";
    default:
      return "border-l-gray-400";
  }
};

export const MealPlanDisplay = ({ data }: MealPlanDisplayProps) => {
  const [expandedMeal, setExpandedMeal] = useState<string | null>(null);

  const getMealsByType = (meals: Meal[], type: string) => {
    return meals.find(m => m.type === type);
  };

  const toggleMeal = (mealKey: string) => {
    setExpandedMeal(expandedMeal === mealKey ? null : mealKey);
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent mb-1">
          {data.title || "Your 7-Day Meal Plan"}
        </h2>
        <p className="text-sm text-muted-foreground">
          {data.description || "Click on any meal to see ingredients & steps"}
        </p>
      </div>

      {/* Days List */}
      <div className="space-y-6">
        {data.days.map((dayData) => {
          return (
            <div key={dayData.day}>
              {/* Day Header */}
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white font-bold text-sm">
                  {dayData.day}
                </div>
                <h3 className="text-lg font-semibold text-foreground">
                  {DAY_NAMES[dayData.day - 1] || `Day ${dayData.day}`}
                </h3>
              </div>

              {/* 3 Meals Side by Side */}
              <div className="grid grid-cols-3 gap-3 items-start">
                {["breakfast", "lunch", "dinner"].map((mealType) => {
                  const meal = getMealsByType(dayData.meals, mealType);
                  if (!meal) return <div key={mealType} className="col-span-1" />;

                  const mealKey = `${dayData.day}-${mealType}`;
                  const isExpanded = expandedMeal === mealKey;

                  return (
                    <Card
                      key={mealType}
                      className={`border-l-4 ${MealBorderColor(mealType)} cursor-pointer hover:shadow-md transition-all`}
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleMeal(mealKey);
                      }}
                    >
                      <div className="p-3">
                        {/* Meal Header */}
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center gap-2">
                            <MealIcon type={mealType} />
                            <span className="text-xs font-medium text-muted-foreground capitalize">
                              {mealType}
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            {meal.time && (
                              <Badge variant="secondary" className="text-xs px-1.5 py-0">
                                {meal.time}m
                              </Badge>
                            )}
                            {isExpanded ? (
                              <ChevronUp className="h-3 w-3 text-muted-foreground" />
                            ) : (
                              <ChevronDown className="h-3 w-3 text-muted-foreground" />
                            )}
                          </div>
                        </div>

                        {/* Meal Title */}
                        <h4 className="font-semibold text-sm text-foreground leading-tight">
                          {meal.title}
                        </h4>

                        {/* Description */}
                        <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                          {meal.description}
                        </p>

                        {/* Expanded Details */}
                        <AnimatePresence>
                          {isExpanded && (meal.ingredients || meal.steps) && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.2 }}
                              className="overflow-hidden"
                            >
                              <div className="mt-3 pt-3 border-t border-border space-y-3">
                                {/* Ingredients */}
                                {meal.ingredients && meal.ingredients.length > 0 && (
                                  <div>
                                    <p className="text-xs font-medium mb-1">Ingredients:</p>
                                    <div className="flex flex-wrap gap-1">
                                      {meal.ingredients.map((ing, idx) => (
                                        <Badge key={idx} variant="outline" className="text-xs px-1.5 py-0">
                                          {ing}
                                        </Badge>
                                      ))}
                                    </div>
                                  </div>
                                )}

                                {/* Steps */}
                                {meal.steps && meal.steps.length > 0 && (
                                  <div>
                                    <p className="text-xs font-medium mb-1">Steps:</p>
                                    <ol className="space-y-1">
                                      {meal.steps.map((step, idx) => (
                                        <li key={idx} className="flex gap-2 text-xs text-muted-foreground">
                                          <span className="font-medium text-primary">{idx + 1}.</span>
                                          <span>{step}</span>
                                        </li>
                                      ))}
                                    </ol>
                                  </div>
                                )}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </Card>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div className="mt-6 text-center">
        <p className="text-xs text-muted-foreground">
          Click on any meal to see ingredients & steps
        </p>
      </div>
    </div>
  );
};

/* ================== OLD VERSIONS - COMMENTED OUT ==================
 * Keeping these for reference if needed later

// VERSION 2: Collapsible days with expandable meals
// ... (previous interactive version with day accordions)

// VERSION 1: Simple grid layout
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { UserPlus } from "lucide-react";

export const MealPlanDisplayV1 = ({ data }) => {
  const getMealsByType = (meals, type) => meals.find(m => m.type === type);

  return (
    <div className="p-8">
      <div className="bg-gradient-to-r from-secondary via-secondary/90 to-secondary/80 rounded-lg p-6 mb-6 shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-secondary-foreground mb-2">
              {data.title || "7-Day Meal Plan"}
            </h2>
            <p className="text-secondary-foreground/90">
              {data.description || "breakfast, lunch, dinner for each day"}
            </p>
          </div>
          <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
            <UserPlus className="mr-2 h-4 w-4" />
            Create Account
          </Button>
        </div>
      </div>

      <div className="space-y-6">
        {data.days.map((dayData) => (
          <div key={dayData.day} className="space-y-3">
            <div className="bg-primary rounded-lg py-3 px-6">
              <h3 className="text-xl font-bold text-primary-foreground">
                Day {dayData.day}
              </h3>
            </div>
            <div className="grid grid-cols-3 gap-4">
              // ... meal cards
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

================== END OLD VERSIONS ================== */
