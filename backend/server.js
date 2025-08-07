import express from "express";
import mongoose from "mongoose";
import session from "express-session";
import passport from "passport";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import { createHandler } from "graphql-http/lib/use/express";
import graphqlSchema from "./graphql/schema.js";

import "./config/passport.js";
import authRoutes from "./routes/api/auth.js";
import favoritesRoutes from "./routes/api/favorites.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5050;

// CORS setup: allow cookies and frontend connection
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

// Body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Sessions
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false, // false for local (non-HTTPS)
      httpOnly: true,
      sameSite: "lax", // default for local dev
    },
  })
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/favorites", favoritesRoutes);

// Update the GraphQL endpoint
app.all(
  "/graphql",
  createHandler({
    schema: graphqlSchema,
    graphiql: true,
  })
);

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => console.error("Mongo error:", err));
