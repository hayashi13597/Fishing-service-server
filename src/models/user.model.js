import Utils from "../utils";
import sequelize from "./index";
import { DataTypes } from "sequelize";
import NoticeModal from "./notice.model";
const UserModel = sequelize.define(
  "User",
  {
    email: {
      type: DataTypes.STRING,
      allowNull: true,

      validate: {
        isEmail: true,
      },
    },
    password: {
      type: DataTypes.STRING,
      defaultValue: "",
    },
    fullname: {
      type: DataTypes.STRING,
      defaultValue: "",
    },
    avatar: {
      type: DataTypes.STRING,
      defaultValue: "https://i.imgur.com/iOTWGLo.png",
    },

    address: {
      type: DataTypes.STRING,
      defaultValue: "",
    },
    phone: {
      type: DataTypes.STRING,
      defaultValue: "",
    },
    visiable: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    role: {
      type: DataTypes.STRING,
      defaultValue: "member",
    },
    uid: {
      type: DataTypes.STRING,
      defaultValue: "",
    },
    accessToken: {
      type: DataTypes.STRING,
    },
    refreshToken: {
      type: DataTypes.STRING,
    },
  },
  { timestamps: true, freezeTableName: true }
);

UserModel.sync({ alter: true });

export default UserModel;

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
