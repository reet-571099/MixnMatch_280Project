import { motion, useScroll, useTransform } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { ChatInterface } from "@/components/ChatInterface";
import { HeroBackground } from "@/components/HeroBackground";
import {
  ChefHat,
  Clock,
  Sparkles,
  Calendar,
  BookOpen,
  Heart,
  Leaf,
  Zap,
  Users,
  Star,
  TrendingUp,
  Target,
  Award,
} from "lucide-react";
import heroImage from "@/assets/hero-cooking.jpg";
import stirfryImage from "@/assets/recipe-stirfry.jpg";
import mediterraneanImage from "@/assets/recipe-mediterranean.jpg";
import curryImage from "@/assets/recipe-curry.jpg";
import howItWorksChatImage from "@/assets/how-it-works-chat.jpg";
import howItWorksRecipesImage from "@/assets/how-it-works-recipes.jpg";
import howItWorksSaveImage from "@/assets/how-it-works-save.jpg";
import avatarSarah from "@/assets/avatar-sarah.jpg";
import avatarJames from "@/assets/avatar-james.jpg";
import avatarEmma from "@/assets/avatar-emma.jpg";

const HomePage = () => {
  const { scrollY } = useScroll();
  const heroOpacity = useTransform(scrollY, [0, 300], [1, 0]);
  const heroScale = useTransform(scrollY, [0, 300], [1, 0.8]);

  const previewMessages = [
    { id: "1", role: "user" as const, content: "I have chicken, bell peppers, rice, and soy sauce" },
    {
      id: "2",
      role: "bot" as const,
      content: "Perfect! I can create a delicious stir-fry for you.",
      recipe: {
        title: "Asian Chicken Stir-Fry",
        ingredients: ["2 chicken breasts", "2 bell peppers", "1 cup rice", "3 tbsp soy sauce"],
        steps: ["Cook rice", "Cut chicken and peppers", "Stir-fry chicken", "Add peppers and soy sauce"],
      },
    },
    { id: "3", role: "user" as const, content: "Can you make it spicier?" },
    { id: "4", role: "bot" as const, content: "Absolutely! I'll add chili flakes and sriracha." },
  ];

  const stats = [
    { icon: Users, value: "50K+", label: "Active Users", color: "text-primary" },
    { icon: ChefHat, value: "100K+", label: "Recipes Created", color: "text-secondary" },
    { icon: TrendingUp, value: "95%", label: "Success Rate", color: "text-accent" },
    { icon: Heart, value: "30%", label: "Food Waste Reduced", color: "text-primary" },
  ];

  const howItWorks = [
    {
      image: howItWorksChatImage,
      title: "Start a Chat",
      description: "Simply type your ingredients, dietary needs, or recipe ideas. Our AI understands natural language and gets to work instantly.",
      gradient: "from-purple-400 to-pink-400",
    },
    {
      image: howItWorksRecipesImage,
      title: "Get Personalized Recipes",
      description: "Instantly receive a unique, AI-generated recipe—complete with overview, ingredients, and instructions tailored to your needs.",
      gradient: "from-pink-400 to-peach-400",
    },
    {
      image: howItWorksSaveImage,
      title: "Modify & Save",
      description: "Not quite right? Request changes in the chat. Save your favorites, revisit your history, and share creations with friends.",
      gradient: "from-peach-400 to-purple-400",
    },
  ];

  const testimonials = [
    {
      name: "Sarah Mitchell",
      role: "Home Cook",
      content: "Mix&Match changed how I cook! No more wasted groceries, and I'm discovering amazing recipes every week.",
      rating: 5,
      avatar: avatarSarah,
    },
    {
      name: "James Chen",
      role: "Busy Professional",
      content: "As someone with limited time, the quick meal suggestions are perfect. The AI understands exactly what I need.",
      rating: 5,
      avatar: avatarJames,
    },
    {
      name: "Emma Rodriguez",
      role: "Nutrition Enthusiast",
      content: "The dietary filters are incredible. Finally, an app that respects my vegan lifestyle while being creative!",
      rating: 5,
      avatar: avatarEmma,
    },
  ];

  const features = [
    {
      icon: ChefHat,
      title: "Conversational Recipe Builder",
      description: "Chat naturally with AI. Refine recipes through conversation until they're perfect.",
      gradient: "from-primary to-accent",
    },
    {
      icon: Calendar,
      title: "Smart Meal Planner",
      description: "AI-suggested weekly meals based on your pantry, preferences, and schedule.",
      gradient: "from-secondary to-primary",
    },
    {
      icon: Sparkles,
      title: "Pantry-Aware Suggestions",
      description: "Get recipe ideas using what you have. Reduce waste, save money.",
      gradient: "from-accent to-secondary",
    },
    {
      icon: BookOpen,
      title: "Tips & Swaps Knowledge",
      description: "Learn substitutions and cooking techniques from our culinary database.",
      gradient: "from-primary to-secondary",
    },
  ];

  const mockRecipes = [
    { name: "Mediterranean Bowl", image: mediterraneanImage, time: "25 min", tags: ["Vegetarian", "Healthy"], pantryMatch: 7 },
    { name: "Spicy Thai Curry", image: curryImage, time: "35 min", tags: ["Vegan", "Asian"], pantryMatch: 5 },
    { name: "Asian Stir-Fry", image: stirfryImage, time: "20 min", tags: ["Quick", "Protein"], pantryMatch: 6 },
  ];

  return (
    <div className="w-full overflow-hidden">
      {/* Hero Section with Parallax */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        {/* Animated Background with Ingredients */}
        <div className="absolute inset-0">
          <HeroBackground />
        </div>
        <motion.div
          style={{ opacity: heroOpacity, scale: heroScale }}
          className="absolute inset-0 bg-gradient-mesh opacity-15"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/60 to-background" />
        
        <div className="container relative z-10 grid lg:grid-cols-2 gap-16 items-center py-24 px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Badge variant="secondary" className="mb-4 px-4 py-2 text-base animate-pulse-glow">
                <Sparkles className="h-4 w-4 mr-2" />
                AI-Powered Cooking Assistant
              </Badge>
            </motion.div>
            
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-5xl lg:text-7xl font-bold leading-tight"
            >
              Turn pantry chaos into{" "}
              <span className="bg-gradient-primary bg-clip-text text-transparent">
                chef-level meals
              </span>
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-xl text-muted-foreground leading-relaxed"
            >
              Tell Mix&Match what's in your kitchen – get a personalized recipe in seconds.
              No more wasted food, just delicious possibilities.
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <Button size="lg" asChild className="text-lg group px-8 py-6 shadow-glow">
                <Link to="/create">
                  <ChefHat className="h-5 w-5 mr-2 group-hover:rotate-12 transition-transform" />
                  Start Recipe Chat
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="text-lg px-8 py-6">
                <Link to="/explore">Browse Recipes</Link>
              </Button>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="flex items-center gap-6 text-sm"
            >
              <div className="flex items-center gap-2">
                <Leaf className="h-5 w-5 text-secondary" />
                <span className="text-muted-foreground">Reduce food waste</span>
              </div>
              <div className="flex items-center gap-2">
                <Target className="h-5 w-5 text-accent" />
                <span className="text-muted-foreground">100% personalized</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-primary" />
                <span className="text-muted-foreground">Instant results</span>
              </div>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="h-[650px] relative"
          >
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="absolute inset-0 bg-gradient-primary opacity-20 blur-3xl rounded-full"
            />
            <div className="relative h-full">
              <ChatInterface previewMode messages={previewMessages} />
            </div>
          </motion.div>
        </div>

        {/* Floating Hero Image */}
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 1 }}
          className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-4xl opacity-10 pointer-events-none"
        >
          <img src={heroImage} alt="Fresh ingredients" className="w-full h-auto rounded-t-3xl" />
        </motion.div>
      </section>

      {/* How It Works Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-mesh opacity-5" />
        <div className="container relative z-10 px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="text-center mb-20"
          >
            <Badge variant="secondary" className="mb-4">How It Works</Badge>
            <h2 className="text-4xl lg:text-5xl font-bold mb-4">
              Create AI Recipes with{" "}
              <span className="bg-gradient-primary bg-clip-text text-transparent">
                Mix&Match
              </span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Discover the next generation of recipe creation. Mix&Match uses advanced AI and a chat-based interface to help you create and modify custom recipes in seconds.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-10">
            {howItWorks.map((step, index) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ delay: index * 0.15, duration: 0.6 }}
                whileHover={{ y: -10, scale: 1.02 }}
              >
                <Card className="h-full p-10 bg-white/60 backdrop-blur-xl rounded-3xl border border-white/30 hover:shadow-glow transition-all duration-500 group overflow-hidden">
                  <CardContent className="p-0 space-y-6">
                    <div className={`w-full h-48 rounded-2xl bg-gradient-to-br ${step.gradient} flex items-center justify-center overflow-hidden group-hover:scale-105 transition-transform duration-500`}>
                      <img 
                        src={step.image} 
                        alt={step.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <h3 className="font-bold text-2xl mb-3">{step.title}</h3>
                      <p className="text-muted-foreground text-lg leading-relaxed">{step.description}</p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-24 bg-muted/30 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-mesh opacity-5" />
        <div className="container relative z-10 px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ delay: index * 0.15, duration: 0.6 }}
              >
                <Card className="text-center p-10 bg-white/60 backdrop-blur-xl rounded-3xl border border-white/30 hover:shadow-glow transition-all duration-500 hover:scale-105">
                  <CardContent className="space-y-4 p-0">
                    <motion.div
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.6 }}
                      className={`w-16 h-16 rounded-2xl bg-gradient-primary mx-auto flex items-center justify-center ${stat.color}`}
                    >
                      <stat.icon className="h-8 w-8 text-white" />
                    </motion.div>
                    <div>
                      <div className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                        {stat.value}
                      </div>
                      <p className="text-muted-foreground mt-2">{stat.label}</p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24">
        <div className="container px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="text-center mb-20"
          >
            <Badge variant="secondary" className="mb-4">Features</Badge>
            <h2 className="text-4xl lg:text-5xl font-bold mb-4">
              Everything you need to become a{" "}
              <span className="bg-gradient-primary bg-clip-text text-transparent">
                confident chef
              </span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Powerful tools designed to make cooking easy, fun, and waste-free
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-10">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ delay: index * 0.15, duration: 0.6 }}
                whileHover={{ y: -10 }}
              >
                <Card className="h-full p-10 bg-white/60 backdrop-blur-xl rounded-3xl border border-white/30 hover:shadow-glow transition-all duration-500 group">
                  <CardContent className="p-0 space-y-6">
                    <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                      <feature.icon className="h-10 w-10 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-2xl mb-3">{feature.title}</h3>
                      <p className="text-muted-foreground text-lg leading-relaxed">{feature.description}</p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 bg-muted/30 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-mesh opacity-5" />
        <div className="container relative z-10 px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="text-center mb-20"
          >
            <Badge variant="secondary" className="mb-4">Testimonials</Badge>
            <h2 className="text-4xl lg:text-5xl font-bold mb-4">
              Loved by home cooks{" "}
              <span className="bg-gradient-secondary bg-clip-text text-transparent">
                everywhere
              </span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              See what our community has to say about their Mix&Match experience
            </p>
          </motion.div>

          <div className="relative">
            <div className="flex overflow-x-auto gap-8 pb-8 snap-x snap-mandatory scrollbar-hide">
              {testimonials.map((testimonial, index) => (
                <motion.div
                  key={testimonial.name}
                  initial={{ opacity: 0, x: 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ delay: index * 0.15, duration: 0.6 }}
                  className="min-w-[350px] md:min-w-[400px] snap-center"
                >
                  <Card className="h-full p-10 bg-white/60 backdrop-blur-xl rounded-3xl border border-white/30 hover:shadow-glow-secondary transition-all duration-500">
                    <CardContent className="p-0 space-y-6">
                      <div className="flex gap-1">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <Star 
                            key={i} 
                            className="h-5 w-5 fill-primary text-primary animate-twinkle" 
                            style={{ animationDelay: `${i * 0.2}s` }}
                          />
                        ))}
                      </div>
                      <p className="text-lg leading-relaxed italic">"{testimonial.content}"</p>
                      <div className="flex items-center gap-4">
                        <img 
                          src={testimonial.avatar} 
                          alt={testimonial.name}
                          className="w-12 h-12 rounded-full object-cover ring-2 ring-primary/20"
                        />
                        <div>
                          <div className="font-semibold">{testimonial.name}</div>
                          <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Recipe Preview Section */}
      <section className="py-24">
        <div className="container px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="text-center mb-20"
          >
            <Badge variant="secondary" className="mb-4">Explore</Badge>
            <h2 className="text-4xl lg:text-5xl font-bold mb-4">
              Discover recipes that match{" "}
              <span className="bg-gradient-primary bg-clip-text text-transparent">
                your pantry
              </span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              AI-powered suggestions based on what you already have
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-10 mb-16">
            {mockRecipes.map((recipe, index) => (
              <motion.div
                key={recipe.name}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ delay: index * 0.15, duration: 0.6 }}
                whileHover={{ y: -12 }}
              >
                <Card className="overflow-hidden hover:shadow-glow transition-all duration-500 group bg-white/60 backdrop-blur-xl rounded-3xl border border-white/30">
                  <div className="relative h-64 overflow-hidden">
                    <img
                      src={recipe.image}
                      alt={recipe.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <Badge className="absolute top-4 right-4 bg-primary/90 backdrop-blur">
                      {recipe.pantryMatch} items match
                    </Badge>
                  </div>
                  <CardContent className="p-6 space-y-4">
                    <h3 className="font-bold text-xl">{recipe.name}</h3>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      {recipe.time}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {recipe.tags.map((tag) => (
                        <Badge key={tag} variant="secondary">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    <div className="flex gap-2 pt-2">
                      <Button variant="outline" size="sm" className="flex-1">
                        View
                      </Button>
                      <Button size="sm" className="flex-1" asChild>
                        <Link to="/create">Open in Chat</Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          <div className="text-center">
            <Button size="lg" variant="glass" asChild className="text-lg">
              <Link to="/explore">
                View All Recipes
                <Award className="h-5 w-5 ml-2" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-mesh opacity-20" />
        <div className="container relative z-10 px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto"
          >
            <Card className="p-16 bg-white/60 backdrop-blur-xl rounded-3xl border border-white/30 text-center shadow-glow">
              <CardContent className="space-y-8 p-0">
                <motion.div
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  className="w-20 h-20 rounded-full bg-gradient-primary mx-auto flex items-center justify-center"
                >
                  <Sparkles className="h-10 w-10 text-white" />
                </motion.div>
                <h2 className="text-4xl lg:text-5xl font-bold">
                  Ready to transform your cooking?
                </h2>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                  Join thousands of home cooks who've discovered the joy of stress-free, waste-free cooking
                </p>
                <Button size="lg" className="text-lg" asChild>
                  <Link to="/create">
                    Get Started Free
                    <ChefHat className="h-5 w-5 ml-2" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
