import pool from '../database.js';

// ดึงข้อมูลคำสั่งซื้อทั้งหมด
export const getOrders = async (req, res) => {
    try {
        const [orders] = await pool.query(`SELECT * FROM orders`);
        return res.status(200).json(orders);
    } catch (error) {
        return res.status(500).json({ message: "Failed to fetch orders" });
    }
};

// ดึงรายละเอียดคำสั่งซื้อ
export const getOrderDetails = async (req, res) => {
    const { orderId } = req.params;
    try {
        const [orderItems] = await pool.query(
            `SELECT oi.product_id, oi.quantity, oi.price, p.name 
             FROM order_items oi 
             JOIN products p ON oi.product_id = p.id 
             WHERE oi.order_id = ?`, [orderId]
        );
        const [order] = await pool.query(`SELECT total_price FROM orders WHERE id = ?`, [orderId]);

        return res.status(200).json({ items: orderItems, totalPrice: order[0].total_price });
    } catch (error) {
        return res.status(500).json({ message: "Failed to fetch order details" });
    }
};


export const getOrderById = async (orderId) => {
    const [orderDetails] = await pool.query(`SELECT * FROM orders WHERE id = ?`, [orderId]);
    return orderDetails.length > 0 ? orderDetails[0] : null;
};

export const getOrderItems = async (orderId) => {
    const [orderItems] = await pool.query(`SELECT * FROM order_items WHERE order_id = ?`, [orderId]);
    return orderItems;
};




export const getOrderReceipt = async (orderId) => {
    const [order] = await pool.query(
        `SELECT o.id AS orderId, o.total_amount, oi.product_id, oi.quantity, p.name AS product_name, p.price
         FROM orders o
         JOIN order_items oi ON o.id = oi.order_id
         JOIN products p ON oi.product_id = p.id
         WHERE o.id = ?`, [orderId]
    );

    return order;
};
export const placeOrder = async (userId, items) => {
    // คำนวณ totalAmount
    let totalAmount = 0;
    
    for (const item of items) {
        const [product] = await pool.query(`SELECT price FROM products WHERE id = ?`, [item.product_id]);
        if (product.length === 0) {
            throw new Error(`Product not found for id: ${item.product_id}`);
        }
        const price = product[0].price; // ตรวจสอบว่ามีราคาอยู่หรือไม่
        totalAmount += price * item.quantity; // คำนวณ totalAmount
    }

    // บันทึกคำสั่งซื้อ
    const [orderResult] = await pool.query(`INSERT INTO orders (user_id, total_amount) VALUES (?, ?)`, [userId, totalAmount]);
    const orderId = orderResult.insertId;

    // บันทึกรายการในคำสั่งซื้อและลดสต็อกสินค้า
    for (const item of items) {
        // ดึงราคาสินค้าอีกครั้ง
        const [product] = await pool.query(`SELECT price FROM products WHERE id = ?`, [item.product_id]);
        const price = product[0].price;

        // บันทึกรายการคำสั่งซื้อ
        await pool.query(`INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)`, [orderId, item.product_id, item.quantity, price]);
        
        // ลดสต็อกสินค้า
        await pool.query(`UPDATE products SET stock = stock - ? WHERE id = ?`, [item.quantity, item.product_id]);
    }

    // เคลียร์ตระกร้าสินค้าของผู้ใช้
    await pool.query(`DELETE FROM cart_items WHERE cart_id = (SELECT id FROM carts WHERE user_id = ?)`, [userId]);

    return orderId;
};