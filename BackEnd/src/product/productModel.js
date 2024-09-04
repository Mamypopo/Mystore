import pool from '../database.js';

export const getAllProducts = async() => {
    const [rows] = await pool.query('SELECT * FROM products');
    return rows;
};


export const getProductById = async(id) => {
    const [rows] = await pool.query('SELECT * FROM products WHERE id = ?', [id]);
    return rows[0];
};

export const createProduct = async(product) => {
    const { name, description, quantity, price, image, } = product;
    const [result] = await pool.query(
        'INSERT INTO products (name, description, quantity, price, image) VALUES (?, ?, ?, ?, ?)', [name, description, quantity, price, image]
    );
    return result.insertId;
};

export const updateProduct = async(id, product) => {
    const { name, description, price, quantity, image } = product;
    await pool.query(
        'UPDATE products SET name = ?, description = ?, quantity = ?, price = ?, image = ? WHERE id = ?', [name, description, quantity, price, image, id]
    );
};

export const deleteProductById = async(id) => {
    await pool.query('DELETE FROM products WHERE id = ?', [id]);
};