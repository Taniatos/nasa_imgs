import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import User from "../models/User.js";
import Favorite from "../models/Favorite.js"; 

// Configure the path to the .env file
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, "../.env") });

const seedUsers = async () => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error(
        "MONGO_URI is not defined. Make sure your .env file is in the backend directory."
      );
    }

    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected for seeding");

    // Clear existing users AND favorites
    await User.deleteMany({});
    console.log("Existing users cleared");
    await Favorite.deleteMany({}); 
    console.log("Existing favorites cleared");

    // Define the default users
    const usersData = [
      {
        email: "user@example.com",
        password: "password123!",
        role: "user",
      },
      {
        email: "admin@example.com",
        password: "password234!",
        role: "admin",
      },
    ];

    const userPromises = usersData.map((userData) => {
      const user = new User(userData);
      return user.save();
    });

    await Promise.all(userPromises);
    console.log("Default users have been added successfully");
  } catch (error) {
    console.error("Error seeding database:", error);
  } finally {
    mongoose.disconnect();
    console.log("MongoDB disconnected");
  }
};

seedUsers();