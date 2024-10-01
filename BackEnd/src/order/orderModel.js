import pool from '../database.js';

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


export const getOrderDetailsById = async (orderId) => {
    const [rows] = await pool.query('SELECT * FROM order_items WHERE order_id = ?', [orderId]);
    return rows; 
};


export const getOrdersByUserId = async (userId) => {
    const [orders] = await pool.query(`
        SELECT id, total_amount, created_at , status
        FROM orders
        WHERE user_id = ?
    `, [userId]);

    const orderDetails = await Promise.all(orders.map(async (order) => {
        const [items] = await pool.query(`
            SELECT oi.quantity, p.name, p.price, p.image 
            FROM order_items oi
            JOIN products p ON oi.product_id = p.id
            WHERE oi.order_id = ?
        `, [order.id]);
        
        return {
            ...order,
            items,
        };
    }));

    return orderDetails;
};

// export const getAllOrders = async () => {
//     try {
//       const [results] = await pool.query('SELECT * FROM orders ORDER BY created_at DESC');
//       return results;
//     } catch (err) {
//       console.error('Error fetching all orders:', err);
//       throw err; // ปล่อยข้อผิดพลาดเพื่อให้ controller จัดการ
//     }
//   };

export const getAllOrders = async () => {
    const [orders] = await pool.query(`
      SELECT o.id AS order_id, o.total_amount, o.created_at, 
             u.id AS user_id, u.username, u.email,  o.status
      FROM orders o
      JOIN users u ON o.user_id = u.id
    `);
    return orders;
  };


  export const updateOrderStatus = async (orderId, status) => {
    const [result] = await pool.query(`
      UPDATE orders SET status = ? WHERE id = ?
    `, [status, orderId]);
  
    return result;
  };
  
export const getOrderById = async (orderId) => {
    const [order] = await pool.query(`SELECT * FROM orders WHERE id = ?`, [orderId]);
    return order[0];
};