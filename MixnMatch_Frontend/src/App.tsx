import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { AuthProvider } from "@/contexts/AuthContext";
import HomePage from "./pages/HomePage";
import CreateRecipe from "./pages/CreateRecipe";
import MealPlanner from "./pages/MealPlanner";
import Explore from "./pages/Explore";
import RecipeDetailPage from "./pages/RecipeDetailPage";
import Pantry from "./pages/Pantry";
import TipsSwaps from "./pages/TipsSwaps";
import Favorites from "./pages/Favorites";
import Profile from "./pages/Profile";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route element={<Layout />}>
              <Route path="/" element={<HomePage />} />
              <Route path="/create" element={<CreateRecipe />} />
              <Route path="/meal-planner" element={<MealPlanner />} />
              <Route path="/explore" element={<Explore />} />
              <Route path="/recipes/:id" element={<RecipeDetailPage />} />
              <Route path="/pantry" element={<Pantry />} />
              <Route path="/tips-swaps" element={<TipsSwaps />} />
              <Route path="/favorites" element={<Favorites />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="*" element={<NotFound />} />
            </Route>
            {/* Auth routes without Layout */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
