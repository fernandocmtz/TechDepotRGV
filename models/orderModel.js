import pool from '../config/db.js';

export const createOrder = async (userId, addressId, status) => {
    const [result] = await pool.query(
        'INSERT INTO orders (user_id, address_id, status) VALUES (?, ?, ?)',
        [userId, addressId, status]
    );
    return result.insertId;
};
