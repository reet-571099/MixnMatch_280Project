import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Skeleton } from "@/components/ui/skeleton";
import { Send, RotateCcw, Loader2, Plus, X, ChevronDown, ChevronUp, AlertCircle } from "lucide-react";
import { RecipeCard, Recipe } from "./RecipeCard";
import { MacroConstraintsPanel, MacroConstraints } from "./MacroConstraints";
import { TemplatePrompts } from "./TemplatePrompts";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface PantryItem {
  id: string;
  name: string;
  qty?: string;
  unit?: string;
}

interface Message {
  id: string;
  role: "user" | "bot";
  content: string;
  recipe?: Recipe;
  isError?: boolean;
}

interface ChatInterfaceProps {
  previewMode?: boolean;
  messages?: Message[];
  showConstraints?: boolean;
  onMealPlanGenerated?: (data: any) => void;
}

const UNITS = ["none", "tsp", "tbsp", "cup", "ml", "l", "g", "kg", "oz", "lb", "pcs"];
const COMMON_INGS = [
  "chicken breast","egg","pasta","rice","bell pepper","onion","garlic",
  "tomato","spinach","mushroom","olive oil","butter","milk","tofu",
  "soy sauce","chili flakes","cumin","turmeric","basil","cilantro","yogurt","cheese"
];

