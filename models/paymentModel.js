import pool from '../config/db.js';

export const addPayment = async (orderId, amount, method, status) => {
    const [result] = await pool.query(
        'INSERT INTO payments (order_id, amount, method, status) VALUES (?, ?, ?, ?)',
        [orderId, amount, method, status]
    );
    return result.insertId;
};
