const express = require('express');
const mongoose = require('mongoose');
const formidable = require('express-formidable');
const cors = require('cors');
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
cloudinary.config({
    cloud_name: CLOUD_NAME,
    api_key: API_KEY,
    api_secret: API_SECRET,
    secure: true,
});

//Import des routes
const userRoutes = require('./routes/userRoutes');
app.use(userRoutes);
const offerRoutes = require('./routes/offerRoutes');
app.use(offerRoutes);

//Route par défault :
app.get('/', (req, res) => {
    res.json("Bienvenue sur l'API de Vinted");
});

app.all('*', (req, res) => {
    res.status(404).json({ message: `Page not found` });
});

//Lancement du serveur
app.listen(process.env.PORT, () => {
    console.log('Server started');
});
