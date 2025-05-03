import jwt from 'jsonwebtoken';

export const login = async (req, res) => {
    const { username, password } = req.body;

    if (username === 'user' && password === 'password') {
        const payload = {
            username,
            role: 'admin' // replace with actual user role later
        };

        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
        return res.json({ token });
    }

    return res.status(401).json({ message: 'Invalid credentials' });
};


