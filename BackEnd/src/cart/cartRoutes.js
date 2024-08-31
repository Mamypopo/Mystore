import express from 'express';
import {
  addProductToCart,
  removeProductFromCart,
  getCartItemsForUser,
  checkoutCart,
  decreaseProductQuantity 
} from './cartController.js';

const router = express.Router();

router.post('/add',  addProductToCart);
router.post('/remove',  removeProductFromCart);
router.get('/:userId', getCartItemsForUser);
router.post('/checkout', checkoutCart);
router.patch('/decrease', decreaseProductQuantity);

export default router;