import { DataResponse } from "../../middlewares";
import DiscountModel from "../../models/discount.model";
import OrderModal from "../../models/order.model";
import OrderDetailModal from "../../models/orderDetail.modal";
import ProductModal from "../../models/product.model";

class OrderServices {
  // lấy danh sách sản phẩm  đặt hàng chi tiết
  async GetOrderDetail(order_id) {
    const listOrderDetail = OrderDetailModal.findAll({
      where: {
        order_id,
      },
      include: [
        {
          model: ProductModal,
          attributes: [
            "id",
            "imageUrl",
            "price",
            "description",
            "sale_off",
            "sales",
          ],
        },
      ],
    });
    return DataResponse(
      { orderdetails: listOrderDetail },
      200,
      "Lấy danh sách đơn hàng  chi tiết thành công"
    );
  }
  async GetAllOrderAdmin() {
    const listOrder = await OrderModal.findAll();
    return DataResponse(
      { orders: listOrder },
      200,
      "Lấy danh sách đơn hàng thành công"
    );
  }
  async GetListOrderClient(user_id) {
    const listOrder =
      (await OrderModal.findAll({
        where: {
          user_id,
        },
      })) || [];
    return DataResponse(
      { listOrder },
      200,
      "Lấy danh sách đơn hàng thành công"
    );
  }
  async CreateOrder(order, order_detail = []) {
    if (order_detail?.length < 0) {
      throw new Error("Vui lòng chọn sản phẩm");
    }
    if (order.discount_id) {
      const findDiscount = await DiscountModel.findByPk(order.discount_id);
      if (!findDiscount) {
        order.discount_id = null;
      } else {
        order.discount_id = findDiscount.id;
      }
    } else {
      order.discount_id = null;
    }

    const CreateOrder = await OrderModal.create(order);
    if (!CreateOrder) throw new Error("Tạo hóa đơn không thành công");
    const listOrderDetail = [];

    order_detail.forEach(async (item) => {
      const newOrderItem = await OrderDetailModal.create({
        quantity: item.quantity,
        price: item.price,
        order_id: CreateOrder.id,
        product_id: item.id,
      });
      listOrderDetail.push(newOrderItem);
    });

    return DataResponse(
      { order: CreateOrder, listorderdetals: listOrderDetail },
      200,
      "Tạo đơn hàng thành công"
    );
  }
  async DeleteOrder(id) {
    await OrderModal.destroy({
      where: {
        id,
      },
    });
    await OrderDetailModal.destroy({
      where: {
        order_id: id,
      },
    });
    return DataResponse({}, 200, "Xóa đơn hàng thành công");
  }
  async DeleteOrderDetails(id) {
    await OrderDetailModal.destroy({
      where: {
        id,
      },
    });
  }
}
export default new OrderServices();
