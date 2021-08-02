const express = require('express');
const router = express.Router();

const cloudinary = require('cloudinary').v2;
const Offer = require('../models/Offer');
const User = require('../models/User');
const Stores = require('../models/Stores');
const isAuthenticated = require('../middlewares/isAuthenticated');

//Création des routes offers
//Route de publish
router.post('/offer/publish', isAuthenticated, async (req, res) => {
    try {
        //Destructuring :
        const { title, description, price, condition, size, color, city, brand } =
            req.fields;

        // On déclare notre nouvelle offre
        const newOffer = new Offer({
            product_name: title,
            product_description: description,
            product_price: price,
            product_details: [
                { MARQUE: brand },
                { TAILLE: size },
                { ÉTAT: condition },
                { COULEUR: color },
                { EMPLACEMENT: city },
            ],
            owner: req.user,
        });

        if (req.files.product_image) {
            const result = await cloudinary.uploader.upload(
                req.files.product_image.path,
                {
                    folder: `/vinted/offers/${newOffer._id}`,
                },
            );
            newOffer.product_image = result;
        }

        await newOffer.save();

        res.status(200).json({ newOffer });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

//Route de modification de l'annonce
router.put('/offer/update', isAuthenticated, async (req, res) => {
    try {
        const offerToUpdate = await Offer.findById(req.fields.id);

        //Si l'offre existe
        if (offerToUpdate) {
            if (req.fields.title) {
                offerToUpdate.product_name = req.fields.title;
            }
            if (req.fields.description) {
                offerToUpdate.product_description = req.fields.description;
            }
            if (req.fields.price) {
                offerToUpdate.product_price = req.fields.price;
            }
            if (req.fields.brand) {
                offerToUpdate.product_details[0].MARQUE = req.fields.brand;
            }
            if (req.fields.size) {
                offerToUpdate.product_details[1].TAILLE = req.fields.size;
            }
            if (req.fields.condition) {
                offerToUpdate.product_details[2].ÉTAT = req.fields.condition;
            }
            if (req.fields.color) {
                offerToUpdate.product_details[3].COULEUR = req.fields.color;
            }
            if (req.fields.city) {
                offerToUpdate.product_details[4].EMPLACEMENT = req.fields.city;
            }

            //si l'utilisateur veut modifier l'image
            if (req.files.picture) {
                await cloudinary.api.delete_all_resources(
                    `/vinted/offers/${offerToUpdate._id}`,
                );
                const result = await cloudinary.uploader.upload(req.files.picture.path, {
                    folder: `/vinted/offers/${offerToUpdate._id}`,
                });
                offerToUpdate.product_image = result;
            }

            await offerToUpdate.save();
            res.status(200).json({ message: 'Your offer has been well updated' });
        } else {
            res.status(400).json({ message: 'This offer does not exists' });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

//Route de suppression de l'annonce
router.delete('/offer/delete', isAuthenticated, async (req, res) => {
    try {
        const offerToDelete = await Offer.findById(req.fields._id);

        if (offerToDelete) {
            await offerToDelete.remove();
            await cloudinary.api.delete_all_resources(
                `/vinted/offers/${offerToDelete._id}`,
            );
            await cloudinary.api.delete_folder(`/vinted/offers/${offerToDelete._id}`);

            res.status(200).json({ message: 'Your offer has been well deleted' });
        } else {
            res.status(400).json({ message: 'This offer does not exists' });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

//Route pour faire une recherche de toutes les offres, et filtres

router.get('/offers', async (req, res) => {
    try {
        //Options pour le find
        const filter = {};

        if (req.query.title) {
            let result = new RegExp(req.query.title, 'i');
            filter.product_name = result;
        }
        if (req.query.priceMin || req.query.priceMax) {
            filter.product_price = {};
            if (!isNaN(req.query.priceMax)) {
                filter.product_price.$lte = Number(req.query.priceMax);
            }
            if (!isNaN(req.query.priceMin)) {
                filter.product_price.$gte = Number(req.query.priceMin);
            }
        }

        //Option pour le sort :
        let sort = {};
        if (req.query.sort) {
            if (req.query.sort === 'price-asc') {
                sort = { product_price: 1 };
            } else if (req.query.sort === 'price-desc') {
                sort = { product_price: -1 };
            }
        }

        //Options de paginations
        let page;
        const limit = Number(req.query.limit);
        if (Number(req.query.limit) < 1) {
            page = 1;
        } else {
            page = Number(req.query.page);
        }
        const skip = limit * (page - 1);

        //Fonctions de tri
        const offers = await Offer.find(filter)
            .populate({
                path: 'owner', //On appelle l'user pour afficher les informations de la personne qui a posté l'annonce
                select: 'account', //permet de ne pas afficher les clés salt, token.... qui sont sensibles
            })
            .sort(sort)
            .skip(skip)
            .limit(limit);
        const count = await Offer.countDocuments(filter);

        res.status(200).json({ count, offers });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

//Route de recherche avec un paramètre en id
router.get('/offer/:id', async (req, res) => {
    try {
        const offers = await Offer.findById(req.params.id).populate({
            path: 'owner',
            select: 'account',
        });
        res.status(200).json(offers);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

module.exports = router;
