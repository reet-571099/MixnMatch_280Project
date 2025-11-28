import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, Clock, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";

const Favorites = () => {
  const favoriteRecipes = [
    {
      id: 1,
      name: "Asian Chicken Stir-Fry",
      time: "25 min",
      tags: ["Quick", "Protein-Rich"],
      savedDate: "2 days ago",
    },
    {
      id: 2,
      name: "Mediterranean Bowl",
      time: "20 min",
      tags: ["Vegetarian", "Healthy"],
      savedDate: "1 week ago",
    },
    {
      id: 3,
      name: "Spicy Thai Curry",
      time: "35 min",
      tags: ["Vegan", "Asian"],
      savedDate: "2 weeks ago",
    },
  ];

  return (
    <div className="container py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
          <Heart className="h-10 w-10 text-primary fill-primary" />
          Favorites
        </h1>
        <p className="text-muted-foreground">Your saved recipes for easy access</p>
      </div>

      {favoriteRecipes.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Heart className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">No favorites yet</h3>
            <p className="text-muted-foreground mb-4">Start saving recipes you love!</p>
            <Button>Explore Recipes</Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {favoriteRecipes.map((recipe) => (
            <Card key={recipe.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-bold text-xl mb-2">{recipe.name}</h3>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {recipe.time}
                      </div>
                      <span>Saved {recipe.savedDate}</span>
                    </div>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {recipe.tags.map((tag) => (
                        <Badge key={tag} variant="secondary">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      {/* Note: Update with real recipe ID when favorites functionality is fully implemented */}
                      <Button variant="outline" size="sm" asChild>
                        <Link to={`/recipes/${recipe.id}`}>
                          View Recipe
                        </Link>
                      </Button>
                      <Button size="sm">Open in Chat</Button>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Favorites;
