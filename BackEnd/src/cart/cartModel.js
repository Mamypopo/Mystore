import pool from '../database.js';

export const addItemToCart = async (userId, productId, quantity) => {
  const [cart] = await pool.query(`SELECT id FROM carts WHERE user_id = ?`, [userId]);

  let cartId;
  if (cart.length === 0) {
    const [result] = await pool.query(`INSERT INTO carts (user_id) VALUES (?)`, [userId]);
    cartId = result.insertId;
  } else {
    cartId = cart[0].id;
  }

  const [existingItem] = await pool.query(
    `SELECT * FROM cart_items WHERE cart_id = ? AND product_id = ?`,
    [cartId, productId]
  );

  if (existingItem.length > 0) {
    await pool.query(
      `UPDATE cart_items SET quantity = quantity + ? WHERE cart_id = ? AND product_id = ?`,
      [quantity, cartId, productId]
    );
  } else {
    await pool.query(
      `INSERT INTO cart_items (cart_id, product_id, quantity) VALUES (?, ?, ?)`,
      [cartId, productId, quantity]
    );
  }
};

export const removeItemFromCart = async (userId, productId) => {
  const [cart] = await pool.query(`SELECT id FROM carts WHERE user_id = ?`, [userId]);

  if (cart.length > 0) {
    const cartId = cart[0].id;
    await pool.query(`DELETE FROM cart_items WHERE cart_id = ? AND product_id = ?`, [cartId, productId]);
  }
};

export const getCartItems = async (userId) => {
  const [cart] = await pool.query(`SELECT id FROM carts WHERE user_id = ?`, [userId]);

  if (cart.length === 0) return [];

  const cartId = cart[0].id;

  const [items] = await pool.query(
    `SELECT ci.quantity, p.id as product_id, p.name as product_name, p.price as product_price, p.image
     FROM cart_items ci
     JOIN products p ON ci.product_id = p.id
     WHERE ci.cart_id = ?`,
    [cartId]
  );

  return items;
};

export const clearCart = async (userId) => {
  const [cart] = await pool.query(`SELECT id FROM carts WHERE user_id = ?`, [userId]);

  if (cart.length > 0) {
    const cartId = cart[0].id;
    await pool.query(`DELETE FROM cart_items WHERE cart_id = ?`, [cartId]);
  }
};

export const decreaseItemQuantity = async (userId, productId) => {
  const selectSql = 'SELECT quantity FROM cart_items WHERE user_id = ? AND product_id = ?';
  const [rows] = await db.query(selectSql, [userId, productId]);

  if (rows.length === 0) {
    return { affectedRows: 0 };
  }

  const newQuantity = rows[0].quantity - 1;

  if (newQuantity > 0) {
    const updateSql = 'UPDATE cart_items SET quantity = ? WHERE user_id = ? AND product_id = ?';
    await db.query(updateSql, [newQuantity, userId, productId]);
    return { affectedRows: 1, newQuantity };
  } else {
    return { affectedRows: 0, newQuantity: 0 };
  }
};