const mongoose = require('mongoose');

const shoppingCartSchema = new mongoose.Schema({
  UserID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Reference to the User model
    required: true,
  },
  ProductID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product', // Reference to the Product model
    required: true,
  },
  Quantity: {
    type: Number,
    required: true,
    min: 1, // Assuming the quantity should be at least 1
  },
});

// Ensure a unique combination of UserID and ProductID
shoppingCartSchema.index({ UserID: 1, ProductID: 1 }, { unique: true });

const ShoppingCart = mongoose.model('ShoppingCart', shoppingCartSchema);

module.exports = ShoppingCart;
