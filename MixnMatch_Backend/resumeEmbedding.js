import "dotenv/config";
import { createClient } from "@supabase/supabase-js";
import { CohereEmbeddings } from "@langchain/cohere";
import { SupabaseVectorStore } from "@langchain/community/vectorstores/supabase";
import { CSVLoader } from "@langchain/community/document_loaders/fs/csv";
import { Document } from "@langchain/core/documents";

const CSV_FILE_PATH = "selected_20k_recipes.csv";
const DATASET_TAG = "recipes-v1";
const BATCH_SIZE = 90;

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const googleApiKey = process.env.GOOGLE_API_KEY;
const cohereApiKey = process.env.COHERE_API_KEY;
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

if (!googleApiKey || !cohereApiKey || !supabaseUrl || !supabaseServiceKey) {
  throw new Error("Missing API keys in .env file");
}

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

async function resumeEmbedding() {
  try {
    console.log("Resuming embedding for remaining recipes...\n");

    // Get count of already embedded documents
    const { count: embeddedCount } = await supabaseClient
      .from("documents")
      .select("*", { count: "exact", head: true })
      .filter("metadata->>dataset_tag", "eq", DATASET_TAG);

    console.log(`Already embedded: ${embeddedCount} documents`);

    // Load all documents from CSV
    console.log(`Loading CSV from '${CSV_FILE_PATH}'...`);
    const loader = new CSVLoader(CSV_FILE_PATH);
    const docs = await loader.load();
    console.log(`Loaded ${docs.length} total rows from CSV\n`);

    // Create tagged docs
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

    // Calculate starting point
    const startIndex = embeddedCount || 0;
    const remainingDocs = taggedDocs.slice(startIndex);

    if (remainingDocs.length === 0) {
      console.log("All documents are already embedded!");
      return;
    }

    console.log(
      `Resuming from document ${startIndex + 1}. Embedding ${remainingDocs.length} remaining documents...\n`
    );

    // Process remaining batches with 3-second delay (increased from 1s to avoid rate limits)
    for (let i = 0; i < remainingDocs.length; i += BATCH_SIZE) {
      const batch = remainingDocs.slice(i, i + BATCH_SIZE);
      const globalIndex = startIndex + i;
      console.log(
        `...Processing batch ${Math.floor(i / BATCH_SIZE) + 1} / ${Math.ceil(
          remainingDocs.length / BATCH_SIZE
        )} (docs ${globalIndex + 1}-${Math.min(
          globalIndex + BATCH_SIZE,
          docs.length
        )})`
      );

      await vectorStore.addDocuments(batch);

      // Wait 3 seconds between batches to respect Cohere rate limits
      if (i + BATCH_SIZE < remainingDocs.length) {
        await sleep(3000);
      }
    }

    console.log("\n✓ Successfully embedded all remaining documents!");

    // Verify final count
    const { count: finalCount } = await supabaseClient
      .from("documents")
      .select("*", { count: "exact", head: true })
      .filter("metadata->>dataset_tag", "eq", DATASET_TAG);

    console.log(`\nFinal count in database: ${finalCount} documents`);
  } catch (error) {
    console.error("Error during resume:", error.message);
    process.exit(1);
  }
}

resumeEmbedding();
