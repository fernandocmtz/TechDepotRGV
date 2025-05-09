import { getAllUsers, getUserById } from "../models/userModel.js";
import { v4 as uuidv4 } from "uuid";
import { GUEST_USER } from "../utils/constants.js";
import { User } from "../models/userModel.js";
import { Op } from "sequelize";

export const getUsers = async (req, res) => {
  try {
    const users = await getAllUsers();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getNonGuestUsers = async (req, res) => {
  try {
    const users = await getAllUsers();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getActiveUser = async (req, res) => {
  try {
    const userId = req.user?.id ?? null;

    const user = await getUserById(userId);
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const patchActiveUser = async (req, res) => {
  try {
    const userId = req.user?.id ?? null;

    const { email, phone_number } = req.body;

    const user = await User.findByPk(userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    if (email !== undefined) user.email = email;
    if (phone_number !== undefined) user.phone_number = phone_number;

    await user.save();
    const safeUser = user.toJSON();
    delete safeUser.password;

    res.json(safeUser);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const patchUserRole = async (req, res) => {
  const userId = parseInt(req.params.id);
  const { role } = req.body;

  if (!["admin", "user"].includes(role)) {
    return res.status(400).json({ error: "Invalid role" });
  }

  try {
    const user = await User.findByPk(userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    // If demoting admin to user, check if they're the last admin
    if (user.role === "admin" && role === "user") {
      const adminCount = await User.count({
        where: {
          role: "admin",
          user_id: { [Op.ne]: userId },
        },
      });

      if (adminCount === 0) {
        return res
          .status(400)
          .json({ error: "At least one admin must remain" });
      }
    }

    user.role = role;
    await user.save();

    res.json({ message: "User role updated", user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const utilFindOrCreateUserByUserId = async (user_id) => {
  const [user] = await User.findOrCreate({
    where: { user_id },
    defaults: {
      username: uuidv4(),
      first_name: GUEST_USER.FIRST_NAME,
      last_name: GUEST_USER.LAST_NAME,
      email: GUEST_USER.EMAIL,
      phone_number: GUEST_USER.PHONE_NUMBER,
      password: GUEST_USER.PASSWORD,
      role: GUEST_USER.ROLE,
    },
  });

  return user;
};
