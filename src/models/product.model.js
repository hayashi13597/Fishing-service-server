import CategoryModal from "./cate.model";
import sequelize from "./index";
import { DataTypes } from "sequelize";
import UserModel from "./user.model";

const ProductModal = sequelize.define(
  "Product",
  {
    name: {
      type: DataTypes.STRING,
    },
    slug: {
      type: DataTypes.STRING,
    },

    price: {
      type: DataTypes.BIGINT,
      defaultValue: 0,
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
    listSubimages: {
      type: DataTypes.STRING,
      defaultValue: "",
    },
    visiable: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    view: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    sell: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    stars: {
      type: DataTypes.FLOAT,
      defaultValue: 5,
    },
    selloff: {
      type: DataTypes.FLOAT, // giảm giá
      defaultValue: 0,
    },

    user_id: {
      type: DataTypes.INTEGER,
      references: {
        model: "user",
        key: "id",
      },
    },
    category_id: {
      type: DataTypes.INTEGER,
      references: {
        model: "category",
        key: "id",
      },
    },
  },
  { timestamps: true, freezeTableName: true }
);

UserModel.hasMany(ProductModal, { foreignKey: "user_id", targetKey: "id" });
CategoryModal.hasMany(ProductModal, {
  foreignKey: "category_id",
  targetKey: "id",
});

ProductModal.belongsTo(UserModel, {
  foreignKey: "user_id",
});

ProductModal.belongsTo(CategoryModal, {
  foreignKey: "category_id",
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
