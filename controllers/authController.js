import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { User } from "../models/userModel.js";
import { RefreshToken } from "../models/authModel.js";
import { sequelize } from "../config/db.js";

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
    // Find the user by username
    const user = await User.findOne({ where: { username } });

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Compare the plain password with the hashed password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Create token payload
    const payload = {
      id: user.user_id,
      username: user.username,
      role: user.role,
    };

    const at = createAccessToken({ payload });
    const rt = createRefreshToken({ payload });

    await RefreshToken.create({
      token: rt,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      userId: user.id,
    });

    res.cookie("jid", rt, cookieOptions).json({ accessToken: at });
  } catch (err) {
    console.error("Login error:", err.message);
    return res.status(500).json({ message: "Server error" });
  }
};

// Registration Function
export const register = async (req, res) => {
  const { username, firstName, lastName, email, password, role } = req.body;

  try {
    // Check for duplicate username
    const existingUser = await User.findOne({ where: { username } });

    if (existingUser) {
      return res.status(400).json({ message: "Username already taken" });
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
      role: role || "user", // fallback if no role is provided
    });

    return res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    console.error("Registration error:", err.message);
    return res
      .status(500)
      .json({ message: "Registration failed", error: err.message });
  }
};

export const refreshToken = async (req, res) => {
  const oldToken = req.cookies.jid;
  if (!oldToken) return res.status(401).json({ ok: false, accessToken: "" });

  const row = await RefreshToken.findOne({
    where: {
      token: oldToken,
      expiresAt: { [sequelize.Op.gt]: new Date() },
    },
  });
  if (!row) return res.status(401).json({ ok: false, accessToken: "" });

  // revoke old RT
  await row.destroy();

  // issue new pair
  const user = await User.findByPk(row.userId);

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
    userId: user.id,
  });

  res
    .cookie("jid", newRt, cookieOptions)
    .json({ ok: true, accessToken: newAt });
};
