import Utils from "../utils";
import DiscountModel from "./discount.model";
import sequelize from "./index";
import { DataTypes } from "sequelize";
import OrderDetailModal from "./orderDetail.modal";
import casual from "casual";
import UserModel from "./user.model";

const OrderModal = sequelize.define(
  "Order",
  {
    email: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        isEmail: true,
      },
    },
    codebill: {
      type: DataTypes.STRING,
      defaultValue: `${casual.unix_time}`,
    },
    fullname: {
      type: DataTypes.STRING,
      allowNull: false,
      trim: true,
    },
    address: {
      type: DataTypes.STRING,
      allowNull: false,
      trim: true,
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: false,
      trim: true,
    },
    shipment: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    paymentMethod: {
      type: DataTypes.STRING, // phương thức thanh toán cod internet banking
      allowNull: false,
      trim: true,
    },
    status: {
      type: DataTypes.STRING,
      defaultValue: "s1",
    },
    user_id: {
      type: DataTypes.INTEGER,
    },
    discount_id: {
      type: DataTypes.INTEGER,
      defaultValue: null,
    },
  },
  { timestamps: true, freezeTableName: true }
);

OrderModal.belongsTo(DiscountModel, {
  foreignKey: { name: "discount_id", allowNull: true },
});
OrderModal.belongsTo(UserModel, {
  foreignKey: { name: "user_id", allowNull: true },
});

OrderModal.sync({ alter: true });
export default OrderModal;

// id integer [primary key]
// username varchar
// role permission
// fullname varchar
// avatar varchar
// address varchar
// email varchar
// password varchar
// accessToken varchar
// refreshToken varchar
// visiable bool
// uid varchar
