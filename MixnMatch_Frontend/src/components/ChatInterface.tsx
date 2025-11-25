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
  showConstraints = true 
}: ChatInterfaceProps) => {
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

    // Simulate streaming with skeleton
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
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const handleTemplateSelect = (prompt: string) => {
    setInput(prompt);
  };

  return (
    <motion.div
      className="flex flex-col h-full bg-white/80 backdrop-blur-xl rounded-3xl border border-white/40 shadow-glow"
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

            <div className="col-span-5 relative">
            <div className="col-span-5 relative">
  <Popover
    open={openAuto && !previewMode}
    onOpenChange={setOpenAuto}
    modal={false} // ✅ prevent focus trapping
  >
    <PopoverTrigger asChild>
      <Input
        ref={nameInputRef}
        value={ingName}
        onChange={(e) => {
          if (previewMode) return;
          setIngName(e.target.value);
          setOpenAuto(true);
        }}
        onFocus={() => setOpenAuto(true)}
        onBlur={() => {
          // small delay so click registers before closing
          setTimeout(() => setOpenAuto(false), 120);
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            if (ingName.trim()) addPantryItem(ingName, ingQty, ingUnit);
          } else if (e.key === ",") {
            e.preventDefault();
            if (ingName.trim()) maybeTokenize(ingName);
          } else if (e.key === "Escape") {
            setOpenAuto(false);
          }
        }}
        placeholder="Ingredient"
        disabled={previewMode}
      />
    </PopoverTrigger>

    <PopoverContent
      className="p-0 w-[var(--radix-popover-trigger-width)]"
      // ✅ prevent Radix from refocusing (causes flicker)
      onOpenAutoFocus={(e) => e.preventDefault()}
      onCloseAutoFocus={(e) => e.preventDefault()}
    >
      <div className="max-h-56 overflow-auto">
        {suggestions.map((s) => (
          <button
            key={s}
            className="w-full text-left px-3 py-2 hover:bg-accent text-sm"
            onMouseDown={(e) => {
              // ✅ use mousedown so blur doesn’t close before click
              e.preventDefault();
              addPantryItem(s, ingQty, ingUnit);
            }}
            >
              {s}
             </button>
             ))}
            </div>
            </PopoverContent>
            </Popover>
            </div>

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
