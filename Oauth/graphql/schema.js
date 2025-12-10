const { gql } = require("apollo-server-express");

const typeDefs = gql`
  enum Role {
    admin
    recruiter
    candidate
  }

  type User {
    id: ID!
    email: String!
    name: String
    role: Role
    signupMethod: String
  }

  type AuthResponse {
    token: String
    user: User
  }

  type Ingredient {
    name: String!
    quantity: Float
    unit: String
    notes: String
  }

  type Step {
    stepNumber: Int!
    instruction: String!
  }

  type Macros {
    calories: Float
    protein: Float
    carbs: Float
    fats: Float
  }

  type Recipe {
    id: ID!
    userId: ID!
    slug: String!
    name: String!
    description: String
    servings: Int
    prepTimeMinutes: Int
    cookTimeMinutes: Int
    totalTimeMinutes: Int!
    difficulty: String
    cuisine: String
    mealType: String
    tags: [String]
    ingredients: [Ingredient]
    steps: [Step]
    imageUrl: String
    author: Author
    rating: Float
    ratingCount: Int
    macros: Macros
    createdAt: String
    sourceUrl: String
  }

  type Author {
    name: String
    isAI: Boolean
  }

  input RecipeInput {
    title: String!
    summary: String
    ingredients: [String!]!
    steps: [String!]!
    macros: MacrosInput
    time: Int
    difficulty: String
    servings: Int
    explanation: String
  }

  input MacrosInput {
    calories: Float
    protein: Float
    carbs: Float
    fats: Float
  }

  type Query {
    me: User
    myRecipes: [Recipe]
  }

  type Mutation {
    signup(email: String!, password: String!, name: String, role: Role): AuthResponse
    login(email: String!, password: String!): AuthResponse
    saveRecipe(recipe: RecipeInput!): Recipe
  }
`;

module.exports = typeDefs;
