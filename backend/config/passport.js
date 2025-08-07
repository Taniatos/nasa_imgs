import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import User from "../models/User.js";

// Configure the local strategy for username/password authentication
passport.use(
  new LocalStrategy(
    // By default, LocalStrategy uses a username field, this changes it to 'email'
    { usernameField: "email" },
    async (email, password, done) => {
      try {
        // Find the user in the database by their email
        const user = await User.findOne({ email });
        if (!user) return done(null, false, { message: "User not found" });

        // Use the method from the User model to compare passwords
        const isMatch = await user.comparePassword(password);
        if (!isMatch) return done(null, false, { message: "Invalid password" });

        // If credentials are correct, return the user object
        return done(null, user);
      } catch (err) {
        return done(err);
      }
    }
  )
);

// Only user ID is stored in the session
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// Retrieves the full user object from the database based on the ID stored in the session
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err);
  }
});
