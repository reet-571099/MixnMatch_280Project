const mongoose = require("mongoose");

const ingredientSchema = new mongoose.Schema({
  name: { type: String, required: true },
  quantity: { type: Number },
  unit: { type: String },
  notes: { type: String }
});

const stepSchema = new mongoose.Schema({
  stepNumber: { type: Number, required: true },
  instruction: { type: String, required: true }
});

const recipeSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User", 
    required: true,
    index: true 
  },
  slug: { type: String, required: true },
  name: { type: String, required: true },
  description: { type: String },
  servings: { type: Number, default: 2 },
  prepTimeMinutes: { type: Number, default: 0 },
  cookTimeMinutes: { type: Number, default: 0 },
  totalTimeMinutes: { type: Number, required: true },
  difficulty: { 
    type: String, 
    enum: ["easy", "medium", "hard"], 
    default: "easy" 
  },
  cuisine: { type: String, default: "fusion" },
  mealType: { type: String, default: "dinner" },
  tags: [{ type: String }],
  ingredients: [ingredientSchema],
  steps: [stepSchema],
  imageUrl: { type: String, default: "" },
  author: {
    name: { type: String, default: "Mix&Match AI" },
    isAI: { type: Boolean, default: true }
  },
  rating: { type: Number, default: 0 },
  ratingCount: { type: Number, default: 0 },
  macros: {
    calories: { type: Number },
    protein: { type: Number },
    carbs: { type: Number },
    fats: { type: Number }
  },
  createdAt: { type: Date, default: Date.now },
  sourceUrl: { type: String, default: "" }
});

// Create compound index for user recipes
recipeSchema.index({ userId: 1, createdAt: -1 });

module.exports = mongoose.model("Recipe", recipeSchema);

