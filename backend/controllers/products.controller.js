import mongoose from "mongoose";
import Product from "../models/product.model.js"


export const getProducts = async(req,res)=>{
    try {
        const products = await Product.find({});
        res.status(200).json({success:true, message:products});
    } catch (error) {
        console.log("error is fetching product", error.message)
        res.status(500).json({success:false, message: "server error"})
    }
}

export const createProducts = async (req, res)=>{
    const product = req.body;

    if(!product.name || !product.price || !product.image){
        return res.status(400).json({success:false, message:"pls provide all fields"});
    }
    const newProduct = new Product(product);

    try {
        await newProduct.save();
        res.status(201).json({success:true, data:newProduct});
    } catch (error) {
        console.error("error in creating product", error.message);
        res.status(500).json({success:false, message:"server error"})
    }
}

export const deleteProduct = async(req, res)=>{
    const {id} = req.params;

    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(404).json({success:false, message:"invalid product id"})
    }

    try {
        const deletedProduct = await Product.findByIdAndDelete(id);
        if (!deletedProduct) {
            return res.status(404).json({ success: false, message: "Product not found" });
        }
        res.status(200).json({success:true, message:"product deleted"});
    } catch (error) {
        console.log("failed to delete product", error.message);
        res.status(500).json({success:false, message:"product not found"});
    }
}

export const updateProduct = async(req, res)=>{
    const {id} = req.params;
    const product = req.body;

    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(404).json({success:false, message:"invalid product id"})
    }
    try {
        const updatedProduct = await Product.findByIdAndUpdate(id, product, {new:true})
        res.status(200).json({success:true, data: updatedProduct});
    } catch (error) {
        res.status(500).json({success:false, message: "Server error"})
    }
}

