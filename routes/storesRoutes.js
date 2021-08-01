const express = require('express');
const router = express();
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
            store_number,
            store_city,
            store_cp,
        } = req.fields;

        const newStore = new Stores({
            store_image: {
                type: mongoose.Schema.Types.Mixed,
                default: {},
            },
            store_name: store_name,
            store_adress: store_adress,
            store_city: store_city,
            store_cp: store_cp,
            store_opening: store_opening,
            store_number: store_number,
        });
        const result = await cloudinary.uploader.upload(req.files.picture.path, {
            folder: `/orion-vinted/offer/${newOffer._id}`,
        });
        // Ajouter le resultat de l'upload dans newStore
        newStore.store_image = result;
        // Sauvgarder newStore
        await newStore.save();
        res.json(newStore);
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
