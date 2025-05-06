import { RefreshToken } from "./authModel.js";
import { User } from "./userModel.js";

export const associateModels = () => {
  RefreshToken.belongsTo(User, { foreignKey: "user_id", onDelete: "CASCADE" });
  User.hasMany(RefreshToken, { foreignKey: "user_id" });
};
