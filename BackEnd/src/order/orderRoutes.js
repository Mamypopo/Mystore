import express from 'express';
import { } from './orderModel.js';
import { handleOrder ,  getOrderDetails ,  getOrderHistory, fetchOrders, fetchUserOrders, modifyOrderStatus   } from './orderController.js';


const router = express.Router();

//เส้นสั่งซื้อ
router.post('/', handleOrder);
// ดึงข้อมูลคำสั่งซื้อ
router.get('/:orderId', getOrderDetails);
router.get('/history/:userId', getOrderHistory);

router.get('/', fetchOrders);  // Fetch all orders
router.get('/user/:id', fetchUserOrders);  // Fetch orders by user ID
router.patch('/', modifyOrderStatus);
export default router;