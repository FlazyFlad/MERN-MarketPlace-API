const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const multer = require('multer');

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Get all products
router.get('/products', async (req, res) => {
    try {
        const products = await Product.find().populate('CategoryID ModelID');
        res.json(products);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// Get a single product by ID
router.get('/products/:productId', async (req, res) => {
    try {
        const product = await Product.findById(req.params.productId).populate('CategoryID ModelID');
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        const categoryName = product.CategoryID ? product.CategoryID.Name : 'Uncategorized';

        res.json({ ...product.toObject(), categoryName });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// Create a new product with an imageURL
router.post('/products', async (req, res) => {
    const { Name, CategoryID, Description, Price, StockQuantity, ImageURL, ModelID } = req.body;

    try {
        const newProduct = new Product({
            Name,
            CategoryID,
            Description,
            Price,
            StockQuantity,
            ImageURL,
            ModelID,
        });

        await newProduct.save();
        res.status(201).json(newProduct);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// Update a product by ID with an imageURL
router.put('/products/:productId', async (req, res) => {
    const { Name, CategoryID, Description, Price, StockQuantity, ImageURL, ModelID } = req.body;

    try {
        const updatedProduct = await Product.findByIdAndUpdate(
            req.params.productId,
            {
                Name,
                CategoryID,
                Description,
                Price,
                StockQuantity,
                ImageURL,
                ModelID,
            },
            { new: true }
        );

        if (!updatedProduct) {
            return res.status(404).json({ message: 'Product not found' });
        }

        res.json(updatedProduct);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// Delete a product by ID
router.delete('/products/:productId', async (req, res) => {
    try {
        const deletedProduct = await Product.findByIdAndDelete(req.params.productId);

        if (!deletedProduct) {
            return res.status(404).json({ message: 'Product not found' });
        }

        res.json({ message: 'Product deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

module.exports = router;
