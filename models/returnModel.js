import pool from '../config/db.js';

export const processReturn = async (orderItemId, reason, status) => {
    const [result] = await pool.query(
        'INSERT INTO returns (order_item_id, reason, status) VALUES (?, ?, ?)',
        [orderItemId, reason, status]
    );
    return result.insertId;
};
