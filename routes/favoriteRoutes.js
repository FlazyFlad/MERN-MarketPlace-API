const express = require('express');
const router = express.Router();
const Favorite = require('../models/Favorite');

router.get('/user/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;

    const favoriteItems = await Favorite.find({ UserID: userId })
      .populate('ProductID')
      .exec();

    res.json(favoriteItems);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

router.post('/add', async (req, res) => {
  try {
    const { UserID, ProductID } = req.body;

    const existingItem = await Favorite.findOne({ UserID, ProductID });

    if (existingItem) {
      return res.status(400).json({ message: 'Product already in favorites' });
    } else {
      const favoriteItem = new Favorite({
        UserID,
        ProductID,
      });

      await favoriteItem.save();
    }

    res.json({ message: 'Item added to favorites' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

router.post('/remove-item', async (req, res) => {
  try {
    const { UserID, ProductID } = req.body;

    const existingItem = await Favorite.findOneAndDelete({ UserID, ProductID });

    if (!existingItem) {
      return res.status(400).json({ message: 'Product not found in favorites' });
    }

    res.json({ message: 'Item removed from favorites' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

router.post('/clear-favorites', async (req, res) => {
  try {
    const { UserID } = req.body;

    await Favorite.deleteMany({ UserID });

    res.json({ message: 'Favorites cleared successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

module.exports = router;
