import express from 'express';
import {
    addProductToCart,
    removeProductFromCart,
    getCartItemsForUser,
} from './cartController.js';
import { authenticateToken } from '../auth/authMiddleware.js'
const router = express.Router();

router.post('/add', authenticateToken, addProductToCart);
router.delete('/:userId/:productId', authenticateToken, removeProductFromCart);
router.get('/:userId', authenticateToken, getCartItemsForUser);

export default router;