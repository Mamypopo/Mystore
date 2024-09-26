import express from 'express';
import { } from './orderModel.js';
import { handleOrder ,  getOrderDetails ,  getOrderHistory,   } from './orderController.js';


const router = express.Router();

//เส้นสั่งซื้อ
router.post('/', handleOrder);
// ดึงข้อมูลคำสั่งซื้อ
router.get('/:orderId', getOrderDetails);
router.get('/history/:userId', getOrderHistory);

export default router;