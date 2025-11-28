import { useState } from "react";
import { ChatInterface } from "@/components/ChatInterface";
import { MealPlanDisplay } from "@/components/MealPlanDisplay";
import { Button } from "@/components/ui/button";

const MealPlan = () => {
  const [mealPlanData, setMealPlanData] = useState<any>(null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      <div className="flex h-screen">
        {/* Left Panel - Chat Interface */}
        <div className="w-1/2 border-r border-border p-4 overflow-y-auto">
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-6 pt-8">
              <h1 className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-2">
                AI Meal Planner
              </h1>
              <p className="text-muted-foreground">
                Create personalized meal plans for your week
              </p>
            </div>
            <ChatInterface onMealPlanGenerated={setMealPlanData} />
          </div>
        </div>

        {/* Right Panel - Meal Plan Display */}
        <div className="w-1/2 overflow-y-auto bg-gradient-to-br from-primary/10 to-secondary/10">
          {mealPlanData ? (
            <MealPlanDisplay data={mealPlanData} />
          ) : (
            <div className="flex items-center justify-center h-full p-8">
              <div className="text-center max-w-md">
                <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-primary/10 flex items-center justify-center">
                  <svg className="w-10 h-10 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-semibold mb-3 text-foreground">No Meal Plan Yet</h3>
                <p className="text-muted-foreground mb-6">
                  Request a meal plan from the chat to see it displayed here. Try asking for a weekly meal plan with your dietary preferences!
                </p>
                <div className="space-y-2 text-left bg-card/50 backdrop-blur-sm rounded-lg p-4 border border-border">
                  <p className="text-sm font-medium text-foreground">Try asking:</p>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• "Create a 7-day meal plan with high protein"</li>
                    <li>• "Give me a vegetarian meal plan for the week"</li>
                    <li>• "Plan my meals for 5 days, low-carb focus"</li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MealPlan;
