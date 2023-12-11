import sequelize from "./index";
import { DataTypes } from "sequelize";

import ProductModal from "./product.model";
import OrderModal from "./order.model";

const OrderDetailModal = sequelize.define(
  "OrderDetail",
  {
    quantity: {
      type: DataTypes.INTEGER,
      defaultValue: 1,
    },
    price: {
      type: DataTypes.INTEGER,
      defaultValue: 1,
    },

    product_id: {
      type: DataTypes.INTEGER,
    },

    order_id: {
      type: DataTypes.INTEGER,
    },
  },
  { timestamps: true, freezeTableName: true }
);

ProductModal.hasOne(OrderDetailModal, {
  foreignKey: { name: "product_id", allowNull: true },
});
OrderDetailModal.belongsTo(ProductModal, {
  foreignKey: { name: "product_id", allowNull: true },
});
OrderModal.hasMany(OrderDetailModal, {
  foreignKey: { name: "order_id", allowNull: true },
});
OrderDetailModal.belongsTo(OrderModal, {
  foreignKey: { name: "order_id", allowNull: true },
});
OrderDetailModal.sync({ alter: true });
export default OrderDetailModal;

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
