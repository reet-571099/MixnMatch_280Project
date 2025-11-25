import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search, RefreshCw, Thermometer, Archive, Scale, Salad, UtensilsCrossed } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const TipsSwaps = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const categories = [
    {
      name: "Substitutions",
      icon: RefreshCw,
      gradient: "from-purple-400/20 to-pink-400/20",
      iconColor: "text-purple-500",
      tips: [
        {
          question: "What can I substitute for buttermilk?",
          answer: "Mix 1 cup of milk with 1 tablespoon of lemon juice or vinegar. Let it sit for 5 minutes before using.",
        },
        {
          question: "What's a good egg substitute for baking?",
          answer: "Try 1/4 cup of applesauce, mashed banana, or 1 tablespoon of ground flaxseed mixed with 3 tablespoons of water per egg.",
        },
        {
          question: "Can I substitute dried herbs for fresh?",
          answer: "Yes! Use 1/3 the amount of dried herbs as you would fresh, since dried herbs are more concentrated.",
        },
        {
          question: "What can I use instead of heavy cream?",
          answer: "Mix 3/4 cup milk with 1/3 cup melted butter, or use coconut cream for a dairy-free option.",
        },
        {
          question: "What's a good substitute for baking powder?",
          answer: "Mix 1/4 teaspoon baking soda with 1/2 teaspoon cream of tartar for every 1 teaspoon of baking powder needed.",
        },
      ],
    },
    {
      name: "Techniques",
      icon: UtensilsCrossed,
      gradient: "from-orange-400/20 to-amber-400/20",
      iconColor: "text-orange-500",
      tips: [
        {
          question: "How do I know when my oil is hot enough?",
          answer: "Drop a small piece of bread into the oil. If it sizzles and turns golden in about 60 seconds, the oil is ready.",
        },
        {
          question: "What's the best way to season cast iron?",
          answer: "Clean thoroughly, dry completely, apply thin layer of oil, bake upside down at 450°F for 1 hour. Repeat 2-3 times.",
        },
        {
          question: "How do I properly caramelize onions?",
          answer: "Cook sliced onions over medium-low heat for 30-45 minutes, stirring occasionally. Add a pinch of salt and a splash of water if they start to burn.",
        },
        {
          question: "What's the secret to fluffy scrambled eggs?",
          answer: "Whisk eggs with a splash of milk or cream, cook over medium-low heat, and stir continuously. Remove from heat while still slightly wet.",
        },
        {
          question: "How do I properly rest meat after cooking?",
          answer: "Let meat rest for 5-10 minutes (steaks) or 15-30 minutes (roasts) loosely covered with foil. This allows juices to redistribute.",
        },
      ],
    },
    {
      name: "Storage",
      icon: Archive,
      gradient: "from-blue-400/20 to-cyan-400/20",
      iconColor: "text-blue-500",
      tips: [
        {
          question: "How can I make my vegetables last longer?",
          answer: "Store leafy greens with a paper towel in a sealed container. Keep tomatoes at room temperature until ripe, then refrigerate.",
        },
        {
          question: "What's the best way to store fresh herbs?",
          answer: "Trim stems, place in a glass of water like flowers, cover loosely with a plastic bag, and refrigerate. Change water every few days.",
        },
        {
          question: "How long can I keep leftovers in the fridge?",
          answer: "Most cooked foods last 3-4 days when properly stored in airtight containers. Label with dates to track freshness.",
        },
        {
          question: "Should I store bread in the fridge?",
          answer: "No! Bread goes stale faster in the fridge. Keep it at room temperature for 2-3 days, or freeze for longer storage.",
        },
        {
          question: "How do I store cut avocados?",
          answer: "Brush with lemon juice, wrap tightly in plastic wrap, and refrigerate. Store with the pit in place to minimize browning.",
        },
      ],
    },
    {
      name: "Measurements",
      icon: Scale,
      gradient: "from-green-400/20 to-emerald-400/20",
      iconColor: "text-green-500",
      tips: [
        {
          question: "How many tablespoons are in a cup?",
          answer: "There are 16 tablespoons in 1 cup. Remember: 1 cup = 16 tbsp = 48 tsp.",
        },
        {
          question: "How do I measure flour correctly?",
          answer: "Spoon flour into measuring cup and level off with a knife. Never pack or shake the cup, as this adds extra flour.",
        },
        {
          question: "What's the difference between a dash and a pinch?",
          answer: "A pinch is about 1/16 teaspoon (amount between thumb and finger). A dash is about 1/8 teaspoon (6-8 drops).",
        },
        {
          question: "How much does one clove of garlic equal?",
          answer: "One medium clove equals about 1/2 teaspoon minced, or 1/4 teaspoon garlic powder.",
        },
        {
          question: "How do I convert between volume and weight for butter?",
          answer: "1 stick of butter = 1/2 cup = 8 tablespoons = 4 ounces = 113 grams.",
        },
      ],
    },
    {
      name: "Diet Swaps",
      icon: Salad,
      gradient: "from-pink-400/20 to-rose-400/20",
      iconColor: "text-pink-500",
      tips: [
        {
          question: "What's a good gluten-free flour substitute?",
          answer: "Use a 1:1 gluten-free baking blend, or try almond flour for cookies and coconut flour for cakes (adjust liquid ratios).",
        },
        {
          question: "How can I make a recipe dairy-free?",
          answer: "Replace milk with almond, oat, or coconut milk. Use coconut oil or vegan butter instead of dairy butter.",
        },
        {
          question: "What's a low-carb substitute for pasta?",
          answer: "Try zucchini noodles, shirataki noodles, spaghetti squash, or cauliflower rice for various dishes.",
        },
        {
          question: "How do I reduce sugar in baking?",
          answer: "You can typically reduce sugar by 1/4 to 1/3 in most recipes. Replace with mashed banana, applesauce, or dates for natural sweetness.",
        },
        {
          question: "What's a vegan egg substitute in cookies?",
          answer: "Use flax eggs (1 tbsp ground flax + 3 tbsp water per egg), chia eggs, or 1/4 cup applesauce per egg.",
        },
      ],
    },
    {
      name: "Equipment",
      icon: Thermometer,
      gradient: "from-indigo-400/20 to-violet-400/20",
      iconColor: "text-indigo-500",
      tips: [
        {
          question: "What's the difference between convection and regular oven?",
          answer: "Convection ovens use a fan to circulate hot air, cooking food faster and more evenly. Reduce temperature by 25°F or time by 25%.",
        },
        {
          question: "Do I really need a stand mixer?",
          answer: "Not always! A hand mixer works for most recipes. Stand mixers are best for heavy doughs, large batches, and prolonged mixing.",
        },
        {
          question: "What's the best way to sharpen kitchen knives?",
          answer: "Use a whetstone for best results, or a honing steel for regular maintenance. Professional sharpening once or twice a year is ideal.",
        },
        {
          question: "Can I use metal utensils on non-stick pans?",
          answer: "No! Metal scratches the coating. Use silicone, wood, or nylon utensils to protect your non-stick surfaces.",
        },
        {
          question: "What's the difference between a Dutch oven and a slow cooker?",
          answer: "Dutch ovens are versatile cast iron pots for stovetop and oven use. Slow cookers are electric and designed for low, unattended cooking.",
        },
      ],
    },
  ];

  // Filter categories based on search query
  const filteredCategories = categories.map(category => ({
    ...category,
    tips: category.tips.filter(tip =>
      tip.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tip.answer.toLowerCase().includes(searchQuery.toLowerCase())
    ),
  })).filter(category => category.tips.length > 0);

  const displayCategories = searchQuery ? filteredCategories : categories;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-purple-50/30 to-peach-50/30">
      <div className="container py-12 max-w-7xl">
        {/* Header */}
        <div className="text-center mb-12 animate-fade-in">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-peach-500 bg-clip-text text-transparent">
            Tips & Swaps
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Your essential cooking knowledge base with ingredient substitutions, techniques, and pro tips
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-12 max-w-2xl mx-auto animate-fade-in" style={{ animationDelay: "0.1s" }}>
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Search cooking tips, substitutions, and techniques..."
              className="pl-12 h-14 text-lg backdrop-blur-xl bg-white/80 border-purple-200 shadow-lg focus:shadow-glow transition-all"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          {searchQuery && (
            <p className="text-sm text-muted-foreground mt-3 text-center">
              Found {filteredCategories.reduce((acc, cat) => acc + cat.tips.length, 0)} results
            </p>
          )}
        </div>

        {/* Category Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {displayCategories.map((category, index) => {
            const Icon = category.icon;
            return (
              <Card
                key={category.name}
                className="backdrop-blur-xl bg-white/60 border-purple-100 shadow-lg hover:shadow-glow transition-all duration-300 overflow-hidden animate-fade-in"
                style={{ animationDelay: `${0.1 * (index + 2)}s` }}
              >
                <CardHeader className={`bg-gradient-to-br ${category.gradient} border-b border-purple-100/50`}>
                  <CardTitle className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-white/80 shadow-sm">
                      <Icon className={`h-6 w-6 ${category.iconColor}`} />
                    </div>
                    <span className="text-2xl">{category.name}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <Accordion type="single" collapsible className="w-full">
                    {category.tips.map((tip, tipIndex) => (
                      <AccordionItem
                        key={tipIndex}
                        value={`${category.name}-${tipIndex}`}
                        className="border-purple-100"
                      >
                        <AccordionTrigger className="text-left hover:text-purple-600 transition-colors">
                          {tip.question}
                        </AccordionTrigger>
                        <AccordionContent className="text-muted-foreground leading-relaxed">
                          {tip.answer}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {searchQuery && displayCategories.length === 0 && (
          <div className="text-center py-16 animate-fade-in">
            <p className="text-lg text-muted-foreground">
              No tips found for "{searchQuery}". Try a different search term.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TipsSwaps;
