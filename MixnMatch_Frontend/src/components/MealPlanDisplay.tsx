import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { UserPlus } from "lucide-react";

interface Meal {
  title: string;
  description: string;
  type: "breakfast" | "lunch" | "dinner";
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

export const MealPlanDisplay = ({ data }: MealPlanDisplayProps) => {
  const getMealsByType = (meals: Meal[], type: string) => {
    return meals.find(m => m.type === type);
  };

  return (
    <div className="p-8">
      {/* Header */}
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

      {/* Days */}
      <div className="space-y-6">
        {data.days.map((dayData) => (
          <div key={dayData.day} className="space-y-3">
            {/* Day Header */}
            <div className="bg-primary rounded-lg py-3 px-6">
              <h3 className="text-xl font-bold text-primary-foreground">
                Day {dayData.day}
              </h3>
            </div>

            {/* Meals Grid */}
            <div className="grid grid-cols-3 gap-4">
              {/* Breakfast */}
              <MealCard 
                meal={getMealsByType(dayData.meals, "breakfast")} 
                type="Breakfast"
                borderColor="border-l-green-500"
              />

              {/* Lunch */}
              <MealCard 
                meal={getMealsByType(dayData.meals, "lunch")} 
                type="Lunch"
                borderColor="border-l-blue-500"
              />

              {/* Dinner */}
              <MealCard 
                meal={getMealsByType(dayData.meals, "dinner")} 
                type="Dinner"
                borderColor="border-l-purple-500"
              />
            </div>
          </div>
        ))}
      </div>

      {/* Footer Note */}
      <div className="mt-8 p-4 bg-muted/50 rounded-lg border border-border">
        <p className="text-sm text-muted-foreground text-center">
          Content is AI-generated and may contain inaccuracies. Use your best judgement when making AI recipes.
        </p>
      </div>
    </div>
  );
};

interface MealCardProps {
  meal?: Meal;
  type: string;
  borderColor: string;
}

const MealCard = ({ meal, type, borderColor }: MealCardProps) => {
  if (!meal) {
    return (
      <Card className={`border-l-4 ${borderColor}`}>
        <CardHeader className="pb-3">
          <CardDescription className="text-xs font-medium uppercase tracking-wide">
            {type}
          </CardDescription>
          <CardTitle className="text-base">No meal planned</CardTitle>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className={`border-l-4 ${borderColor} hover:shadow-md transition-shadow`}>
      <CardHeader className="pb-3">
        <CardDescription className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          {type}
        </CardDescription>
        <CardTitle className="text-base leading-tight">{meal.title}</CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <p className="text-sm text-muted-foreground leading-relaxed">
          {meal.description}
        </p>
      </CardContent>
    </Card>
  );
};
