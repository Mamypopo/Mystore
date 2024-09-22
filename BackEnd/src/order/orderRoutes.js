import express from 'express';
import { getOrders, getOrderDetails , } from './orderModel.js';
import { handleOrder ,getOrderSlip, fetchOrderReceipt  } from './orderController.js';


const router = express.Router();


// Order Routes
router.get('/orders', getOrders);
router.get('/orders/:orderId', getOrderDetails);
router.post('/orders', handleOrder);
router.get('/orders/:id/slip', getOrderSlip);
router.get('/orders/:orderId/receipt', fetchOrderReceipt);

export default router;