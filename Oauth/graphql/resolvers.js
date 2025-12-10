const bcrypt = require("bcrypt");
const User = require("../models/User");
const Recipe = require("../models/Recipe");
const { createToken } = require("../utils/auth");

// Helper function to create slug from title
function createSlug(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

// Helper function to parse ingredients from string array
function parseIngredients(ingredientStrings) {
  return ingredientStrings.map((ing, index) => {
    // Try to parse quantity and unit from string like "300g Chicken breast"
    const match = ing.match(/^([\d./\s]+)?\s*([a-z]+)?\s*(.+)$/i);
    if (match) {
      const [, qtyStr, unit, name] = match;
      let quantity = null;
      if (qtyStr) {
        const cleaned = qtyStr.trim();
        if (cleaned.includes('/')) {
          // Handle fractions like "1/2"
          const [num, den] = cleaned.split('/').map(Number);
          quantity = num / den;
        } else {
          quantity = parseFloat(cleaned) || null;
        }
      }
      return {
        name: name.trim(),
        quantity: quantity,
        unit: unit ? unit.trim() : null,
        notes: ""
      };
    }
    return {
      name: ing.trim(),
      quantity: null,
      unit: null,
      notes: ""
    };
  });
}

const resolvers = {
  Query: {
    me: async (_, __, { user }) => user,
    myRecipes: async (_, __, { user }) => {
      if (!user) throw new Error("Authentication required");
      return Recipe.find({ userId: user._id }).sort({ createdAt: -1 });
    }
  },

  Mutation: {
    signup: async (_, { email, password, name, role }) => {
      try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
          // Check if user signed up with Google
          if (existingUser.signupMethod === "google") {
            throw new Error("This email is already registered with Google. Please sign in with Google or use a different email.");
          }
          throw new Error("Email already exists. Please sign in instead.");
        }

        const hashed = await bcrypt.hash(password, 10);
        const user = await User.create({
          email,
          password: hashed,
          name: name || "",
          role: role || "candidate",
          signupMethod: "local"
        });

        const token = createToken(user);
        return { token, user };
      } catch (error) {
        // Handle MongoDB duplicate key error
        if (error.code === 11000 || error.message.includes("duplicate key")) {
          throw new Error("Email already exists. Please sign in instead.");
        }
        // Re-throw other errors (like the custom messages above)
        throw error;
      }
    },

    login: async (_, { email, password }) => {
      const user = await User.findOne({ email });
      if (!user) throw new Error("User not found");

      const valid = await bcrypt.compare(password, user.password);
      if (!valid) throw new Error("Invalid credentials");

      const token = createToken(user);
      return { token, user };
    },

    saveRecipe: async (_, { recipe }, { user }) => {
      if (!user) throw new Error("Authentication required");

      const slug = createSlug(recipe.title);
      const parsedIngredients = parseIngredients(recipe.ingredients);
      const steps = recipe.steps.map((instruction, index) => ({
        stepNumber: index + 1,
        instruction: instruction.trim()
      }));

      // Calculate prep and cook time from total time (rough estimate)
      const totalTime = recipe.time || 30;
      const prepTime = Math.floor(totalTime * 0.3);
      const cookTime = totalTime - prepTime;

      const savedRecipe = await Recipe.create({
        userId: user._id,
        slug: `${slug}-${Date.now()}`, // Add timestamp to ensure uniqueness
        name: recipe.title,
        description: recipe.summary || "",
        servings: recipe.servings || 2,
        prepTimeMinutes: prepTime,
        cookTimeMinutes: cookTime,
        totalTimeMinutes: totalTime,
        difficulty: recipe.difficulty || "easy",
        cuisine: "fusion",
        mealType: "dinner",
        tags: [],
        ingredients: parsedIngredients,
        steps: steps,
        imageUrl: "",
        author: {
          name: "Mix&Match AI",
          isAI: true
        },
        rating: 0,
        ratingCount: 0,
        macros: recipe.macros || null,
        createdAt: new Date(),
        sourceUrl: ""
      });

      return savedRecipe;
    }
  }
};

module.exports = resolvers;
