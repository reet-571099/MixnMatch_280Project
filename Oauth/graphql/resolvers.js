const bcrypt = require("bcrypt");
const User = require("../models/User");
const { createToken } = require("../utils/auth");

const resolvers = {
  Query: {
    me: async (_, __, { user }) => user
  },

  Mutation: {
    signup: async (_, { email, password, name, role }) => {
      try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
          // Check if user signed up with Google
          if (existingUser.signupMethod === "google") {
            throw new Error("This email is already registered with Google. Please sign in with Google or use a different email.");
          }
          throw new Error("Email already exists. Please sign in instead.");
        }

        const hashed = await bcrypt.hash(password, 10);
        const user = await User.create({
          email,
          password: hashed,
          name: name || "",
          role: role || "candidate",
          signupMethod: "local"
        });

        const token = createToken(user);
        return { token, user };
      } catch (error) {
        // Handle MongoDB duplicate key error
        if (error.code === 11000 || error.message.includes("duplicate key")) {
          throw new Error("Email already exists. Please sign in instead.");
        }
        // Re-throw other errors (like the custom messages above)
        throw error;
      }
    },

    login: async (_, { email, password }) => {
      const user = await User.findOne({ email });
      if (!user) throw new Error("User not found");

      const valid = await bcrypt.compare(password, user.password);
      if (!valid) throw new Error("Invalid credentials");

      const token = createToken(user);
      return { token, user };
    }
  }
};

module.exports = resolvers;
