import { useState } from "react";
import { ChatInterface } from "@/components/ChatInterface";
import { MealPlanDisplay } from "@/components/MealPlanDisplay";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

const MealPlan = () => {
  const [mealPlanData, setMealPlanData] = useState<any>(null);
  const isMobile = useIsMobile();

  const handleDownload = () => {
    // Create a simplified version of the meal plan for download
    if (!mealPlanData) return;
    
    let content = `${mealPlanData.title || "Your 7-Day Meal Plan"}\n`;
    content += `${mealPlanData.description || ""}\n\n`;
    
    const dayNames = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
    
    mealPlanData.days.forEach((day: any) => {
      content += `=== ${dayNames[day.day - 1] || `Day ${day.day}`} ===\n\n`;
      
      day.meals.forEach((meal: any) => {
        content += `${meal.type.toUpperCase()}: ${meal.title}\n`;
        content += `Description: ${meal.description}\n`;
        
        if (meal.ingredients && meal.ingredients.length > 0) {
          content += `Ingredients: ${meal.ingredients.join(", ")}\n`;
        }
        
        if (meal.steps && meal.steps.length > 0) {
          content += `Steps:\n`;
          meal.steps.forEach((step: string, index: number) => {
            content += `  ${index + 1}. ${step}\n`;
          });
        }
        
        if (meal.time) {
          content += `Cooking Time: ${meal.time} minutes\n`;
        }
        
        content += "\n";
      });
      
      content += "\n";
    });
    
    const blob = new Blob([content], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `meal-plan-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      <div className={`${isMobile ? 'flex flex-col h-auto' : 'flex h-screen'}`}>
        {/* Left Panel - Chat Interface */}
        <div className={`${isMobile ? 'w-full' : 'w-1/2'} border-r border-border ${isMobile ? 'border-b' : ''} p-4 overflow-y-auto`}>
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

            {/* Mobile: Show meal plan below chat when available */}
            {isMobile && mealPlanData && (
              <div className="mt-8">
                <div className="bg-white/80 backdrop-blur border border-border/50 rounded-lg p-4 mb-4">
                  <div className="flex justify-between items-center">
                    <h2 className="text-lg font-semibold text-foreground">Your Meal Plan</h2>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleDownload}
                      className="flex items-center gap-2 hover:bg-secondary hover:text-secondary-foreground transition-colors"
                      aria-label="Download meal plan as text file"
                    >
                      <Download className="h-4 w-4" />
                      Download
                    </Button>
                  </div>
                </div>
                <MealPlanDisplay data={mealPlanData} />
              </div>
            )}
          </div>
        </div>

        {/* Desktop: Right Panel - Meal Plan Display */}
        {!isMobile && (
          <div className="w-1/2 overflow-y-auto bg-gradient-to-br from-primary/10 to-secondary/10">
              {mealPlanData ? (
                <div>
                  {/* Download Header - Only show when meal plan exists */}
                  <div className="sticky top-0 z-10 bg-white/80 backdrop-blur border-b border-border/50 p-4">
                    <div className="flex justify-between items-center">
                      <h2 className="text-lg font-semibold text-foreground">Your Meal Plan</h2>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleDownload}
                        className="flex items-center gap-2 hover:bg-secondary hover:text-secondary-foreground transition-colors"
                        aria-label="Download meal plan as text file"
                      >
                        <Download className="h-4 w-4" />
                        Download
                      </Button>
                    </div>
                  </div>
                  <MealPlanDisplay data={mealPlanData} />
                </div>
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
                        <li>• "Plan my meals for 7 days, low-carb focus"</li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MealPlan;
