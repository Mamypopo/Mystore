import {
    addItemToCart,
    removeItemFromCart,
    getCartItems,
} from './cartModel.js';

export const addProductToCart = async(req, res) => {
    const { userId, productId, quantity } = req.body;

    if (!userId || !productId || !quantity) {
        return res.status(400).json({ error: 'User ID, Product ID, and Quantity are required' });
    }

    try {
        await addItemToCart(userId, productId, quantity);
        res.status(200).json({ message: 'Item added to cart' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
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