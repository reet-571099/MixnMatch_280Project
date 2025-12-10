import "dotenv/config";
import { createClient } from "@supabase/supabase-js";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { CohereEmbeddings } from "@langchain/cohere";
import { SupabaseVectorStore } from "@langchain/community/vectorstores/supabase";
import { CSVLoader } from "@langchain/community/document_loaders/fs/csv";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import {
  RunnablePassthrough,
  RunnableSequence,
} from "@langchain/core/runnables";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { Document } from "@langchain/core/documents";

// Configuration
const CSV_FILE_PATH = "selected_20k_recipes.csv";
const DATASET_TAG = "recipes-v1";
const BATCH_SIZE = 90;

// Helper function
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Initialize API Clients
const googleApiKey = process.env.GOOGLE_API_KEY;
const cohereApiKey = process.env.COHERE_API_KEY;
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

if (
  !googleApiKey ||
  !cohereApiKey ||
  !supabaseUrl ||
  !supabaseServiceKey
) {
  throw new Error(
    "Missing one or more API keys in .env file. Please check GOOGLE_API_KEY, COHERE_API_KEY, SUPABASE_URL, and SUPABASE_SERVICE_KEY."
  );
}

const llm = new ChatGoogleGenerativeAI({
  apiKey: googleApiKey,
  model: "gemini-2.5-flash-preview-09-2025",
  temperature: 0.3,
});

const embeddings = new CohereEmbeddings({
  apiKey: cohereApiKey,
  model: "embed-english-v3.0",
});

const supabaseClient = createClient(supabaseUrl, supabaseServiceKey);

const vectorStore = new SupabaseVectorStore(embeddings, {
  client: supabaseClient,
  tableName: "documents",
  queryName: "match_documents",
});

// Format chat history
const formatChatHistory = (history) => {
  if (!history || history.length === 0) return "";
  return history
    .slice(-6)
    .map((msg) => `${msg.role}: ${msg.content}`)
    .join("\n");
};

// Format documents
const formatDocuments = (docs) => {
  return docs
    .map((doc) => {
      return `--- Recipe ---\n${doc.pageContent}`;
    })
    .join("\n\n");
};

// Build constraints into the system prompt
const buildConstraintsPrompt = (constraints) => {
  let constraintText = "";

  if (constraints && Object.keys(constraints).length > 0) {
    constraintText = "\n\nIMPORTANT CONSTRAINTS FOR THIS RECIPE:\n";

    if (constraints.calories) {
      constraintText += `- Calories: ${constraints.calories.min}-${constraints.calories.max} kcal\n`;
    }
    if (constraints.protein) {
      constraintText += `- Protein: ${constraints.protein.min}-${constraints.protein.max}g\n`;
    }
    if (constraints.carbs) {
      constraintText += `- Carbs: ${constraints.carbs.min}-${constraints.carbs.max}g\n`;
    }
    if (constraints.fats) {
      constraintText += `- Fats: ${constraints.fats.min}-${constraints.fats.max}g\n`;
    }
    if (constraints.maxTime) {
      constraintText += `- Cooking Time: Max ${constraints.maxTime} minutes\n`;
    }
    if (constraints.dietary && constraints.dietary.length > 0) {
      constraintText += `- Dietary Preferences: ${constraints.dietary.join(", ")}\n`;
    }
    if (constraints.allergens && constraints.allergens.length > 0) {
      constraintText += `- Avoid These Allergens: ${constraints.allergens.join(", ")}\n`;
    }
    if (constraints.dislikes && constraints.dislikes.length > 0) {
      constraintText += `- Disliked Ingredients: ${constraints.dislikes.join(", ")}\n`;
    }
  }

  return constraintText;
};

// Initialize data (idempotent indexing)
export async function initializeData() {
  console.log(`Checking if dataset '${DATASET_TAG}' is already in Supabase...`);

  const { data: existingDocs } = await supabaseClient
    .from("documents")
    .select("id")
    .filter("metadata->>dataset_tag", "eq", DATASET_TAG)
    .limit(1);

  if (existingDocs && existingDocs.length > 0) {
    console.log(
      `Dataset '${DATASET_TAG}' found in Supabase. Skipping indexing.`
    );
    return true;
  }

  console.log(
    `CSV data not found in Supabase. Starting indexing process for '${DATASET_TAG}'...`
  );

  console.log(`Loading CSV from '${CSV_FILE_PATH}'...`);
  const loader = new CSVLoader(CSV_FILE_PATH);
  const docs = await loader.load();
  console.log(`Loaded ${docs.length} rows from CSV.`);

  const taggedDocs = docs.map(
    (doc) =>
      new Document({
        pageContent: doc.pageContent,
        metadata: {
          ...doc.metadata,
          dataset_tag: DATASET_TAG,
        },
      })
  );

  console.log(
    `Adding ${taggedDocs.length} documents to Supabase in batches of ${BATCH_SIZE}...`
  );

  for (let i = 0; i < taggedDocs.length; i += BATCH_SIZE) {
    const batch = taggedDocs.slice(i, i + BATCH_SIZE);
    console.log(
      `...Processing batch ${Math.floor(i / BATCH_SIZE) + 1} / ${Math.ceil(
        taggedDocs.length / BATCH_SIZE
      )} (docs ${i + 1}-${Math.min(i + BATCH_SIZE, taggedDocs.length)})`
    );

    await vectorStore.addDocuments(batch);
    await sleep(3000);
  }

  console.log("Successfully indexed all documents in Supabase.");
  return true;
}

