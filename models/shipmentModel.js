import pool from '../config/db.js';

export const addShipment = async (orderId, courier, trackingNumber, status) => {
    const [result] = await pool.query(
        'INSERT INTO shipments (order_id, courier, tracking_number, status) VALUES (?, ?, ?, ?)',
        [orderId, courier, trackingNumber, status]
    );
    return result.insertId;
};