export const ChatInterface = ({ 
  previewMode = false, 
  messages: initialMessages,
  showConstraints = true,
  onMealPlanGenerated
}: ChatInterfaceProps) => {
  const containerRef = useRef(null);
  const [messages, setMessages] = useState<Message[]>(initialMessages || []);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [selectedChips, setSelectedChips] = useState<string[]>([]);
  const [pantry, setPantry] = useState<PantryItem[]>([]);
  const [constraintsVisible, setConstraintsVisible] = useState(false);

  // Structured ingredient inputs
  const [ingName, setIngName] = useState("");
  const [ingQty, setIngQty] = useState("");
  const [ingUnit, setIngUnit] = useState<string>("none");
  const [openAuto, setOpenAuto] = useState(false);

  // Macro constraints
  const [constraints, setConstraints] = useState<MacroConstraints>({
    calories: { value: 600, locked: false, min: 200, max: 1500 },
    protein: { value: 30, locked: false, min: 10, max: 100 },
    carbs: { value: 60, locked: false, min: 10, max: 150 },
    fats: { value: 20, locked: false, min: 5, max: 80 },
    time: { value: 30, locked: false, min: 5, max: 120 },
  });

  const nameInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Scroll to the top of the page or container on mount
    if (containerRef.current) {
      containerRef.current.scrollTop = 0;
    } else {
      window.scrollTo(0, 0);
    }
  }, []);

  const quickChips = [
    { label: "Vegan", value: "vegan", persistent: true },
    { label: "Gluten-Free", value: "glutenfree", persistent: true },
    { label: "Halal", value: "halal", persistent: true },
    { label: "Keto", value: "keto", persistent: true },
    { label: "Dairy-Free", value: "dairyfree", persistent: true },
  ];

  const quickReplies = ["Make it spicier", "Make it vegan", "Shorten cook time", "Add more protein"];

  const suggestions = useMemo(() => {
    if (!ingName.trim()) return COMMON_INGS.slice(0, 6);
    const q = ingName.toLowerCase();
    return COMMON_INGS.filter(n => n.includes(q)).slice(0, 7);
  }, [ingName]);

  const addPantryItem = (name: string, qty?: string, unit?: string) => {
    const clean = name.trim();
    if (!clean) return;
    const cleanUnit = unit && unit !== "none" ? unit : undefined;
    setPantry(prev => [...prev, { id: crypto.randomUUID(), name: clean, qty: qty?.trim() || undefined, unit: cleanUnit }]);
    setIngName("");
    setIngQty("");
    setIngUnit("none");
    setOpenAuto(false);
    requestAnimationFrame(() => nameInputRef.current?.focus());
  };

  const removePantryItem = (id: string) => setPantry(prev => prev.filter(p => p.id !== id));

  const maybeTokenize = (raw: string) => {
    const s = raw.trim();
    if (!s) return;
    if (s.includes(",")) {
      s.split(",").map(t => t.trim()).filter(Boolean).forEach(n => addPantryItem(n));
      return;
    }
    const parts = s.split(/\s+/);
    if (parts.length >= 3 && /^\d+([\/\.]\d+)?$/.test(parts[0]) && UNITS.includes(parts[1])) {
      addPantryItem(parts.slice(2).join(" "), parts[0], parts[1]);
    } else {
      addPantryItem(s);
    }
  };

  const toggleChip = (value: string) => {
    if (previewMode) return;
    setSelectedChips(prev => (prev.includes(value) ? prev.filter(v => v !== value) : [...prev, value]));
  };

  const buildUserPrompt = () => {
    const pantryLine =
      pantry.length > 0
        ? `Ingredients: ${pantry
            .map(p => [p.qty, p.unit, p.name].filter(Boolean).join(" "))
            .join(", ")}.`
        : "";

    const tagLine = selectedChips.length ? `Dietary: ${selectedChips.join(", ")}.` : "";
    
    const constraintLines = [];
    Object.entries(constraints).forEach(([key, c]) => {
      if (c.locked) {
        const labels: Record<string, string> = {
          calories: "kcal", protein: "g protein", carbs: "g carbs", 
          fats: "g fats", time: "min max"
        };
        constraintLines.push(`${c.value} ${labels[key]} (hard limit)`);
      }
    });
    const constraintLine = constraintLines.length ? `Constraints: ${constraintLines.join(", ")}.` : "";

    const nl = input.trim();

    return [pantryLine, tagLine, constraintLine, nl].filter(Boolean).join("\n");
  };

  const handleSend = async () => {
    if ((previewMode) || (!input.trim() && pantry.length === 0)) return;

    const composed = buildUserPrompt();
    const userMessage: Message = { id: Date.now().toString(), role: "user", content: composed };
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    // Check if this is a meal plan request
    const isMealPlanRequest = /meal\s*plan|weekly\s*plan|week|days?\s*of\s*meals?/i.test(composed);
    const daysMatch = composed.match(/(\d+)\s*[-]?\s*days?/i);
    const numDays = daysMatch ? parseInt(daysMatch[1]) : 7;

    if (isMealPlanRequest && onMealPlanGenerated) {
      // Generate meal plan data
      setTimeout(() => {
        const mealTitles = [
          ["Scrambled Eggs with Cheese and Avocado", "Greek Yogurt with Walnuts and Honey", "Omelette with Bacon and Cheese", "Full English Breakfast", "Protein Pancakes with Peanut Butter", "Breakfast Burrito with Cheese", "Smoked Salmon with Cream Cheese"],
          ["Grilled Chicken Caesar Salad", "Salmon Salad with Olive Oil Dressing", "Tuna Salad with Mayonnaise and Boiled Eggs", "Chicken Alfredo Pasta", "Turkey Club Sandwich with Avocado", "Chicken Thigh Curry", "Beef Burger with Cheese and Bacon"],
          ["Beef Stroganoff with Sour Cream", "Pork Chops with Creamy Mushroom Sauce", "Lamb Chops with Garlic Butter", "Ribeye Steak with Herb Butter", "Baked Salmon with Cream Sauce", "BBQ Ribs with Coleslaw", "Roast Chicken with Creamy Mashed Potatoes"]
        ];

        const mealDescriptions = [
          ["Protein-rich eggs with healthy fats from cheese and avocado", "Thick yogurt with protein and walnuts for saturated fats", "Egg omelette packed with protein and fatty bacon and cheese", "Eggs, bacon, sausage, and beans for a protein and fat-rich start", "High-protein pancakes topped with creamy peanut butter", "Scrambled eggs, cheese, and sausage in a tortilla wrap", "Smoked salmon on bagel with cream cheese spread"],
          ["Grilled chicken with creamy Caesar dressing and Parmesan cheese", "Omega-3 rich salmon with healthy fat olive oil dressing", "Protein-packed tuna with eggs and creamy mayo", "Creamy Alfredo sauce with grilled chicken and pasta", "Turkey breast with bacon, avocado, and cheese", "Rich coconut curry with tender chicken thighs", "Juicy beef patty with melted cheese and crispy bacon"],
          ["Tender beef in creamy sour cream sauce providing protein and fats", "Juicy pork chops in a rich mushroom cream sauce", "Tender lamb chops topped with rich garlic butter", "Juicy ribeye steak with melted herb butter on top", "Oven-baked salmon with rich cream-based sauce", "Slow-cooked BBQ ribs with creamy coleslaw side", "Whole roasted chicken with butter mashed potatoes"]
        ];

        const days = [];
        for (let i = 0; i < numDays; i++) {
          days.push({
            day: i + 1,
            meals: [
              { type: "breakfast", title: mealTitles[0][i % 7], description: mealDescriptions[0][i % 7] },
              { type: "lunch", title: mealTitles[1][i % 7], description: mealDescriptions[1][i % 7] },
              { type: "dinner", title: mealTitles[2][i % 7], description: mealDescriptions[2][i % 7] }
            ]
          });
        }

        const mealPlanData = {
          title: `${numDays}-Day Meal Plan`,
          description: "breakfast, lunch, dinner for each day",
          days
        };

        onMealPlanGenerated(mealPlanData);
        
        const botMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: "bot",
          content: `I've created a ${numDays}-day meal plan for you! Check the right panel to see your personalized meal schedule.`,
        };
        setMessages(prev => [...prev, botMessage]);
        setIsTyping(false);
      }, 2000);
    } else {
      // Simulate streaming with skeleton for recipe
      setTimeout(() => {
        const botMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: "bot",
          content: "I found a great recipe for you!",
          recipe: {
            title: "Quick Asian-Style Stir-Fry",
            summary: "A delicious, protein-packed meal ready in under 25 minutes",
            ingredients: pantry.length > 0 
              ? pantry.map(p => [p.qty, p.unit, p.name].filter(Boolean).join(" "))
              : ["200g chicken breast", "2 bell peppers", "1 cup rice", "3 tbsp soy sauce", "2 cloves garlic"],
            steps: [
              "Cook rice according to package instructions",
              "Cut chicken and peppers into bite-sized pieces",
              "Heat oil in a large pan over high heat",
              "Stir-fry chicken until golden (5-7 minutes)",
              "Add peppers and garlic, cook 3 minutes",
              "Add soy sauce and toss everything together",
              "Serve over rice and enjoy!",
            ],
            macros: {
              calories: constraints.calories.value + Math.floor(Math.random() * 50 - 25),
              protein: constraints.protein.value + Math.floor(Math.random() * 10 - 5),
              carbs: constraints.carbs.value + Math.floor(Math.random() * 15 - 7),
              fats: constraints.fats.value + Math.floor(Math.random() * 8 - 4),
            },
            time: 25,
            difficulty: "easy",
            servings: 2,
            explanation: `Hits your ${constraints.calories.value} kcal target, ${constraints.protein.value}g protein goal, under ${constraints.time.value} minutes${selectedChips.includes('vegan') ? ', completely plant-based' : ''}`,
            sources: [
              { name: "Asian Cooking Basics", confidence: 0.92 },
              { name: "Quick Weeknight Meals", confidence: 0.87 },
            ],
            pantryMatches: pantry.slice(0, 3).map(p => p.name),
          },
        };
        setMessages(prev => [...prev, botMessage]);
        setIsTyping(false);
      }, 2000);
    }
  };

  const handleReset = () => {
    if (!previewMode) {
      setMessages([]);
      setInput("");
      setSelectedChips([]);
      setPantry([]);
      setIngName("");
      setIngQty("");
      setIngUnit("none");
    }
  };
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = 0;
    }
  }, []);
  
  // Scroll to bottom ONLY when a bot message arrives
  useEffect(() => {
    if (messages.length === 0) return;
  
    const last = messages[messages.length - 1];
    if (last.role === "bot") {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);
  const handleTemplateSelect = (prompt: string) => {
    setInput(prompt);
  };

  return (
    <motion.div
      ref={containerRef}
      className="flex flex-col h-full bg-white/80 backdrop-blur-xl rounded-3xl border border-white/40 shadow-glow scrollable-container"
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div>
          <h3 className="font-semibold text-lg">Your AI Sous-Chef</h3>
          <p className="text-xs text-muted-foreground">Ready to create something delicious</p>
        </div>
        {!previewMode && (
          <Button variant="ghost" size="sm" onClick={handleReset}>
            <RotateCcw className="h-4 w-4 mr-1" />
            Reset
          </Button>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-[400px]">
        {messages.length === 0 && !isTyping && (
          <TemplatePrompts onSelect={handleTemplateSelect} />
        )}

        <AnimatePresence>
          {messages.map((message, index) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
            >
              {message.isError ? (
                <Alert variant="destructive" className="max-w-[80%]">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{message.content}</AlertDescription>
                </Alert>
              ) : message.recipe ? (
                <div className="w-full">
                  <RecipeCard
                    recipe={message.recipe}
                    onCookMode={() => console.log("Cook mode")}
                    onSwapIngredient={(ing) => setInput(`Swap ${ing} for something else`)}
                    onRegenerate={handleSend}
                    onSave={() => console.log("Save")}
                    onShare={() => console.log("Share")}
                  />
                </div>
              ) : (
                <div
                  className={`max-w-[80%] rounded-lg p-3 ${
                    message.role === "user" 
                      ? "bg-chat-user-bg text-chat-user-fg" 
                      : "bg-chat-bot-bg text-chat-bot-fg"
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>

        {isTyping && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
            <div className="flex justify-start">
              <div className="bg-chat-bot-bg text-chat-bot-fg rounded-lg p-3">
                <div className="flex space-x-1">
                  <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0 }} className="w-2 h-2 bg-current rounded-full opacity-60" />
                  <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.2 }} className="w-2 h-2 bg-current rounded-full opacity-60" />
                  <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.4 }} className="w-2 h-2 bg-current rounded-full opacity-60" />
                </div>
              </div>
            </div>
            {/* Skeleton for recipe card */}
            <div className="space-y-3">
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
              <div className="flex gap-2">
                <Skeleton className="h-6 w-20" />
                <Skeleton className="h-6 w-20" />
                <Skeleton className="h-6 w-20" />
              </div>
            </div>
          </motion.div>
        )}

        {!previewMode && messages.length > 0 && messages[messages.length - 1]?.role === "bot" && !isTyping && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-wrap gap-2">
            {quickReplies.map((reply) => (
              <Badge 
                key={reply} 
                variant="outline" 
                className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors" 
                onClick={() => setInput(reply)}
              >
                {reply}
              </Badge>
            ))}
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="border-t border-border p-4 space-y-3">
        {/* Dietary Pills */}
        <div className="flex flex-wrap gap-2">
          {quickChips.map((chip) => (
            <Badge
              key={chip.value}
              variant={selectedChips.includes(chip.value) ? "default" : "outline"}
              className="cursor-pointer transition-colors"
              onClick={() => toggleChip(chip.value)}
            >
              {chip.label}
            </Badge>
          ))}
        </div>

        {/* Constraints Toggle */}
        {showConstraints && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setConstraintsVisible(!constraintsVisible)}
            className="w-full justify-between"
          >
            <span className="text-xs">Nutritional Constraints</span>
            {constraintsVisible ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </Button>
        )}

        {/* Constraints Panel */}
        <AnimatePresence>
          {constraintsVisible && (
            <MacroConstraintsPanel
              constraints={constraints}
              onChange={setConstraints}
              disabled={previewMode}
            />
          )}
        </AnimatePresence>

        {/* Ingredient Input */}
        <div className="rounded-xl border bg-white p-3 shadow-sm">
          {pantry.length > 0 && (
            <div className="mb-2 flex flex-wrap gap-2">
              {pantry.map(p => (
                <span key={p.id} className="inline-flex items-center gap-1 rounded-full border px-2 py-1 text-xs bg-muted">
                  {[p.qty, p.unit, p.name].filter(Boolean).join(" ")}
                  {!previewMode && (
                    <button aria-label="Remove" onClick={() => removePantryItem(p.id)} className="hover:text-destructive">
                      <X className="h-3 w-3" />
                    </button>
                  )}
                </span>
              ))}
            </div>
          )}

          <div className="grid grid-cols-12 gap-2">
            <div className="col-span-3">
              <Input
                value={ingQty}
                onChange={e => !previewMode && setIngQty(e.target.value)}
                placeholder="Qty"
                inputMode="decimal"
                disabled={previewMode}
              />
            </div>

            <div className="col-span-3">
              <Select value={ingUnit} onValueChange={setIngUnit} disabled={previewMode}>
                <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {UNITS.map(u => (
                    <SelectItem key={u} value={u}>{u === "none" ? "—" : u}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="col-span-5">
  <Input
    ref={nameInputRef}
    value={ingName}
    onChange={(e) => {
      if (!previewMode) setIngName(e.target.value);
    }}
    onKeyDown={(e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        if (ingName.trim()) addPantryItem(ingName, ingQty, ingUnit);
      } else if (e.key === ",") {
        e.preventDefault();
        if (ingName.trim()) maybeTokenize(ingName);
      }
    }}
    placeholder="Ingredient name"
    disabled={previewMode}
  />
</div>


            <div className="col-span-1 flex items-center justify-end">
              <Button
                type="button"
                variant="secondary"
                className="h-9 w-9 p-0"
                onClick={() => addPantryItem(ingName, ingQty, ingUnit)}
                disabled={previewMode || !ingName.trim()}
                title="Add ingredient"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Message Input */}
        <div className="flex gap-2">
          <Textarea
            value={input}
            onChange={(e) => !previewMode && setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder={previewMode ? "This is a preview..." : "Describe your goals, cuisine preferences, or any special requests..."}
            className="min-h-[60px] resize-none"
            disabled={previewMode}
          />
          <Button
            onClick={handleSend}
            disabled={(isTyping || previewMode) || (!input.trim() && pantry.length === 0)}
            size="icon"
            className="h-[60px] w-[60px]"
          >
            {isTyping ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
          </Button>
        </div>
        <p className="text-[11px] text-muted-foreground">
          <strong>Tip:</strong> Paste ingredients like "2 cup rice, tomatoes" or use structured inputs above
        </p>
      </div>
    </motion.div>
  );
};
