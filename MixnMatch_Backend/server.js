import express from "express";
import cors from "cors";
import { initializeData, queryRecipes, generateMealPlan } from "./ragService.js";

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({ status: "ok", message: "RAG API server is running" });
});

// Initialize data on startup
let isInitialized = false;

async function startup() {
  try {
    console.log("Starting RAG API server...");
    await initializeData();
    isInitialized = true;
    console.log("RAG data initialized successfully");
  } catch (error) {
    console.error("Failed to initialize RAG data:", error);
    process.exit(1);
  }
}

// Query endpoint
app.post("/api/query", async (req, res) => {
  try {
    if (!isInitialized) {
      return res.status(503).json({
        success: false,
        error: "RAG service is initializing, please try again in a moment",
      });
    }

    const { question, chatHistory = [], constraints = {} } = req.body;

    if (!question) {
      return res.status(400).json({
        success: false,
        error: "Question is required",
      });
    }

    console.log("📥 Received query:", question);
    const result = await queryRecipes(question, chatHistory, constraints);
    console.log("📤 Sending response:", JSON.stringify(result, null, 2));

    if (result.success) {
      res.json(result);  // Send the entire result object including recipe
    } else {
      res.status(500).json({
        success: false,
        error: result.error || "Failed to generate recipe",
      });
    }
  } catch (error) {
    console.error("Error in /api/query:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Internal server error",
    });
  }
});

// Meal plan generation endpoint
app.post("/api/meal-plan", async (req, res) => {
  try {
    if (!isInitialized) {
      return res.status(503).json({
        success: false,
        error: "Service is initializing, please try again in a moment",
      });
    }

    const { ingredients } = req.body;

    if (!ingredients || !Array.isArray(ingredients) || ingredients.length === 0) {
      return res.status(400).json({
        success: false,
        error: "Ingredients array is required",
      });
    }

    console.log("📥 Received meal plan request for:", ingredients);
    const result = await generateMealPlan(ingredients);
    console.log("📤 Sending meal plan response");

    if (result.success) {
      res.json(result);
    } else {
      res.status(500).json({
        success: false,
        error: result.error || "Failed to generate meal plan",
      });
    }
  } catch (error) {
    console.error("Error in /api/meal-plan:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Internal server error",
    });
  }
});

// Start server
app.listen(PORT, async () => {
  console.log(`Server running on http://localhost:${PORT}`);
  await startup();
});

export default app;
