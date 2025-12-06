import type { Recipe } from '@/components/RecipeCard';

// Backend API constraint types
export interface BackendConstraints {
  calories?: { min: number; max: number };
  protein?: { min: number; max: number };
  carbs?: { min: number; max: number };
  fats?: { min: number; max: number };
  maxTime?: number;
  dietary?: string[];
  allergens?: string[];
  dislikes?: string[];
}

// Chat history entry format for backend
export interface ChatHistoryEntry {
  role: 'human' | 'ai';
  content: string;
}

// RAG query request structure
export interface RAGQueryRequest {
  question: string;
  chatHistory: ChatHistoryEntry[];
  constraints: BackendConstraints;
}

// RAG query response structure
export interface RAGQueryResponse {
  success: boolean;
  recipe?: Recipe;
  error?: string;
}

// Get API base URL from environment or use default
const API_BASE_URL = (import.meta as any).env?.VITE_RAG_API_URL || 'http://localhost:3001';

/**
 * Query the RAG backend API for recipe recommendations
 * @param params - Query parameters including question, chat history, and constraints
 * @returns Promise resolving to success/error response with optional recipe
 */
export async function queryRAG(params: RAGQueryRequest): Promise<RAGQueryResponse> {
  try {
    console.log('🔍 RAG Request:', { url: `${API_BASE_URL}/api/query`, params });

    // Create abort controller for timeout (60 seconds for LLM processing)
    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
      console.warn('⏱️ Request timeout after 60 seconds');
      controller.abort();
    }, 60000);

    const response = await fetch(`${API_BASE_URL}/api/query`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    console.log('📥 RAG Response Status:', response.status, response.statusText);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('❌ RAG Error Response:', errorData);
      return {
        success: false,
        error: errorData.error || `HTTP ${response.status}: ${response.statusText}`,
      };
    }

    const data = await response.json();
    console.log('✅ RAG Success:', data);
    return data;
  } catch (error) {
    console.error('❌ RAG Fetch Error:', error);
    if (error instanceof Error) {
      if (error.name === 'AbortError' || error.name === 'TimeoutError') {
        return {
          success: false,
          error: 'Request timed out. Please try again.',
        };
      }
      return {
        success: false,
        error: error.message || 'Failed to connect to recipe service',
      };
    }
    return {
      success: false,
      error: 'An unknown error occurred',
    };
  }
}

/**
 * Check if the RAG backend API is healthy and running
 * @returns Promise resolving to true if healthy, false otherwise
 */
export async function healthCheck(): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE_URL}/health`, {
      signal: AbortSignal.timeout(5000),
    });
    return response.ok;
  } catch {
    return false;
  }
}
