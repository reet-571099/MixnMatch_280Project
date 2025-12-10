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
import { queryRAG, generateMealPlan } from "@/lib/ragClient";
import { mapConstraintsToBackend } from "@/lib/constraintMapper";
import { convertMessagesToBackendHistory } from "@/lib/chatHistoryMapper";
import { useAuth } from "@/contexts/AuthContext";
import { saveRecipe } from "@/lib/authClient";
import { useToast } from "@/hooks/use-toast";

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
  const [chatStarted, setChatStarted] = useState(false); // Track if chat has started
  const [savedRecipeIds, setSavedRecipeIds] = useState<Set<string>>(new Set());
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();

  // Structured ingredient inputs
  const [ingName, setIngName] = useState("");
  const [ingQty, setIngQty] = useState("");
  const [ingUnit, setIngUnit] = useState<string>("");
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
    const cleanUnit = unit && unit !== "none" && unit !== "" ? unit : undefined;
    setPantry(prev => [...prev, { id: crypto.randomUUID(), name: clean, qty: qty?.trim() || undefined, unit: cleanUnit }]);
    setIngName("");
    setIngQty("");
    setIngUnit("");
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

    // Add user message to state first
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);
    setChatStarted(true); // Mark chat as started

    // Check if this is a meal plan request (when onMealPlanGenerated is provided - i.e., on Meal Planner page)
    if (onMealPlanGenerated) {
      // Call meal plan API - use pantry items if available, otherwise pass the user's text as ingredients
      try {
        let ingredientNames: string[];
        if (pantry.length > 0) {
          ingredientNames = pantry.map(p => p.name);
        } else {
          // Extract ingredients from user input text (split by commas, "and", etc.)
          ingredientNames = composed
            .replace(/i have|suggest|weekly|meal plan|indian|recipes|with|please|create|make/gi, '')
            .split(/[,\.\&]|\band\b/)
            .map(s => s.trim())
            .filter(s => s.length > 1);
        }

        const result = await generateMealPlan(ingredientNames);

        if (result.success && result.mealPlan) {
          const botMessage: Message = {
            id: (Date.now() + 1).toString(),
            role: "bot",
            content: "I've created a 7-day meal plan using your ingredients! Check it out on the right.",
          };
          setMessages(prev => [...prev, botMessage]);
          onMealPlanGenerated(result.mealPlan);
        } else {
          throw new Error(result.error || "Failed to generate meal plan");
        }
      } catch (error) {
        const errorMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: "bot",
          content: "Oops! Something went wrong generating your meal plan. Please try again.",
          isError: true,
        };
        setMessages(prev => [...prev, errorMessage]);
      } finally {
        setIsTyping(false);
      }
      return;
    }

    // Call RAG API for recipe - include ALL previous messages for context
    try {
      const result = await queryRAG({
        question: composed,
        chatHistory: convertMessagesToBackendHistory(messages), // Send all messages for full context
        constraints: mapConstraintsToBackend(constraints, selectedChips),
      });

      if (result.success && result.recipe) {
        const botMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: "bot",
          content: "I found a great recipe for you!",
          recipe: result.recipe,
        };
        setMessages(prev => [...prev, botMessage]);
      } else {
        throw new Error(result.error || "Failed to generate recipe");
      }
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "bot",
        content: "Oops! Something went wrong. Please try again.",
        isError: true,
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
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
      setIngUnit("");
      setChatStarted(false); // Reset chat started state
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

  const handleSaveRecipe = async (recipe: Recipe) => {
    if (!isAuthenticated || !user) {
      toast({
        title: "Please sign in",
        description: "You need to be signed in to save recipes.",
        variant: "destructive",
      });
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      toast({
        title: "Authentication error",
        description: "Please sign in again.",
        variant: "destructive",
      });
      return;
    }

    try {
      await saveRecipe(
        {
          title: recipe.title,
          summary: recipe.summary,
          ingredients: recipe.ingredients,
          steps: recipe.steps,
          macros: recipe.macros,
          time: recipe.time,
          difficulty: recipe.difficulty,
          servings: recipe.servings,
          explanation: recipe.explanation,
        },
        token
      );

      // Mark as saved
      setSavedRecipeIds(prev => new Set(prev).add(recipe.title));
      
      toast({
        title: "Recipe saved!",
        description: `${recipe.title} has been added to your favorites.`,
      });
    } catch (error) {
      console.error("Failed to save recipe:", error);
      toast({
        title: "Failed to save recipe",
        description: error instanceof Error ? error.message : "Something went wrong. Please try again.",
        variant: "destructive",
      });
    }
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
                    onSave={() => handleSaveRecipe(message.recipe)}
                    onShare={() => console.log("Share")}
                    isSaved={savedRecipeIds.has(message.recipe.title)}
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
        {/* Dietary Pills - Hide after chat starts */}
        {!chatStarted && (
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
        )}

        {/* Constraints Toggle - Hide after chat starts */}
        {!chatStarted && showConstraints && (
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

        {/* Constraints Panel - Hide after chat starts */}
        <AnimatePresence>
          {!chatStarted && constraintsVisible && (
            <MacroConstraintsPanel
              constraints={constraints}
              onChange={setConstraints}
              disabled={previewMode}
            />
          )}
        </AnimatePresence>

        {/* Ingredient Input - Hide after chat starts */}
        {!chatStarted && (
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
                  onChange={e => {
                    if (!previewMode) {
                      const value = e.target.value;
                      if (value === '' || /^[\d\s./]*$/.test(value)) {
                        setIngQty(value);
                      }
                    }
                  }}
                  placeholder="Qty"
                  inputMode="decimal"
                  disabled={previewMode}
                />
              </div>

              <div className="col-span-3">
                <Select value={ingUnit} onValueChange={setIngUnit} disabled={previewMode}>
                  <SelectTrigger className="w-full"><SelectValue placeholder="Unit" /></SelectTrigger>
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
        )}

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
