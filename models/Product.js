const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  Name: {
    type: String,
    required: true,
  },
  CategoryID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true,
  },
  Description: {
    type: String,
    required: true,
  },
  Price: {
    type: Number,
    required: true,
  },
  StockQuantity: {
    type: Number,
    required: true,
  },
  ImageURL: {
    type: String,
    required: true,
  },
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
