const express = require('express');
const mongoose = require('mongoose');
const formidable = require('express-formidable');
const dotenv = require('dotenv');
const app = express();
app.use(formidable());
app.use(dotenv());

//Connection à mongoDb
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
});

//Import des routes
const userRoutes = require('./routes/userRoutes');
app.use(userRoutes);
const offerRoutes = require('./routes/offerRoutes');
app.use(offerRoutes);

//Route par défault :
app.all('*', (req, res) => {
    res.status(404).json({ message: `Page not found` });
});

//Lancement du serveur
app.listen(PORT, () => {
    console.log('Server started');
});
