import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { User } from "lucide-react";

const Profile = () => {
  const dietaryPreferences = ["Vegan", "Vegetarian", "Gluten-Free", "Nut-Free", "Dairy-Free", "Keto", "Paleo"];
  const cuisines = ["Italian", "Mexican", "Asian", "Mediterranean", "American", "Indian", "Thai", "French"];
  const dislikedIngredients = ["Cilantro", "Olives", "Mushrooms"];

  return (
    <div className="container py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
          <User className="h-10 w-10 text-primary" />
          Profile & Preferences
        </h1>
        <p className="text-muted-foreground">Customize Mix&Match to match your taste</p>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Dietary Preferences</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {dietaryPreferences.map((diet) => (
                <Badge
                  key={diet}
                  variant="outline"
                  className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
                >
                  {diet}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Favorite Cuisines</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {cuisines.map((cuisine) => (
                <Badge
                  key={cuisine}
                  variant="secondary"
                  className="cursor-pointer hover:opacity-80 transition-opacity"
                >
                  {cuisine}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Cooking Preferences</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="quick-meals">Prefer Quick Meals ({"<"} 30 min)</Label>
                <p className="text-sm text-muted-foreground">Prioritize recipes that are fast to prepare</p>
              </div>
              <Switch id="quick-meals" />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="high-protein">High Protein Focus</Label>
                <p className="text-sm text-muted-foreground">Show more protein-rich recipes</p>
              </div>
              <Switch id="high-protein" />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="one-pot">One-Pot Meals</Label>
                <p className="text-sm text-muted-foreground">Prefer recipes with minimal cleanup</p>
              </div>
              <Switch id="one-pot" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Disliked Ingredients</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="disliked">Add ingredients to avoid</Label>
              <div className="flex gap-2 mt-2">
                <Input id="disliked" placeholder="e.g., cilantro, mushrooms..." />
                <Button>Add</Button>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-2">
              {dislikedIngredients.map((ingredient) => (
                <Badge key={ingredient} variant="destructive">
                  {ingredient}
                  <button className="ml-2 hover:opacity-70">×</button>
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button size="lg">Save Preferences</Button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
