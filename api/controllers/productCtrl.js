const Products = require('../models/productModel')

const productCtrl = {
    createProduct: async (req, res) => {
        try {
            const {
                title, description, price, location, category, phone, image, user
            } = req.body
            console.log({title, description, price, location, category, phone, image, user})
            if(!title || !description || !price || !location || !category || !phone)
                return res.status(400).json({msg: "Please fill in all fields."})
            if(image.length === 0)
                return res.status(400).json({msg: "Please upload image."})    
            if(title.length < 5)
                return res.status(400).json({msg: "Title must be at least 5 characters."})
            if(description.length < 10)
                return res.status(400).json({msg: "Descirption must be at least 10 characters."})
            if(price<0)
                return res.status(400).json({msg: "Price must be positive number"})
            
            const newProduct = new Products({
                title, description, price, location, category, phone, image, user
            })

            await newProduct.save()

            res.json({msg: "Product has been created!"})        

        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },

    getProducts: async (req, res) => {
        try{
            const products = await Products.find()
            res.json(products)
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },

    updateProduct: async (req, res) => {
        try {
            const {
                title, description, price, location, category, phone,isArchived , image
            } = req.body
            await Products.findOneAndUpdate({_id: req.params.id}, {
                title, description, price, location, category, phone,isArchived, image
            })

            res.json({msg: "Product Updated Successfully!"})
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },

    getProduct: async (req, res) => {
        try {
            const product = await Products.findById(req.params.id)
            res.json(product)
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },

    deleteProduct: async (req, res) => {
        try {
            await Products.findByIdAndDelete({_id: req.params.id})
            res.json({msg: "Deleted Successfully!"})
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },

    archiveProduct: async (req, res) => {
        try {
            const {isArchived} = req.body

            await Products.findOneAndUpdate({_id: req.params.id}, {
                isArchived
            })

            res.json({msg: "Update Success!"})
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    }
}

module.exports = productCtrl