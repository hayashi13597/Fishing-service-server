import sequelize from "./index";
import { DataTypes } from "sequelize";
import UserModel from "./user.model";
import casual from "casual";
const DiscountModel = sequelize.define(
  "Discount",
  {
    code: {
      type: DataTypes.STRING,
      defaultValue: `${casual.unix_time}`,
    },
    value: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    user_id: {
      type: DataTypes.INTEGER, // người tạo
      references: {
        model: "user",
        key: "id",
      },
    },

    status: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  { timestamps: true, freezeTableName: true }
);

UserModel.hasMany(DiscountModel, { foreignKey: "user_id", targetKey: "id" });
DiscountModel.belongsTo(UserModel, {
  foreignKey: "user_id",
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
