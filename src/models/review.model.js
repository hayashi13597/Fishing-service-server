import sequelize from "./index";
import { DataTypes } from "sequelize";
import UserModel from "./user.model";
import ProductModal from "./product.model";

const ReviewModal = sequelize.define(
  "Review",
  {
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    listImage: {
      type: DataTypes.TEXT,
      defaultValue: "",
    },
    status: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    star: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    user_id: {
      type: DataTypes.INTEGER,
    },
    product_id: {
      type: DataTypes.INTEGER,
    },
  },
  { timestamps: true, freezeTableName: true }
);

UserModel.hasMany(ReviewModal, {
  foreignKey: { name: "user_id", allowNull: true },
});
ProductModal.hasMany(ReviewModal, {
  foreignKey: { name: "product_id", allowNull: true },
});

ReviewModal.belongsTo(UserModel, {
  foreignKey: { name: "user_id", allowNull: true },
});

ReviewModal.belongsTo(ProductModal, {
  foreignKey: { name: "product_id", allowNull: true },
});

ReviewModal.sync({ alter: true });
export default ReviewModal;
