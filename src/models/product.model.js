import CategoryModal from "./cate.model";
import sequelize from "./index";
import { DataTypes } from "sequelize";
import UserModel from "./user.model";

const ProductModal = sequelize.define(
  "Product",
  {
    name: {
      type: DataTypes.STRING,
      required: true,
    },
    slug: {
      type: DataTypes.STRING,
    },

    price: {
      type: DataTypes.BIGINT,
      defaultValue: 0,
    },
    description: {
      type: DataTypes.TEXT,
      required: true,
    },
    content: {
      type: DataTypes.TEXT,
      required: true,
    },
    imageUrl: {
      type: DataTypes.STRING,
    },
    idPath: {
      type: DataTypes.STRING,
      defaultValue: "",
    },
    listSubimages: {
      type: DataTypes.TEXT,
      defaultValue: "",
    },
    visiable: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    view: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    sales: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    stars: {
      type: DataTypes.FLOAT,
      defaultValue: 5,
    },
    sale_off: {
      type: DataTypes.FLOAT, // giảm giá
      defaultValue: 0,
    },

    user_id: {
      type: DataTypes.INTEGER,
    },
    category_id: {
      type: DataTypes.INTEGER,
    },
  },
  { timestamps: true, freezeTableName: true }
);

UserModel.hasMany(ProductModal, {
  foreignKey: { name: "user_id", allowNull: true },
});
CategoryModal.hasMany(ProductModal, {
  foreignKey: { name: "category_id", allowNull: true },
});

ProductModal.belongsTo(UserModel, {
  foreignKey: { name: "user_id", allowNull: true },
});

ProductModal.belongsTo(CategoryModal, {
  foreignKey: { name: "category_id", allowNull: true },
});

ProductModal.sync({ alter: true });
export default ProductModal;

//   id integer [primary key]
//   category_id integer
//   name varchar
//   slug varchar
//   imageUrl varchar
//   visiable bool
//   price integer
//   description long
//   stock integer
//   stars float
//   sell integer
//   selloff integer  // giảm giá
//   createdAt datatime
//   updatedAt datatime
//   view number
