import sequelize from "./index";
import { DataTypes } from "sequelize";
import UserModel from "./user.model";

const CategoryModal = sequelize.define(
  "Category",
  {
    name: {
      type: DataTypes.STRING,
    },
    description: {
      type: DataTypes.STRING,
    },
    imageUrl: {
      type: DataTypes.STRING,
    },
    idPath: {
      type: DataTypes.STRING,
      defaultValue: "",
    },
    slug: {
      type: DataTypes.STRING,
      defaultValue: "",
    },
    user_id: {
      type: DataTypes.INTEGER,
    },
    visiable: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },
  { timestamps: true, freezeTableName: true }
);
UserModel.hasMany(CategoryModal, { foreignKey: "user_id", targetKey: "id" });
CategoryModal.belongsTo(UserModel, {
  foreignKey: "user_id",
});
CategoryModal.sync({ alter: true });

export default CategoryModal;

//   id integer [primary key]
//   name varchar
//   description varchar
//   image varchar
//   filter category_filter
//   slug varchar
//   visiable bool
//   createdAt datetiem
//   updatedAt dateime
//
//   category_filter /rod là cần câu, bait là mồi câu,food là món nhậu, drink đồ uống

//
//
