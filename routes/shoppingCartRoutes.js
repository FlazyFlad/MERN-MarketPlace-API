const express = require('express');
const router = express.Router();
const ShoppingCart = require('../models/shoppingCart');

router.get('/user/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;

    const shoppingCartItems = await ShoppingCart.find({ UserID: userId })
      .populate('ProductID')
      .exec();

    res.json(shoppingCartItems);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

router.post('/add', async (req, res) => {
  try {
    const { UserID, ProductID, Quantity } = req.body;

    const existingItem = await ShoppingCart.findOne({ UserID, ProductID });

    if (existingItem) {
      return res.status(400).json({ message: 'Product already in the cart' });
    } else {
      const shoppingCartItem = new ShoppingCart({
        UserID,
        ProductID,
        Quantity,
      });

      await shoppingCartItem.save();
    }

    res.json({ message: 'Item added to the shopping cart' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

router.post('/change-quantity', async (req, res) => {
  try {
    const { UserID, ProductID, NewQuantity } = req.body;

    const existingItem = await ShoppingCart.findOne({ UserID, ProductID });

    if (!existingItem) {
      return res.status(400).json({ message: 'Product not found in the cart' });
    }

    existingItem.Quantity = NewQuantity;
    await existingItem.save();

    res.json({ message: 'Quantity changed successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

router.post('/remove-item', async (req, res) => {
  try {
    const { UserID, ProductID } = req.body;

    const existingItem = await ShoppingCart.findOneAndDelete({ UserID, ProductID });

    if (!existingItem) {
      return res.status(400).json({ message: 'Product not found in the cart' });
    }

    res.json({ message: 'Item removed from the shopping cart' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

router.post('/clear-cart', async (req, res) => {
  try {
    const { UserID } = req.body;

    await ShoppingCart.deleteMany({ UserID });

    res.json({ message: 'Shopping cart cleared successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});


module.exports = router;
