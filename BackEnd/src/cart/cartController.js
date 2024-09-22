import {
    addItemToCart,
    removeItemFromCart,
    getCartItems,
    
} from './cartModel.js';
import { getProductById } from '../product/productModel.js';

export const addProductToCart = async(req, res) => {
    const { userId, productId, quantity } = req.body;

    if (!userId || !productId || !quantity) {
        return res.status(400).json({ error: 'User ID, Product ID, and Quantity are required' });
    }

    try {
        const product = await getProductById(productId);

        // ตรวจสอบว่าสินค้ามี stock เพียงพอหรือไม่
        if (product.stock < quantity) {
            return res.status(400).json({ message: 'Not enough stock available' });
        }

        // // คำนวณ stock ใหม่หลังจากหักสินค้าที่ถูกเพิ่มลงในตะกร้า
        // const newStock = product.stock - quantity;

        // // อัปเดต stock สินค้าในฐานข้อมูล
        // await updateProductStock(productId, newStock);
        // const status = newStock === 0 ? 'Sold Out' : 'In Stock';
        await addItemToCart(userId, productId, quantity);
     
        res.status(200).json({ message: 'Product added to cart successfully'});
    } catch (error) {
        res.status(500).json({ message: 'Error adding product to cart', error: error.message });
    }
   
};

export const removeProductFromCart = async(req, res) => {
    const { userId, productId } = req.params;
    try {
        await removeItemFromCart(userId, productId);

        res.status(200).json({ message: 'Item removed from cart successfully' });
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: 'Error removing item from cart' });
    }
};

export const getCartItemsForUser = async(req, res) => {
    const { userId } = req.params;

    if (!userId) {
        return res.status(400).json({ error: 'User ID is required' });
    }

    try {
        const items = await getCartItems(userId);
        res.status(200).json(items);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
};