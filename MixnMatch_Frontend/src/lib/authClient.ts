// GraphQL API base URL from environment or use default
const API_BASE_URL = import.meta.env.VITE_AUTH_API_URL || 'http://localhost:5000';

// GraphQL endpoint
const GRAPHQL_ENDPOINT = `${API_BASE_URL}/graphql`;

// Types matching backend GraphQL schema
export interface User {
  id: string;
  email: string;
  name?: string;
  role?: string;
  signupMethod?: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface GraphQLResponse<T> {
  data?: T;
  errors?: Array<{ message: string }>;
}

export interface SavedRecipe {
  id: string;
  name: string;
  description: string;
  servings: number;
  prepTimeMinutes: number;
  cookTimeMinutes: number;
  totalTimeMinutes: number;
  difficulty: "easy" | "medium" | "hard";
  cuisine: string;
  mealType: string;
  ingredients: Array<{
    name: string;
    quantity?: number;
    unit?: string;
    notes?: string;
  }>;
  steps: Array<{
    stepNumber: number;
    instruction: string;
  }>;
  slug: string;
  createdAt: string;
}

/**
 * Execute a GraphQL mutation or query
 */
async function graphqlRequest<T>(
  query: string,
  variables?: Record<string, any>,
  token?: string
): Promise<T> {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(GRAPHQL_ENDPOINT, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      query,
      variables,
    }),
  });

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
  }

  const result: GraphQLResponse<T> = await response.json();

  if (result.errors && result.errors.length > 0) {
    throw new Error(result.errors[0].message);
  }

  if (!result.data) {
    throw new Error('No data returned from server');
  }

  return result.data;
}

/**
 * Login mutation
 */
const LOGIN_MUTATION = `
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user {
        id
        email
        name
        role
        signupMethod
      }
    }
  }
`;

/**
 * Signup mutation
 */
const SIGNUP_MUTATION = `
  mutation Signup($email: String!, $password: String!, $name: String) {
    signup(email: $email, password: $password, name: $name) {
      token
      user {
        id
        email
        name
        role
        signupMethod
      }
    }
  }
`;

/**
 * Get current user query
 */
const ME_QUERY = `
  query Me {
    me {
      id
      email
      name
      role
      signupMethod
    }
  }
`;

/**
 * Get user's saved recipes query
 */
const GET_MY_RECIPES_QUERY = `
  query GetMyRecipes {
    myRecipes {
      id
      name
      description
      servings
      prepTimeMinutes
      cookTimeMinutes
      totalTimeMinutes
      difficulty
      cuisine
      mealType
      ingredients {
        name
        quantity
        unit
        notes
      }
      steps {
        stepNumber
        instruction
      }
      slug
      createdAt
    }
  }
`;

/**
 * Login with email and password
 */
export async function login(email: string, password: string): Promise<AuthResponse> {
  const data = await graphqlRequest<{ login: AuthResponse }>(LOGIN_MUTATION, {
    email,
    password,
  });
  return data.login;
}

/**
 * Signup with email, password, and name
 */
export async function signup(
  email: string,
  password: string,
  name?: string
): Promise<AuthResponse> {
  const data = await graphqlRequest<{ signup: AuthResponse }>(SIGNUP_MUTATION, {
    email,
    password,
    name,
  });
  return data.signup;
}

/**
 * Get current authenticated user
 */
export async function getCurrentUser(token: string): Promise<User | null> {
  try {
    const data = await graphqlRequest<{ me: User }>(ME_QUERY, undefined, token);
    return data.me;
  } catch (error) {
    console.error('Failed to get current user:', error);
    return null;
  }
}

/**
 * Get user's saved recipes
 */
export async function getUserRecipes(token: string): Promise<SavedRecipe[]> {
  try {
    const data = await graphqlRequest<{ myRecipes: SavedRecipe[] }>(GET_MY_RECIPES_QUERY, undefined, token);
    return data.myRecipes || [];
  } catch (error) {
    console.error('Failed to get user recipes:', error);
    return [];
  }
}

/**
 * Get a specific saved recipe by ID
 */
export async function getSavedRecipe(token: string, recipeId: string): Promise<SavedRecipe | null> {
  try {
    const allRecipes = await getUserRecipes(token);
    return allRecipes.find(recipe => recipe.id === recipeId) || null;
  } catch (error) {
    console.error('Failed to get saved recipe:', error);
    return null;
  }
}

/**
 * Recipe input type for saving
 */
export interface RecipeInput {
  title: string;
  summary?: string;
  ingredients: string[];
  steps: string[];
  macros?: {
    calories?: number;
    protein?: number;
    carbs?: number;
    fats?: number;
  };
  time?: number;
  difficulty?: "easy" | "medium" | "hard";
  servings?: number;
  explanation?: string;
}

/**
 * Save recipe mutation
 */
const SAVE_RECIPE_MUTATION = `
  mutation SaveRecipe($recipe: RecipeInput!) {
    saveRecipe(recipe: $recipe) {
      id
      name
      slug
      createdAt
    }
  }
`;

/**
 * Delete recipe mutation
 */
const DELETE_RECIPE_MUTATION = `
  mutation DeleteRecipe($recipeId: ID!) {
    deleteRecipe(recipeId: $recipeId) {
      success
      message
    }
  }
`;

/**
 * Save a recipe to user's favorites
 */
export async function saveRecipe(recipe: RecipeInput, token: string): Promise<{ id: string; name: string }> {
  const data = await graphqlRequest<{ saveRecipe: { id: string; name: string } }>(
    SAVE_RECIPE_MUTATION,
    { recipe },
    token
  );
  return data.saveRecipe;
}

/**
 * Delete a saved recipe
 */
export async function deleteRecipe(recipeId: string, token: string): Promise<{ success: boolean; message: string }> {
  const data = await graphqlRequest<{ deleteRecipe: { success: boolean; message: string } }>(
    DELETE_RECIPE_MUTATION,
    { recipeId },
    token
  );
  return data.deleteRecipe;
}

