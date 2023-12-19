const express = require('express');
const router = express.Router();
const Model = require('../models/Model');

// Get all models
router.get('/models', async (req, res) => {
    try {
        const models = await Model.find();
        res.json(models);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// Get a single model by ID
router.get('/models/:modelId', async (req, res) => {
    try {
        const model = await Model.findById(req.params.modelId);
        if (!model) {
            return res.status(404).json({ message: 'Model not found' });
        }
        res.json(model);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// Create a new model
router.post('/models', async (req, res) => {
    const { Name, Brand, Description } = req.body;

    try {
        const newModel = new Model({
            Name,
            Brand,
            Description,
        });

        await newModel.save();
        res.status(201).json(newModel);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// Update a model by ID
router.put('/models/:modelId', async (req, res) => {
    const { Name, Brand, Description } = req.body;

    try {
        const updatedModel = await Model.findByIdAndUpdate(
            req.params.modelId,
            {
                Name,
                Brand,
                Description,
            },
            { new: true }
        );

        if (!updatedModel) {
            return res.status(404).json({ message: 'Model not found' });
        }

        res.json(updatedModel);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// Delete a model by ID
router.delete('/models/:modelId', async (req, res) => {
    try {
        const deletedModel = await Model.findByIdAndDelete(req.params.modelId);

        if (!deletedModel) {
            return res.status(404).json({ message: 'Model not found' });
        }

        res.json({ message: 'Model deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

module.exports = router;
