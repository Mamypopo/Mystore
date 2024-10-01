import nodemailer from 'nodemailer';
import { getUserEmail } from '../user/userModel.js'; // ฟังก์ชันดึงอีเมลผู้ใช้
import * as orderModel from './orderModel.js';
import { getProductById } from '../product/productModel.js'


export const handleOrder = async (req, res) => {
    const { userId, items } = req.body;
   
    try {
        // คำนวณ totalAmount
        let totalAmount = 0;
        // let totalAmount = items.reduce((total, item) => total + (item.price * item.quantity), 0);
        for (const item of items) {
            const product = await getProductById(item.product_id); // ดึงราคาสินค้า
            if (product) { // ตรวจสอบว่าพบสินค้า
                totalAmount += product.price * item.quantity; // คำนวณ totalAmount
            } else {
                console.error(`Product with ID ${item.product_id} not found.`);
            }
        }

         // สร้างคำสั่งซื้อ  // บันทึกใบเสร็จ
        const result = await orderModel.placeOrder(userId, items, totalAmount);

        console.log('Total Amount before sending email:', totalAmount); // ตรวจสอบค่าที่นี่
         // ส่งอีเมลใบเสร็จ
        const userEmail = await getUserEmail(userId);
        if (!userEmail) {
            return res.status(400).json({ message: 'User email not found' });
        }
        console.log('User email:', userEmail);
        // ส่งอีเมล
        await sendReceipt(userEmail, { userId, result, items, totalAmount });

        res.json({ message: 'Order placed successfully', orderId: result });
    } catch (error) {
        
        console.error('Error placing order:', error.message);
        res.status(500).json({ message: error.message });
    }
};




// ฟังก์ชันส่งอีเมล
export const sendReceipt = async (email, orderDetails) => {
    const transporter = nodemailer.createTransport({
        service: 'Gmail', 
        auth: {
            user: 'l5odyjeff@gmail.com', // อีเมล
            pass: process.env.EMAIL_PASSWORD // รหัสผ่านของอีเมลจาก .env
        }
    });


    const itemsWithNames = await Promise.all(orderDetails.items.map(async (item) => {
        const product = await getProductById(item.product_id);
        return {
            name: product.name, // ชื่อสินค้า
            quantity: item.quantity
        };
    }));
    const totalAmount = orderDetails.totalAmount; // รับค่าจาก orderDetails
    const mailOptions = {
        from: 'l5odyjeff@gmail.com',
        to: email,
        subject: 'ใบเสร็จคำสั่งซื้อ',
        html: `
            <h2>ขอบคุณสำหรับการสั่งซื้อ!</h2>
            <p>รายละเอียดคำสั่งซื้อ:</p>
            <ul>
                ${itemsWithNames.map(item => `
                    <li>${item.name} - จำนวน: ${item.quantity} ชิ้น</li>
                `).join('')}
            </ul>
            <p><strong>ยอดรวมทั้งหมด: ${totalAmount} บาท</strong></p>
            <p>ขอขอบคุณที่ใช้บริการของเรา!</p>
        `
    };
    
    try {
        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent: ' + info.response);
    } catch (error) {
        console.error('Error sending email:', error);
    }
};


export const getOrderDetails = async (req, res) => {
    const orderId = req.params.orderId; // ดึง orderId จาก URL

    try {
        const orderDetails = await orderModel.getOrderDetailsById(orderId);
        res.json(orderDetails); // ส่งกลับรายละเอียดคำสั่งซื้อ
    } catch (error) {
        console.error('Error fetching order details:', error.message);
        res.status(500).json({ message: error.message });
    }
};


export const getOrderHistory = async (req, res) => {
    const userId = req.params.userId;

    try {
        const orders = await orderModel.getOrdersByUserId(userId);
        res.json(orders);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error retrieving orders by user ID', error: error.message });
    }
};


export const fetchOrders = async (req, res) => {
    try {
      const orders = await orderModel.getAllOrders();
      res.json(orders);
    } catch (error) {
      console.error('Error fetching orders:', error);
      res.status(500).json({ message: 'Error retrieving orders', error: error.message });
    }
  };

  export const fetchUserOrders = async (req, res) => {
    const userId = req.params.id;
    try {
      const orders = await orderModel.getOrdersByUserId(userId);
      res.json(orders);
    } catch (error) {
      console.error('Error fetching user orders:', error);
      res.status(500).json({ error: 'Failed to fetch user orders' });
    }
  };


  export const modifyOrderStatus = async (req, res) => {
    const { orderId, status } = req.body;
    try {
      const success = await orderModel.updateOrderStatus(orderId, status);
      if (success) {
        res.status(200).json({ message: 'Order status updated successfully' });
      } else {
        res.status(404).json({ message: 'Order not found' });
      }
    } catch (error) {
      console.error('Error updating order status:', error);
      res.status(500).json({ message: 'Error updating order status' });
    }
  };