
const mongoose = require("mongoose");
const customerScheema = new mongoose.Schema({
    name: {
        type: String
    },
    phone: {
        type: String
    },
    cnic: {
        type: String
    },
    project: {
        type: String
    },
    property_type: {
        type: String
    },
    property_id: {
        type: String
    },
    amount: {
        type: Number
    },
    area : {
        type: String
    },
    block : {
        type: String
    },
    transaction_status: {
        type: String
    },
    is_deleted: {
        type: Boolean,
        default: false
    },
    is_approved: {
        type: Boolean,
        default: false
    },
    deleted_at: {
        type: Date,
    },
    approved_at: {
        type: Date
    },
    approved_by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    created_at: {
        type: Date,
        default: Date.now,
    }
})

const Customer = mongoose.model("Customer", customerScheema);
module.exports = Customer;

