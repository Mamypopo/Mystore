import  pool  from '../database.js';

export const getAllProducts = async () => {
  const [rows] = await pool.query('SELECT * FROM products');
  return rows;
};


export const getProductById = async (id) => {
  const [rows] = await pool.query('SELECT * FROM products WHERE id = ?', [id]);
  return rows[0];
};

export const createProduct = async (product) => {
  const { name, description, price, image } = product;
  const [result] = await pool.query(
    'INSERT INTO products (name, description, price, image) VALUES (?, ?, ?, ?)',
    [name, description, price, image]
  );
  return result.insertId;
};

export const updateProduct = async (id, product) => {
  const { name, description, price, image } = product;
  await pool.query(
    'UPDATE products SET name = ?, description = ?, price = ?, image = ? WHERE id = ?',
    [name, description, price, image, id]
  );
};

// Function to delete a product by ID
export const deleteProductById = async (id) => {
  await pool.query('DELETE FROM products WHERE id = ?', [id]);
};

export const getNewestProductsFromDB = async () => {
  const query = `
    SELECT id, name, price, image
    FROM products
    ORDER BY created_at DESC
    LIMIT 10;
  `;

  const [rows] = await db.execute(query);
  return rows;
};