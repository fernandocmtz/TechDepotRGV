import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { User } from '../models/userModel.js'; // Ajusta la ruta si es necesario

// Login Function
export const login = async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ where: { username } });

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const payload = {
      id: user.user_id,
      username: user.username,
      role: user.role
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

    return res.json({ token });

  } catch (err) {
    console.error('Login error:', err.message);
    return res.status(500).json({ message: 'Server error' });
  }
};

// Registration Function
export const register = async (req, res) => {
  const { username, firstName, lastName, email, password, role } = req.body;

  try {
    const existingUser = await User.findOne({ where: { username } });

    if (existingUser) {
      return res.status(400).json({ message: 'Username already taken' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({
      username,
      email,
      password: hashedPassword,
      first_name: firstName,
      last_name: lastName,
      role: role || 'user'
    });

    return res.status(201).json({ message: 'User registered successfully' });

  } catch (err) {
    console.error('Registration error:', err.message);
    return res.status(500).json({ message: 'Registration failed', error: err.message });
  }
};

// Protected route
export const getProtected = async (req, res, next) => {
  try {
    res.json({ message: 'Welcome, authenticated user!', user: req.user });
  } catch (err) {
    next(err);
  }
};

// Admin-only route
export const getAdminOnly = async (req, res, next) => {
  try {
    res.json({ message: 'Welcome Admin!', user: req.user });
  } catch (err) {
    next(err);
  }
};
