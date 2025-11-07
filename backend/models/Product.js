// models/Product.js

const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    category: { type: String, required: true },
    image: { type: String }, // URL to a product image
});

// CRITICAL FIX: Explicitly set the collection name to 'Product' 
// (or whatever the exact name is in your MongoDB Atlas Data Explorer)
// If your collection in Atlas is actually named 'products' (lowercase), 
// then use: mongoose.model('Product', productSchema, 'products');

// If your collection in Atlas is named 'Product' (singular, capitalized),
// which is the most likely cause:
const Product = mongoose.model('Product', productSchema, 'Product'); 

module.exports = Product;