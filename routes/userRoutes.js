import express from 'express';

const router = express.Router();

// Define your user routes here
router.get('/', (_, res) => {
    res.send('User route');
});

export default router;