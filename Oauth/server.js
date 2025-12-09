require("dotenv").config();
const express = require("express");
const { ApolloServer } = require("apollo-server-express");
const mongoose = require("mongoose");
const passport = require("passport");
const session = require("express-session");
const cors = require("cors");
const typeDefs = require("./graphql/schema");
const resolvers = require("./graphql/resolvers");
const { getUserFromToken, createToken } = require("./utils/auth");
require("./config/passport")(passport);

const app = express();

// CORS configuration
const corsOptions = {
  origin: process.env.FRONTEND_URL || "http://localhost:8080",
  credentials: true,
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
  preflightContinue: false,
  optionsSuccessStatus: 204
};

// Custom CORS middleware to ensure headers are set
app.use((req, res, next) => {
  const origin = process.env.FRONTEND_URL || "http://localhost:8080";
  
  res.header('Access-Control-Allow-Origin', origin);
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Accept');
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.sendStatus(204);
    return;
  }
  
  next();
});

// Also use cors middleware as backup
app.use(cors(corsOptions));

// Parse JSON bodies
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((error) => {
    console.error("❌ MongoDB connection failed:", error.message);
    console.error("\n💡 Please check your MONGO_URI in .env file:");
    console.error("   - For MongoDB Atlas: mongodb+srv://username:password@cluster.mongodb.net/database");
    console.error("   - For local MongoDB: mongodb://localhost:27017/database");
    console.error("   - Make sure username/password are correct and URL-encoded");
    process.exit(1);
  });

// Express session setup for Passport (Google OAuth)
app.use(session({ secret: "secret", resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({ status: "ok", message: "Server is running" });
});

// Test CORS endpoint
app.get("/test-cors", (req, res) => {
  res.json({ 
    status: "ok", 
    message: "CORS test",
    headers: req.headers
  });
});

// Google OAuth routes
app.get("/auth/google", passport.authenticate("google", { scope: ["profile", "email"] }));

app.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/login" }),
  (req, res) => {
    const token = createToken(req.user);
    const frontendUrl = process.env.FRONTEND_URL || "http://localhost:8080";
    res.redirect(`${frontendUrl}/auth/callback?token=${token}`);
  }
);

// Apollo GraphQL setup
async function startApolloServer() {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: async ({ req }) => {
      const token = req.headers.authorization?.split(" ")[1];
      const user = token ? await getUserFromToken(token) : null;
      return { user };
    },
    // Don't set cors here - let Express handle it
    introspection: true, // Enable GraphQL Playground
    playground: true // Enable GraphQL Playground
  });

  await server.start();
  // Apply middleware - CORS is handled by Express middleware above
  server.applyMiddleware({ app, path: "/graphql" });

  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`🚀 Server running at http://localhost:${PORT}/graphql`));
}

startApolloServer();
