import pool from '../config/db.js';

export const getAllProducts = async () => {
    const [rows] = await pool.query('SELECT * FROM products');
    return rows;
};

export const getProductById = async (id) => {
    const [rows] = await pool.query('SELECT * FROM products WHERE product_id = ?', [id]);
    return rows[0];
};
