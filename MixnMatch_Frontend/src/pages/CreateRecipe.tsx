import { ChatInterface } from "@/components/ChatInterface";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Users, Flame } from "lucide-react";

const CreateRecipe = () => {
  return (
    <div className="container py-8">
      <div className="grid lg:grid-cols-[1fr_300px] gap-6">
        <div>
          <ChatInterface />
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Your Preferences</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm font-medium mb-2">Active Filters</p>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary">Vegan</Badge>
                  <Badge variant="secondary">{"<"} 30 min</Badge>
                </div>
              </div>
              
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span>Serves: 2-4 people</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span>Time: Quick meals</span>
                </div>
                <div className="flex items-center gap-2">
                  <Flame className="h-4 w-4 text-muted-foreground" />
                  <span>Skill: Beginner</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Quick Pantry</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {["Pasta", "Tomatoes", "Garlic", "Olive Oil", "Basil"].map((item) => (
                  <Badge key={item} variant="outline">
                    {item}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Recent Recipes</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="text-sm p-2 rounded hover:bg-muted cursor-pointer">
                Asian Chicken Stir-Fry
              </div>
              <div className="text-sm p-2 rounded hover:bg-muted cursor-pointer">
                Mediterranean Bowl
              </div>
              <div className="text-sm p-2 rounded hover:bg-muted cursor-pointer">
                Quick Pasta Primavera
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CreateRecipe;
