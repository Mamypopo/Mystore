import {
    getAllProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProductById,

} from './productModel.js';
import path from 'path';
import fs from 'fs';

export const getProducts = async(req, res) => {
    try {
        const products = await getAllProducts();
        res.json(products);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching products' });
    }
};

export const getProduct = async(req, res) => {
    try {
        const product = await getProductById(req.params.id);
        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }
        res.json(product);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching product' });
    }
};

export const addProduct = async(req, res) => {
    try {
        const { name, description, price, stock } = req.body;
        const image = req.file ? req.file.filename : null;

        if (!name || !description || !price || !stock) {
            return res.status(400).json({ error: 'Name, description, stock ,and price are required' });
        }

        const newProduct = { name, description, price, image, stock };
        const productId = await createProduct(newProduct);
        res.status(201).json({ id: productId });
    } catch (error) {
        res.status(500).json({ error: 'Error creating product' });
    }
};

export const editProduct = async(req, res) => {
    try {
        const { id } = req.params;
        const { name, description, price, stock } = req.body;
        const image = req.file ? req.file.filename : req.body.existingImage;

        const product = await getProductById(id);
        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }

        if (req.file && product.image) {
            const oldImagePath = path.join(path.resolve(), 'uploads', product.image);
            if (fs.existsSync(oldImagePath)) {
                fs.unlinkSync(oldImagePath);
            }
        }

        const updatedProduct = { name, description, stock, price, image };
        await updateProduct(id, updatedProduct);
        res.json({ message: 'Product updated successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Error updating product' });
    }
};

export const deleteProduct = async(req, res) => {
    try {
        const { id } = req.params;
        const product = await getProductById(id);

        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }

        // Remove the product image if it exists
        if (product.image) {
            const imagePath = path.join(path.resolve(), 'uploads', product.image);
            if (fs.existsSync(imagePath)) {
                fs.unlinkSync(imagePath);
            }
        }

        // Delete the product from the database
        await deleteProductById(id);
        res.json({ message: 'Product deleted successfully' });
    } catch (error) {
        console.error(error); // Log the error for debugging
        res.status(500).json({ error: 'Error deleting product' });
    }
};

export const getNewestProducts = async(req, res) => {
    try {
        const products = await getNewestProductsFromDB();
        res.status(200).json(products);
    } catch (error) {
        console.error('Error fetching newest products:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};