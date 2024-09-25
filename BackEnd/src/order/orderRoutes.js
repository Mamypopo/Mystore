import express from 'express';
import { } from './orderModel.js';
import { handleOrder ,  getOrderDetails ,  getOrderHistory,   } from './orderController.js';


const router = express.Router();

//เส้นสั่งซื้อ
router.post('/orders', handleOrder);
// ดึงข้อมูลคำสั่งซื้อ
router.get('/:orderId', getOrderDetails);
router.get('/history/:userId', getOrderHistory); // เส้นทางที่ถูกต้อง

export default router;