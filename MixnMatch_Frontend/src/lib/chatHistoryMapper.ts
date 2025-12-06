import type { ChatHistoryEntry } from './ragClient';

// Frontend Message interface (from ChatInterface.tsx)
export interface Message {
  id: string;
  role: 'user' | 'bot';
  content: string;
  recipe?: any;
  isError?: boolean;
}

/**
 * Convert frontend Message array to backend ChatHistoryEntry format
 *
 * Frontend format: { role: "user" | "bot", content: string, recipe?: Recipe }
 * Backend format: { role: "human" | "ai", content: string }
 *
 * @param messages - Array of frontend Message objects
 * @returns Array of backend ChatHistoryEntry objects
 */
export function convertMessagesToBackendHistory(
  messages: Message[]
): ChatHistoryEntry[] {
  return messages
    .filter(msg => !msg.isError) // Exclude error messages from history
    .map(msg => {
      // Include recipe title in content if recipe exists
      let content = msg.content;
      if (msg.recipe && msg.recipe.title) {
        content = `${msg.content}\n\nRecipe: ${msg.recipe.title}`;
      }

      return {
        role: msg.role === 'user' ? 'human' : 'ai',
        content: content,
      };
    });
}
