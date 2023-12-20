import sequelize from "./index";
import { DataTypes } from "sequelize";
import UserModel from "./user.model";
const NoticeModal = sequelize.define(
  "Notice",
  {
    user_id: {
      type: DataTypes.INTEGER,
    },
    title: {
      type: DataTypes.STRING,
      defaultValue: "",
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    receiver_id: {
      type: DataTypes.STRING,
      defaultValue: "all",
    },
    kind: {
      type: DataTypes.STRING,
      defaultValue: "1",
    },
    link: {
      type: DataTypes.STRING,
      defaultValue: "",
    },
    isSee: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },
  { timestamps: true, freezeTableName: true }
);

NoticeModal.sync({ alter: true });

export default NoticeModal;

//
//   id integer [primary key]
//   user_id integer // người tạo
//   title varchar
//   content varchar
//   receiver_id varhcar  // id người nhận, nếu all là gửi tât cả mọi người
//   kind number // 1 thông báo , 2 thông báo sự kiện, 3 tin tức
//   link varchar
//   isSee boolean
// }
