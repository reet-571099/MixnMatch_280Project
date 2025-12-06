import "dotenv/config";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

const supabaseClient = createClient(supabaseUrl, supabaseServiceKey);

async function cleanup() {
  try {
    console.log("Deleting old recipes-v1 dataset from Supabase...");

    const { count, error } = await supabaseClient
      .from("documents")
      .delete()
      .filter("metadata->>dataset_tag", "eq", "recipes-v1");

    if (error) {
      throw error;
    }

    console.log(`✓ Successfully deleted ${count} documents from the database.`);
    console.log("\nYou can now run: node rag.js");
    console.log("This will load the 20k recipes into Supabase.");
  } catch (err) {
    console.error("Error during cleanup:", err.message);
    process.exit(1);
  }
}

cleanup();
