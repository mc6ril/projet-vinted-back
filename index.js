const express = require('express');
const mongoose = require('mongoose');
const formidable = require('express-formidable');
const cors = require('cors');
const stripe = require('stripe')(process.env.STRIPE_KEY);
const app = express();
app.use(formidable());
app.use(cors());

//Permet l'accès aux variables d'environnement
require('dotenv').config();
//Connection à mongoDb
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
});

//configuration de cloudinary :
const cloudinary = require('cloudinary').v2;
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET,
    secure: true,
});

//Import des routes
const userRoutes = require('./routes/userRoutes');
app.use(userRoutes);
const offerRoutes = require('./routes/offerRoutes');
app.use(offerRoutes);
const storesRoutes = require('./routes/storesRoutes');
app.use(storesRoutes);

//Route par défault :
app.get('/', (req, res) => {
    res.json("Bienvenue sur l'API de Vinted");
});

app.post('/payment', async (req, res) => {
    try {
        console.log(hello);
        const response = await stripe.charges.create({
            amount: req.fields.amount * 100,
            currency: 'eur',
            description: req.fields.title,
            source: req.fields.stripeToken,
        });

        console.log(response.status);

        res.json(response);
    } catch (error) {
        console.log(error.message);
        res.status(400).json({ message: `Hello` });
    }
});

app.all('*', (req, res) => {
    res.status(404).json({ message: `Page not found` });
});

//Lancement du serveur
app.listen(process.env.PORT, () => {
    console.log('Server started');
});
