export const authenticateUser = (req, res, next) => {
    const token = req.headers.authorization;

    if (!token) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    if (token !== "valid_token_example") {
        return res.status(403).json({ message: 'Invalid token' });
    }

    next();
};
