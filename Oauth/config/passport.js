const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("../models/User");

module.exports = function (passport) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: "/auth/google/callback"
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          // First, try to find by googleId
          let user = await User.findOne({ googleId: profile.id });
          
          if (user) {
            // User exists with this Google ID
            return done(null, user);
          }
          
          // Check if user exists with this email (might have signed up locally first)
          user = await User.findOne({ email: profile.emails[0].value });
          
          if (user) {
            // User exists with this email but different signup method
            // Update the user to link Google account
            user.googleId = profile.id;
            if (!user.name) user.name = profile.displayName;
            await user.save();
            return done(null, user);
          }
          
          // Create new user
          user = await User.create({
            googleId: profile.id,
            email: profile.emails[0].value,
            name: profile.displayName,
            signupMethod: "google"
          });
          
          return done(null, user);
        } catch (err) {
          // Handle duplicate key error
          if (err.code === 11000 || err.message.includes("duplicate key")) {
            // Try to find the existing user
            const existingUser = await User.findOne({ email: profile.emails[0].value });
            if (existingUser) {
              // Link Google account to existing user
              existingUser.googleId = profile.id;
              if (!existingUser.name) existingUser.name = profile.displayName;
              await existingUser.save();
              return done(null, existingUser);
            }
          }
          return done(err, false);
        }
      }
    )
  );

  passport.serializeUser((user, done) => done(null, user.id));
  passport.deserializeUser((id, done) =>
    User.findById(id).then(user => done(null, user))
  );
};
