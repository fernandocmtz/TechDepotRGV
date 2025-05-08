import { getAllUsers, getUserById } from "../models/userModel.js";
import { v4 as uuidv4 } from "uuid";
import { GUEST_USER } from "../utils/constants.js";
import { User } from "../models/userModel.js";

export const getUsers = async (req, res) => {
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
    },
  });

  return user;
};
