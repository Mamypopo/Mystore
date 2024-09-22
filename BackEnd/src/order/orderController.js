import { placeOrder, getOrderReceipt } from './orderModel.js';

export const handleOrder = async (req, res) => {
    const { userId, items } = req.body;
    
    // ตรวจสอบข้อมูลที่รับเข้ามา
    console.log('Received order:', { userId, items });
    
    try {
        const result = await placeOrder(userId, items);
        res.json({ message: 'Order placed successfully', orderId: result.orderId });
    } catch (error) {
        // แสดงข้อผิดพลาดเพื่อให้ทราบว่าเกิดปัญหาที่ไหน
        console.error('Error placing order:', error.message);
        res.status(500).json({ message: error.message });
    }
};


export const fetchOrderReceipt = async (req, res) => {
    try {
        const { orderId } = req.params;
        const receipt = await getOrderReceipt(orderId);
        res.status(200).json(receipt);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching receipt', error: error.message });
    }
};

export const getOrderSlip = async (req, res) => {
    const orderId = req.params.id; // รับ orderId จาก URL

    try {
        const order = await getOrderById(orderId);
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        const items = await getOrderItems(orderId);
        
        res.json({ order, items });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};