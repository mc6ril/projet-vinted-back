const mongoose = require('mongoose');

const Stores = mongoose.model('store', {
    store_image: {
        type: mongoose.Schema.Types.Mixed,
        default: {},
    },
    store_name: String,
    store_adress: String,
    store_city: String,
    store_cp: Number,
    store_opening: String,
    store_number: Number,
});

module.exports = Stores;
