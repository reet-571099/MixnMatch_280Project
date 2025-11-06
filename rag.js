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
import readline from "readline";

/*
 * This script demonstrates a full RAG (Retrieval-Augmented Generation) pipeline
 * using a CSV file as the data source and Supabase (with pgvector) as the
 * persistent vector store.
 *
 * It uses:
 * - Supabase: For storing and querying vectors.
 * - Cohere: For generating the embeddings (vectors) from the text.
 * - Google Gemini: For the chat model (LLM) to generate the final answer.
 *
 * The script is idempotent: it checks if the data is already indexed
 * in Supabase before attempting to load and embed it, saving time and API calls.
 *
 * It also includes batching and a delay to respect API rate limits.
 *
 * This version runs an interactive chat loop in the terminal
 * and includes conversational memory.
 */

// --- 1. Configuration ---

// File path for your CSV.
const CSV_FILE_PATH = "recipes_3000_sample.csv";

// A unique identifier for this dataset. This is used to "namespace"
// the data in the Supabase table, allowing you to store multiple
// datasets in the same table without them mixing up.
const DATASET_TAG = "recipes-v1";

// --- 2. Initialize API Clients and Models ---

// Load environment variables.
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

// Initialize the LLM (Gemini)
const llm = new ChatGoogleGenerativeAI({
  apiKey: googleApiKey,
  model: "gemini-2.5-flash-preview-09-2025",
  temperature: 0.3,
});

// Initialize the Embeddings model (Cohere)
const embeddings = new CohereEmbeddings({
  apiKey: cohereApiKey,
  model: "embed-english-v3.0", // 1024 dimensions
});

// Initialize the Supabase client
const supabaseClient = createClient(supabaseUrl, supabaseServiceKey);

// Initialize the SupabaseVectorStore
// This object is our main interface to the database.
const vectorStore = new SupabaseVectorStore(embeddings, {
  client: supabaseClient,
  tableName: "documents",
  queryName: "match_documents",
});

// Helper function to pause execution
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Helper function to format chat history for the prompt
// Keeps the last 6 messages (3 turns)
const formatChatHistory = (history) => {
  return history
    .slice(-6)
    .map((msg) => `${msg.role}: ${msg.content}`)
    .join("\n");
};

// This function formats the retrieved documents (CSV rows) into a readable string.
const formatDocuments = (docs) => {
  return docs
    .map((doc) => {
      // Each doc.pageContent is a string like:
      // "name: Crab Filled Crescent Snacks\nid: 94947\nminutes: 70..."
      return `--- Recipe Row ---\n${doc.pageContent}`;
    })
    .join("\n\n");
};

// --- 3. Define the Conversational RAG Chain ---

// --- 3a. The "Memory" Chain (Condenses the question) ---
// This prompt is used to "condense" the chat history and the new question
// into a single, standalone question for the vector search.
const condenseQuestionPrompt = ChatPromptTemplate.fromMessages([
  ["system", "Given the following chat history and a follow up question, rephrase the follow up question to be a standalone question.\n\nChat History:\n{chat_history}"],
  ["human", "Follow Up Input: {question}\nStandalone question:"]
]);

// This chain takes "chat_history" and "question", and passes them to the
// prompt, then to the LLM, and parses the result as a string.
const condenseQuestionChain = RunnableSequence.from([
  condenseQuestionPrompt,
  llm,
  new StringOutputParser(),
]);


// --- 3b. The "Answering" Chain (Main RAG logic) ---

// This prompt now takes chat_history, context, and a question.
// It also contains the new rule to ONLY answer cooking-related questions.
const answerPrompt = ChatPromptTemplate.fromMessages([
  [
    "system",
    "You are a helpful recipe and cooking assistant. Your job is to answer the user's question about recipes or cooking techniques.\n\nUse the following " +
    "retrieved CONTEXT to answer. If the context is relevant, use it as your primary source of information.\n\nIf the question is about cooking but the " +
    "CONTEXT doesn't have the answer (like 'what does sauté mean?'), you can use your general knowledge to answer.\n\nIf the question is NOT about cooking " +
    "or recipes (like 'who is barak obama?'), politely state that you can only help with cooking-related topics.\n\nChat History:\n{chat_history}\n\nCONTEXT:\n{context}",
  ],
  ["human", "QUESTION:\n{question}"],
]);

// This chain will retrieve docs based on the condensed standalone question
const retrieverChain = RunnableSequence.from([
  (input) => input.standalone_question, // Get the condensed question
  vectorStore.asRetriever({
    k: 5, // Ask for the top 5 most similar rows
    filter: {
      dataset_tag: DATASET_TAG,
    },
  }),
  formatDocuments, // Format the docs into a string
]);

// This is the new main chain that ties everything together.
const conversationalRetrievalChain = RunnableSequence.from([
  {
    // First, get the standalone_question using our "memory" chain
    standalone_question: condenseQuestionChain,
    // Pass through the original inputs
    original_input: new RunnablePassthrough(),
  },
  {
    // Now, use the standalone_question to get the context
    context: retrieverChain,
    // Pass through the original question and history again
    question: (input) => input.original_input.question,
    chat_history: (input) => input.original_input.chat_history,
  },
  answerPrompt, // Pass all 3 (context, question, chat_history) to the final prompt
  llm,
  new StringOutputParser(),
]);


