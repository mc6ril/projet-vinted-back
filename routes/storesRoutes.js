const express = require('express');
const router = express.Router();
const cloudinary = require('cloudinary').v2;

// import des model
const User = require('../models/User');
const Offer = require('../models/Offer');
const Stores = require('../models/Stores');

router.post('/stores/newstore', async (req, res) => {
    try {
        const {
            store_name,
            store_adress,
            store_opening,
            store_phone,
            store_city,
            store_cp,
        } = req.fields;

        const newStore = new Stores({
            store_name: store_name,
            store_adress: store_adress,
            store_city: store_city,
            store_cp: store_cp,
            store_opening: store_opening,
            store_phone: store_phone,
        });

        if (req.files.picture) {
            const result = await cloudinary.uploader.upload(req.files.picture.path, {
                folder: `/vinted/stores/${newStore._id}`,
            });
            newStore.store_image = result;
        }

        await newStore.save();

        res.status(200).json({ newStore });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

router.get('/stores', async (req, res) => {
    try {
        const stores = await Stores.find();
        res.status(200).json(stores);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

module.exports = router;