// Query function - the main RAG interface
export async function queryRecipes(question, chatHistory = [], constraints = {}) {
  try {
    // Build the answer prompt with constraints
    const constraintsText = buildConstraintsPrompt(constraints);

    const answerPrompt = ChatPromptTemplate.fromMessages([
      [
        "system",
        "You are a helpful recipe and cooking assistant. Your job is to answer the user's question about recipes.\n\n" +
        "CONTEXT from our recipe database is provided below. If the CONTEXT contains relevant recipes, use them as inspiration. " +
        "If the CONTEXT is NOT relevant or doesn't contain good matches, use your own knowledge to create a recipe that fits the user's request.\n\n" +
        "CRITICAL: You MUST respond with ONLY a valid JSON object in this exact format:\n" +
        "{{\n" +
        '  "title": "Recipe Name",\n' +
        '  "summary": "Brief description of the recipe",\n' +
        '  "ingredients": ["200g chicken breast", "1 cup rice", "2 tbsp soy sauce"],\n' +
        '  "steps": ["Step 1 description", "Step 2 description", "Step 3 description"],\n' +
        '  "macros": {{"calories": 450, "protein": 35, "carbs": 50, "fats": 10}},\n' +
        '  "time": 25,\n' +
        '  "difficulty": "easy",\n' +
        '  "servings": 2,\n' +
        '  "explanation": "Why this recipe fits your requirements and preferences"\n' +
        "}}\n\n" +
        "IMPORTANT INSTRUCTIONS FOR STEPS:\n" +
        "- Keep each step concise but clear (1-2 sentences max)\n" +
        "- Include key cooking times and temperatures when relevant\n" +
        "- Add brief visual cues for doneness (e.g., 'until golden', 'fragrant')\n\n" +
        "IMPORTANT: Always respect the user's dietary constraints and nutritional requirements provided below.\n" +
        "Do NOT include any text before or after the JSON. Only output valid JSON.\n" +
        "The difficulty must be one of: easy, medium, or hard." +
        constraintsText +
        "\n\nChat History:\n{chat_history}\n\nCONTEXT:\n{context}",
      ],
      ["human", "QUESTION:\n{question}"],
    ]);

    // Condense question chain
    const condenseQuestionPrompt = ChatPromptTemplate.fromMessages([
      [
        "system",
        "Given the following chat history and a follow up question, rephrase the follow up question to be a standalone question.\n\nChat History:\n{chat_history}",
      ],
      ["human", "Follow Up Input: {question}\nStandalone question:"],
    ]);

    const condenseQuestionChain = RunnableSequence.from([
      condenseQuestionPrompt,
      llm,
      new StringOutputParser(),
    ]);

    // Retriever chain
    const retrieverChain = RunnableSequence.from([
      (input) => input.standalone_question,
      vectorStore.asRetriever({
        k: 3,  // Reduced from 5 to 3 for faster responses
        filter: {
          dataset_tag: DATASET_TAG,
        },
      }),
      formatDocuments,
    ]);

    // Full conversation chain
    const conversationalRetrievalChain = RunnableSequence.from([
      {
        standalone_question: condenseQuestionChain,
        original_input: new RunnablePassthrough(),
      },
      {
        context: retrieverChain,
        question: (input) => input.original_input.question,
        chat_history: (input) => input.original_input.chat_history,
      },
      answerPrompt,
      llm,
      new StringOutputParser(),
    ]);

    // Invoke the chain
    const answer = await conversationalRetrievalChain.invoke({
      question: question,
      chat_history: formatChatHistory(chatHistory),
    });

    // Parse JSON from LLM response
    try {
      // Extract JSON object from response (in case LLM adds extra text)
      const jsonMatch = answer.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error("No JSON found in response");
      }
      const recipeData = JSON.parse(jsonMatch[0]);

      return {
        success: true,
        recipe: recipeData,
      };
    } catch (parseError) {
      console.error("Error parsing JSON:", parseError);
      console.error("Raw LLM response:", answer);
      return {
        success: false,
        error: "Failed to parse recipe data from LLM response",
      };
    }
  } catch (error) {
    console.error("Error in queryRecipes:", error);
    return {
      success: false,
      error: error.message,
    };
  }
}

// Generate a 7-day meal plan based on ingredients
async function generateMealPlan(ingredients) {
  try {
    const prompt = ChatPromptTemplate.fromMessages([
      [
        "system",
        `Create a 7-day meal plan. Return ONLY valid JSON:
{{"title":"7-Day Meal Plan","description":"Weekly meals","days":[{{"day":1,"meals":[{{"title":"Meal Name","description":"Brief desc","type":"breakfast","ingredients":["item1","item2"],"steps":["Step 1","Step 2"],"time":15}},{{"title":"...","type":"lunch",...}},{{"title":"...","type":"dinner",...}}]}},{{"day":2,"meals":[...]}},...]}}

Rules:
- Use ONLY the given ingredients
- 7 days, each with breakfast/lunch/dinner
- Each meal: title, description (10 words max), type, ingredients array, steps array (3-4 simple steps), time (minutes)
- Keep steps simple and brief
- Output JSON only`,
      ],
      ["human", "Ingredients: {ingredients}"],
    ]);

    const chain = prompt.pipe(llm).pipe(new StringOutputParser());

    console.log("🍽️ Generating meal plan for ingredients:", ingredients);
    const answer = await chain.invoke({ ingredients: ingredients.join(", ") });

    // Parse JSON from LLM response
    const jsonMatch = answer.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("No JSON found in response");
    }
    const mealPlanData = JSON.parse(jsonMatch[0]);

    return {
      success: true,
      mealPlan: mealPlanData,
    };
  } catch (error) {
    console.error("Error in generateMealPlan:", error);
    return {
      success: false,
      error: error.message,
    };
  }
}

export { generateMealPlan };
