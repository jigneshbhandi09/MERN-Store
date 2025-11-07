// server.js

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

// Load environment variables from .env file
dotenv.config(); 

const app = express();

// --- Configuration ---
const PORT = process.env.PORT || 5000;

// --- Middleware ---
app.use(cors()); // Enables cross-origin requests from your frontend
app.use(express.json()); // Allows parsing of JSON request bodies

// --- Database Connection Function ---
const connectDB = async () => {
  try {
    // Mongoose automatically handles useNewUrlParser and useUnifiedTopology now
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (err) {
    console.error(`❌ MongoDB connection error: ${err.message}`);
    // Exit process with failure
    process.exit(1);
  }
};

// --- Product Model (Ensure this file exists in ./models/Product.js) ---
const Product = require("./models/Product");

// --- Routes ---

// Get all products (GET /api/products)
app.get("/api/products", async (req, res) => {
  try {
    const products = await Product.find({}); // Find all products
    res.json(products);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error: Could not fetch products." });
  }
});

// Get product by ID (GET /api/products/:id)
app.get("/api/products/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json(product);
  } catch (err) {
    // Handle invalid MongoDB ID format errors
    if (err.kind === 'ObjectId') {
        return res.status(400).json({ message: "Invalid product ID format." });
    }
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Add product (POST /api/products) - Used for adding products/testing
app.post("/api/products", async (req, res) => {
  try {
    const product = new Product(req.body);
    await product.save();
    res.status(201).json(product);
  } catch (err) {
    console.error(err);
    // Handle Mongoose validation errors
    if (err.name === 'ValidationError') {
        return res.status(400).json({ message: err.message });
    }
    res.status(400).json({ message: "Error creating product." });
  }
});

// Filter by category (GET /api/products/category/:category)
// NOTE: This route needs to be placed BELOW the specific :id route to work correctly!
app.get("/api/products/category/:category", async (req, res) => {
  try {
    const products = await Product.find({ category: req.params.category });
    
    if (products.length === 0) {
      // You can return a 200 with an empty array or a 404, 
      // 200 with empty is often preferred for list pages.
      return res.status(404).json({ message: "No products found in this category" });
    }
    res.json(products);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});


// --- Initialize Application ---

// 1. Connect to the database
// 2. Start the server ONLY if the connection is successful
connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`✅ Server running on http://localhost:${PORT}`);
    });
});