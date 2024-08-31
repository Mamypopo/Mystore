import pool from '../database.js';

export const createOrder = async (userId, items) => {
  // Create the order
  const [result] = await pool.query(`INSERT INTO orders (user_id, created_at) VALUES (?, NOW())`, [userId]);
  const orderId = result.insertId;

  // Insert order items
  for (const item of items) {
    await pool.query(
      `INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)`,
      [orderId, item.product_id, item.quantity, item.product_price]
    );
  }
};