import sequelize from "./index";
import { DataTypes } from "sequelize";
import UserModel from "./user.model";

const DiscountModel = sequelize.define(
  "Discount",
  {
    code: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    value: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    user_id: {
      type: DataTypes.INTEGER, // người tạo
    },
    expirydate: {
      type: DataTypes.STRING,
      defaultValue: "",
    },
    status: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  { timestamps: true, freezeTableName: true }
);

UserModel.hasMany(DiscountModel, {
  foreignKey: { name: "user_id", allowNull: true },
});
DiscountModel.belongsTo(UserModel, {
  foreignKey: {
    name: "user_id",
    allowNull: true,
  },
});

DiscountModel.sync({ alter: true });
export default DiscountModel;

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
