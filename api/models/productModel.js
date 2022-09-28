const mongoose = require('mongoose')


const productSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, "Please enter product title!"],
        trim: true
    },
    description: {
        type: String,
        required: [true, "Please enter product description!"],
        trim: true,
    },
    price: {
        type: Number,
        required: [true, "Please enter your price!"]
    },
    location: {
        type: String,
        required: [true, "Please enter your location!"]
    },
    category: {
        type: String,
        required: [true, "Please enter product category!"]
    },
    phone: {
        type: Number,
        required: [true, "Please enter your phone number!"]
    },
    image: {
        type: String,
        default: "",
        required: true
    },
    isArchived: {
        type: Number,
        default: 0 // 0 = not archieved, 1 = archived
    },
    user: {type: mongoose.Types.ObjectId, ref: 'Users'}
}, {
    timestamps: true
})

module.exports = mongoose.model("Products", productSchema)