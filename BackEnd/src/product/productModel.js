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
    const { name, description, stock, price, image, } = product;
    const [result] = await pool.query(
        'INSERT INTO products (name, description, stock, price, image) VALUES (?, ?, ?, ?, ?)', [name, description, stock, price, image]
    );
    return result.insertId;
};

export const updateProduct = async(id, product) => {
    const { name, description, price, stock, image } = product;
    await pool.query(
        'UPDATE products SET name = ?, description = ?, stock = ?, price = ?, image = ? WHERE id = ?', [name, description, stock, price, image, id]
    );
};

export const deleteProductById = async(id) => {
    await pool.query('DELETE FROM products WHERE id = ?', [id]);
};

export const updateProductStock = async (productId, newStock) => {
    await pool.query('UPDATE products SET stock = ? WHERE id = ?', [newStock, productId]);
};