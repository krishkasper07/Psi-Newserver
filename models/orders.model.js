const mongoose = require('mongoose');

const orderSchema = mongoose.Schema({
    order_number: {
        type: Number
    },
    order_id: {
        type: Number
    },
    products: { type: Array, "default": [] },
    notes: {
        type: String
    },
    orderDate: {
        type: String
    },
    deliveryType: {
        type: String
    },
})

module.exports = mongoose.model('order', orderSchema);