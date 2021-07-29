const express = require('express');
const router = express.Router();

const uid2 = require('uid2');
const SHA256 = require('crypto-js/sha256');
const encBase64 = require('crypto-js/enc-base64');
const cloudinary = require('cloudinary').v2;

//Récupération du model
const User = require('../models/User');
const isAuthenticated = require('../middlewares/isAuthenticated');

//Initilisation des routes User
//Initialisation de la route Sign Up
router.post('/user/signup', async (req, res) => {
    try {
        const checkMail = await RegExp(req.fields.email, 'i');
        const findMail = await User.findOne({ email: checkMail });

        if (findMail) {
            res.status(400).json({
                message: 'This user already exist. Please verify your email.',
            });
        } else {
            //Methode d'encryptage
            const salt = uid2(16);
            const hash = SHA256(req.fields.password + salt).toString(encBase64);
            const token = uid2(64);

            //Création d'un nouvel utilisateur
            const user = new User({
                email: req.fields.email,
                account: {
                    username: req.fields.username,
                    phone: req.fields.phone,
                    //avatar: req.files.avatar.path,
                },
                token: token,
                salt: salt,
                hash: hash,
            });

            //await cloudinary.uploader.upload(req.files.avatar.path, {
             //   folder: `/vinted/user/${user._id}`,
            });
            await user.save();
            res.status(200).json({
                email: user.email,
                token: user.token,
                account: user.account,
                avatar: user.avatar,
            });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

//Initialisation de la route de Sign in

router.post('/user/login', async (req, res) => {
    try {
        const checkMail = await RegExp(req.fields.email, 'i');
        const findMail = await User.findOne({ email: checkMail });

        if (findMail) {
            const newHash = SHA256(req.fields.password + findMail.salt).toString(
                encBase64,
            );
            if (newHash === findMail.hash) {
                res.status(200).json({
                    _id: findMail._id,
                    token: findMail.token,
                    account: findMail.account,
                });
            } else {
                res.status(401).json({ message: 'Unauthorized' });
            }
        } else {
            res.status(400).json({
                message: 'This user has not been found in our database',
            });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

//Route pour supprimer un utilisateur
router.delete('/user/delete', isAuthenticated, async (req, res) => {
    try {
        const checkMail = await RegExp(req.fields.email, 'i');
        const userToDelete = await User.findOne({ email: checkMail });

        if (userToDelete) {
            await userToDelete.remove();

            await cloudinary.api.delete_all_resources(`/vinted/user/${userToDelete._id}`);
            await cloudinary.api.delete_folder(`/vinted/user/${userToDelete._id}`);

            res.status(200).json({ message: 'This user has been well deleted' });
        } else {
            res.status(400).json({ message: 'This user does not exist' });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});
//Export des routes
module.exports = router;
