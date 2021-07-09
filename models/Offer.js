const mongoose = require('mongoose');

const ProductDetails = mongoose.Schema(
    {
        MARQUE: { type: String },
        TAILLE: { type: Number },
        ÉTAT: { type: String },
        COULEUR: { type: String },
        EMPLACEMENT: { type: String },
    },
    { _id: false }, // empeche l'ajout de nouveaux _id à chaque champs dans mon objet Offer
);

const Offer = mongoose.model('Offer', {
    product_name: {
        type: String,
        maxLength: 50,
    },
    product_description: {
        type: String,
        maxLength: 500,
    },
    product_price: {
        type: Number,
        max: 100000,
    },
    product_details: [ProductDetails],
    product_image: {
        type: mongoose.Schema.Types.Mixed,
        default: {},
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
});

module.exports = Offer;
