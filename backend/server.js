import express from "express";
import mongoose from "mongoose";
import session from "express-session";
import passport from "passport";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import http from "http";

import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";

import graphqlSchema from "./graphql/schema.js";
import "./config/passport.js";
import authRoutes from "./routes/api/auth.js";
import favoritesRoutes from "./routes/api/favorites.js";
import adminRoutes from "./routes/api/admin.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5050;

// Create the Apollo Server instance
const apolloServer = new ApolloServer({
  schema: graphqlSchema,
});

// The server must be started asynchronously
async function startServer() {
  await apolloServer.start();

  app.use(
    cors({
      origin: process.env.CORS_ORIGIN,
      credentials: true,
    })
  );

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(cookieParser());

  app.use(
    session({
      secret: process.env.SESSION_SECRET,
      resave: false,
      saveUninitialized: false,
      store: MongoStore.create({
        mongoUrl: process.env.MONGO_URI,
      }),
      cookie: {
        secure: process.env.NODE_ENV === "production",
        httpOnly: true,
        sameSite: "lax",
        maxAge: 1000 * 60 * 60 * 24,
      },
    })
  );

  app.use(passport.initialize());
  app.use(passport.session());

  app.use("/api/auth", authRoutes);
  app.use("/api/favorites", favoritesRoutes);
  app.use("/api/admin", adminRoutes);

  // Apollo Server middleware
  app.use("/graphql", express.json(), expressMiddleware(apolloServer));

  mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
      console.log("MongoDB connected");
      app.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`);
        console.log(
          `GraphQL endpoint ready at http://localhost:${PORT}/graphql`
        );
      });
    })
    .catch((err) => console.error("Mongo error:", err));
}

startServer();
