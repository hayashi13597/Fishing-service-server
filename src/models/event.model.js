import sequelize from "./index";
import { DataTypes } from "sequelize";
import UserModel from "./user.model";

const EventModal = sequelize.define(
  "Event",
  {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    isEvent: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    timeEvent: {
      type: DataTypes.INTEGER,
      defaultValue: 7,
    },
    description: {
      type: DataTypes.TEXT,
      defaultValue: "",
      allowNull: false,
    },
    imageUrl: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    idPath: {
      type: DataTypes.STRING,
      defaultValue: "",
    },
    slug: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    time_end: {
      type: DataTypes.STRING,
      defaultValue: 0,
    },
    views: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
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
UserModel.hasMany(EventModal, {
  foreignKey: {
    name: "user_id",
    allowNull: false,
  },
});
EventModal.belongsTo(UserModel, {
  foreignKey: {
    name: "user_id",
    allowNull: false,
  },
});
EventModal.sync({ alter: true });
export default EventModal;

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
