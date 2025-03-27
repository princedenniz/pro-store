import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    price:{
        type: Number,
        required: true
    },
    image:{
        type: String,
        required: true
    },
}, {
    timestamps: true // ensure createdAt, and updatedAt are attached to each product doc
});

const Product = mongoose.model('Product', productSchema);

export default Product;