// --- 4. Define the Interactive Chat Loop ---

async function startChatLoop() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  // Keep track of the conversation
  let chatHistory = [];

  console.log("\n----------------------------------------");
  console.log("Chat with your Recipe CSV!");
  console.log("Type 'exit' to quit.");
  console.log("----------------------------------------");

  // Create a recursive function to ask questions
  const ask = () => {
    rl.question("You: ", async (question) => {
      if (question.toLowerCase() === "exit") {
        rl.close();
        return;
      }

      try {
        console.log("...Bot is thinking...");
        const startTime = Date.now();
        
        // Run the new conversational chain
        const answer = await conversationalRetrievalChain.invoke({
          question: question,
          chat_history: formatChatHistory(chatHistory),
        });
        const endTime = Date.now();

        // Add to history
        chatHistory.push({ role: "human", content: question });
        chatHistory.push({ role: "ai", content: answer });

        console.log(`\nBot: ${answer}`);
        console.log(
          `\n(Query took ${((endTime - startTime) / 1000).toFixed(2)}s)`
        );
      } catch (err) {
        console.error("\n--- AN ERROR OCCURRED DURING QUERY ---");
        console.error(err.message);
        console.log("Please try another question.");
      }

      // Ask the next question
      ask();
    });
  };

  // Start the loop
  ask();
}

// --- 5. Main Application Function ---

async function main() {
  try {
    console.log("Starting RAG application...");
    console.log(`Checking if dataset '${DATASET_TAG}' is already in Supabase...`);

    // --- 5a. Check if data is already indexed ---
    // This is the idempotent check. We look for just one document
    // with our tag to see if indexing has already been completed.
    const { data: existingDocs } = await supabaseClient
      .from("documents")
      .select("id")
      .filter("metadata->>dataset_tag", "eq", DATASET_TAG)
      .limit(1);

    if (existingDocs && existingDocs.length > 0) {
      // Data is already here! Skip indexing.
      console.log(
        `Dataset '${DATASET_TAG}' found in Supabase. Skipping indexing.`
      );
    } else {
      // Data is NOT here. Run the one-time indexing process.
      console.log(
        `CSV data not found in Supabase. Starting indexing process for '${DATASET_TAG}'...`
      );

      // Load the CSV file. Each row becomes a "Document".
      console.log(`Loading CSV from '${CSV_FILE_PATH}'...`);
      const loader = new CSVLoader(CSV_FILE_PATH);
      const docs = await loader.load();
      console.log(`Loaded ${docs.length} rows from CSV.`);

      // --- 5b. Add metadata to each document ---
      const taggedDocs = docs.map(
        (doc) =>
          new Document({
            pageContent: doc.pageContent,
            metadata: {
              ...doc.metadata, // Keep original metadata (like row number)
              dataset_tag: DATASET_TAG, // Add our unique tag
            },
          })
      );

      // --- 5c. Add documents to Supabase in batches ---
      const BATCH_SIZE = 90; // Stay under Cohere's 96 req/batch limit
      console.log(
        `Adding ${taggedDocs.length} documents to Supabase in batches of ${BATCH_SIZE}...`
      );

      for (let i = 0; i < taggedDocs.length; i += BATCH_SIZE) {
        const batch = taggedDocs.slice(i, i + BATCH_SIZE);
        console.log(
          `...Processing batch ${Math.floor(i / BATCH_SIZE) + 1} / ${Math.ceil(
            taggedDocs.length / BATCH_SIZE
          )} (docs ${i + 1}-${Math.min(
            i + BATCH_SIZE,
            taggedDocs.length
          )})`
        );

        await vectorStore.addDocuments(batch);

        // Wait for 1 second between batches to respect rate limits
        await sleep(1000);
      }
      
      console.log("Successfully indexed all documents in Supabase.");
    }

    // --- 5d. Start the interactive chat ---
    // Now that we know the data is ready, start the chat loop.
    startChatLoop();

  } catch (err) {
    console.error("\n--- A FATAL ERROR OCCURRED ON STARTUP ---");
    if (err.message?.includes("fetch failed")) {
      console.error(
        "Fetch Failed: This often means an API key is invalid, your network is down, or a service (Google/Cohere/Supabase) is unavailable."
      );
    } else if (err.message?.includes("401")) {
      console.error(
        "Authentication Error (401): Check your API keys in the .env file. One of them is likely incorrect or has expired."
      );
    } else if (err.message?.includes("429")) {
      console.error(
        "Rate Limit Error (429): You are sending too many requests to an API too quickly. Please wait and try again."
      );
    } else if (err.message?.includes("500")) {
      console.error(
        "Server Error (500): The API provider (Google, Cohere, or Supabase) is having issues on their end. Please try again later."
      );
    } else {
      console.error(err);
    }
  }
}

// Run the main function
main();

