import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sparkles, Zap, Heart, Leaf, Clock, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";

interface TemplatePromptsProps {
  onSelect: (prompt: string) => void;
}

const TEMPLATES = [
  {
    icon: Heart,
    title: "High-Protein Dinner",
    prompt: "Make a 600-cal high-protein dinner with pasta and tomatoes",
    color: "text-red-500",
  },
  {
    icon: Zap,
    title: "Quick & Easy",
    prompt: "Quick meal under 20 minutes with chicken and vegetables",
    color: "text-yellow-500",
  },
  {
    icon: Leaf,
    title: "Vegan Delight",
    prompt: "Creative vegan recipe with beans, rice, and seasonal vegetables",
    color: "text-green-500",
  },
  {
    icon: Clock,
    title: "Meal Prep",
    prompt: "3-day meal prep under 30 min per day, balanced macros",
    color: "text-blue-500",
  },
  {
    icon: TrendingUp,
    title: "Low-Carb",
    prompt: "Low-carb, high-protein dinner under 500 calories",
    color: "text-purple-500",
  },
  {
    icon: Sparkles,
    title: "Gourmet Special",
    prompt: "Impressive dinner for 2, restaurant-quality, under 45 minutes",
    color: "text-pink-500",
  },
];

export const TemplatePrompts = ({ onSelect }: TemplatePromptsProps) => {
  return (
    <motion.div
      className="space-y-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="text-center space-y-2">
        <h3 className="text-lg font-semibold text-foreground">Get Started</h3>
        <p className="text-sm text-muted-foreground">
          Try one of these popular prompts or type your own
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {TEMPLATES.map((template, index) => {
          const Icon = template.icon;
          return (
            <motion.div
              key={template.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card
                className="p-4 cursor-pointer hover:shadow-glow transition-all duration-300 border-2 border-transparent hover:border-primary/20 group"
                onClick={() => onSelect(template.prompt)}
              >
                <div className="flex items-start gap-3">
                  <div className={`${template.color} mt-1 group-hover:scale-110 transition-transform`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-sm mb-1 group-hover:text-primary transition-colors">
                      {template.title}
                    </h4>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {template.prompt}
                    </p>
                  </div>
                </div>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
};
