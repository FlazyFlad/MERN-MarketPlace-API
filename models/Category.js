const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  Name: { type: String, required: true },
  // Additional category-related fields
});

const Category = mongoose.model('Category', categorySchema);

module.exports = Category;