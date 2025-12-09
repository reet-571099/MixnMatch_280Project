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

