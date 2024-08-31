import {
  addItemToCart,
  removeItemFromCart,
  getCartItems,
  clearCart,
  decreaseItemQuantity 
} from './cartModel.js';
import { createOrder } from '../order/orderModel.js';

export const addProductToCart = async (req, res) => {
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

export const removeProductFromCart = async (req, res) => {
  const { userId, productId } = req.body;

  if (!userId || !productId) {
    return res.status(400).json({ error: 'User ID and Product ID are required' });
  }

  try {
    await removeItemFromCart(userId, productId);
    res.status(200).json({ message: 'Item removed from cart' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getCartItemsForUser = async (req, res) => {
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

export const checkoutCart = async (req, res) => {
  const { userId } = req.body;

  if (!userId) {
    return res.status(400).json({ error: 'User ID is required' });
  }

  try {
    const items = await getCartItems(userId);

    if (items.length === 0) {
      return res.status(400).json({ error: 'Cart is empty' });
    }

    await createOrder(userId, items);
    await clearCart(userId);

    res.status(200).json({ message: 'Order placed successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const decreaseProductQuantity = async (req, res) => {
  const { userId, productId } = req.body;

  if (!userId || !productId) {
    return res.status(400).json({ error: 'User ID and Product ID are required' });
  }

  try {
    const item = await decreaseItemQuantity(userId, productId);

    if (item.affectedRows === 0) {
      return res.status(404).json({ error: 'Item not found in cart' });
    }

    if (item.newQuantity === 0) {
      await removeItemFromCart(userId, productId);
      return res.status(200).json({ message: 'Item removed from cart' });
    }

    res.status(200).json({ message: 'Item quantity decreased', newQuantity: item.newQuantity });
  } catch (error) {
    console.error('Error decreasing item quantity:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};