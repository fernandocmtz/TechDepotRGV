import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { User } from "../models/userModel.js";
import { RefreshToken } from "../models/authModel.js";
import { Op } from "sequelize";

function createAccessToken({ payload }) {
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "15m" });
}
function createRefreshToken({ payload }) {
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "7d" });
}

const cookieOptions = {
  httpOnly: true,
};

// Login Function
export const login = async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ where: { username } });

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const payload = {
      id: user.user_id,
      username: user.username,
      firstName: user.first_name,
      lastName: user.last_name,
      role: user.role,
    };

    const at = createAccessToken({ payload });
    const rt = createRefreshToken({ payload });

    await RefreshToken.create({
      token: rt,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      user_id: user.user_id,
    });

    res
      .cookie("jid", rt, cookieOptions)
      .json({ accessToken: at, role: user.role });
  } catch (err) {
    console.error("Login error:", err.message);
    return res.status(500).json({ message: "Server error" });
  }
};

// Registration Function
export const register = async (req, res) => {
  const { username, firstName, lastName, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ where: { username } });

    if (existingUser) {
      return res.status(400).json({ message: "Username already taken" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({
      username,
      email,
      password: hashedPassword,
      first_name: firstName,
      last_name: lastName,
      role: "user",
    });

    return res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    console.error("Registration error:", err.message);
    return res
      .status(500)
      .json({ message: "Registration failed", error: err.message });
  }
};

// Update User Profile Function
export const updateUser = async (req, res) => {
  const { email, phone_number } = req.body;

  try {
    const user = await User.findByPk(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.email = email ?? user.email;
    user.phone_number = phone_number ?? user.phone_number;

    await user.save();

    res.json({ message: "Profile updated successfully", user });
  } catch (err) {
    console.error("Update error:", err);
    res.status(500).json({ message: "Update failed", error: err.message });
  }
};

export const refreshToken = async (req, res) => {
  const oldToken = req.cookies.jid;
  if (!oldToken) return res.status(401).json({ ok: false, accessToken: "" });

  const row = await RefreshToken.findOne({
    where: {
      token: oldToken,
      expiresAt: { [Op.gt]: new Date() },
    },
  });
  if (!row) return res.status(401).json({ ok: false, accessToken: "" });

  // revoke old RT
  await row.destroy();

  // issue new pair
  const user = await User.findByPk(row.user_id);

  const payload = {
    id: user.user_id,
    username: user.username,
    role: user.role,
  };

  const newAt = createAccessToken({ payload });
  const newRt = createRefreshToken({ payload });
  await RefreshToken.create({
    token: newRt,
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    user_id: user.user_id,
  });

  res
    .cookie("jid", newRt, cookieOptions)
    .json({ ok: true, accessToken: newAt, role: user.role });
};

export const logout = async (req, res) => {
  const token = req.cookies.jid;
  if (token) {
    await RefreshToken.destroy({ where: { token } });
  }
  res.clearCookie("jid", cookieOptions).json({ ok: true });
};

// Protected route
export const getProtected = async (req, res, next) => {
  try {
    res.json({ message: "Welcome, authenticated user!", user: req.user });
  } catch (err) {
    next(err);
  }
};

// Admin-only route
export const getAdminOnly = async (req, res, next) => {
  try {
    res.json({ message: "Welcome Admin!", user: req.user });
  } catch (err) {
    next(err);
  }
};
