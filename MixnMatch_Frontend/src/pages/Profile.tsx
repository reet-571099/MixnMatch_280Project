import {
  Card,
  CardContent,
  CardHeader,
  Typography,
  Chip,
  Button,
  TextField,
  Switch,
  Box,
} from "@mui/material";
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
          <CardHeader
            title={<Typography variant="h6">Dietary Preferences</Typography>}
          />
          <CardContent>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
              {dietaryPreferences.map((diet) => (
                <Chip
                  key={diet}
                  label={diet}
                  variant="outlined"
                  clickable
                  sx={{
                    cursor: "pointer",
                    "&:hover": {
                      backgroundColor: "primary.main",
                      color: "primary.contrastText",
                    },
                    transition: "all 0.2s",
                  }}
                />
              ))}
            </Box>
          </CardContent>
        </Card>

        <Card>
          <CardHeader
            title={<Typography variant="h6">Favorite Cuisines</Typography>}
          />
          <CardContent>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
              {cuisines.map((cuisine) => (
                <Chip
                  key={cuisine}
                  label={cuisine}
                  color="secondary"
                  clickable
                  sx={{
                    cursor: "pointer",
                    "&:hover": {
                      opacity: 0.8,
                    },
                    transition: "opacity 0.2s",
                  }}
                />
              ))}
            </Box>
          </CardContent>
        </Card>

        <Card>
          <CardHeader
            title={<Typography variant="h6">Cooking Preferences</Typography>}
          />
          <CardContent>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <Box>
                  <Typography component="label" htmlFor="quick-meals">Prefer Quick Meals ({"<"} 30 min)</Typography>
                  <Typography variant="body2" color="text.secondary">Prioritize recipes that are fast to prepare</Typography>
                </Box>
                <Switch id="quick-meals" />
              </Box>

              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <Box>
                  <Typography component="label" htmlFor="high-protein">High Protein Focus</Typography>
                  <Typography variant="body2" color="text.secondary">Show more protein-rich recipes</Typography>
                </Box>
                <Switch id="high-protein" />
              </Box>

              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <Box>
                  <Typography component="label" htmlFor="one-pot">One-Pot Meals</Typography>
                  <Typography variant="body2" color="text.secondary">Prefer recipes with minimal cleanup</Typography>
                </Box>
                <Switch id="one-pot" />
              </Box>
            </Box>
          </CardContent>
        </Card>

        <Card>
          <CardHeader
            title={<Typography variant="h6">Disliked Ingredients</Typography>}
          />
          <CardContent>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <Box>
                <Typography component="label" htmlFor="disliked">Add ingredients to avoid</Typography>
                <Box sx={{ display: "flex", gap: 1, mt: 1 }}>
                  <TextField id="disliked" placeholder="e.g., cilantro, mushrooms..." size="small" fullWidth />
                  <Button variant="contained">Add</Button>
                </Box>
              </Box>

              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                {dislikedIngredients.map((ingredient) => (
                  <Chip
                    key={ingredient}
                    label={ingredient}
                    color="error"
                    onDelete={() => {}}
                  />
                ))}
              </Box>
            </Box>
          </CardContent>
        </Card>

        <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
          <Button variant="contained" size="large">Save Preferences</Button>
        </Box>
      </div>
    </div>
  );
};

export default Profile;
