import sequelize from "./index";
import { DataTypes } from "sequelize";
import UserModel from "./user.model";
import ProductModal from "./product.model";
import OrderModal from "./order.model";

const ReviewModal = sequelize.define(
  "Review",
  {
    content: {
      type: DataTypes.TEXT,
      defaultValue: "",
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
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 5,
    },
    user_id: {
      type: DataTypes.INTEGER,
    },
    product_id: {
      type: DataTypes.INTEGER,
    },
    order_id: {
      type: DataTypes.INTEGER,
    },
    quantity: {
      type: DataTypes.INTEGER,
      defaultValue: 1,
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

OrderModal.hasMany(ReviewModal, {
  foreignKey: { name: "order_id", allowNull: true },
});

ReviewModal.belongsTo(UserModel, {
  foreignKey: { name: "user_id", allowNull: true },
});

ReviewModal.belongsTo(ProductModal, {
  foreignKey: { name: "product_id", allowNull: true },
});
ReviewModal.belongsTo(OrderModal, {
  foreignKey: { name: "order_id", allowNull: true },
});

ReviewModal.sync({ alter: true });
export default ReviewModal;
