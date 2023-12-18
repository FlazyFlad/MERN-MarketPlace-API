const express = require('express');
const router = express.Router();
const ShoppingCart = require('../models/ShoppingCart');

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

    console.log('111', req.body)

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

router.delete('/remove/:itemId', async (req, res) => {
  try {
    const itemId = req.params.itemId;

    await ShoppingCart.findByIdAndRemove(itemId);

    res.json({ message: 'Item removed from the shopping cart' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

module.exports = router;
