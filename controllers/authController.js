import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { User } from '../models/userModel.js'; // Adjust the path if needed

// Login Function
export const login = async (req, res) => {
  const { username, password } = req.body;

  try {
    // Find the user by username
    const user = await User.findOne({ where: { username } });

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Compare the plain password with the hashed password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Create token payload
    const payload = {
      id: user.user_id,
      username: user.username,
      firstName: user.first_name,
      lastName: user.last_name,
      role: user.role
    };

    // Sign JWT token
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
    // Check for duplicate username
    const existingUser = await User.findOne({ where: { username } });

    if (existingUser) {
      return res.status(400).json({ message: 'Username already taken' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user with hashed password
    await User.create({
      username,
      email,
      password: hashedPassword,
      first_name: firstName,
      last_name: lastName,
      role: role || 'user' // fallback if no role is provided
    });

    return res.status(201).json({ message: 'User registered successfully' });

  } catch (err) {
    console.error('Registration error:', err.message);
    return res.status(500).json({ message: 'Registration failed', error: err.message });
  }
};

// Update User Profile Function
export const updateUser = async (req, res) => {
  const { email, phone_number } = req.body;

  try {
    const user = await User.findByPk(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.email = email ?? user.email;
    user.phone_number = phone_number ?? user.phone_number;

    await user.save();

    res.json({ message: 'Profile updated successfully', user });
  } catch (err) {
    console.error('Update error:', err);
    res.status(500).json({ message: 'Update failed', error: err.message });
  }
};




