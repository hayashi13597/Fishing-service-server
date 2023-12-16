import moment from "moment";
import { DataResponse } from "../../middlewares";
import DiscountModel from "../../models/discount.model";
import OrderModal from "../../models/order.model";
import OrderDetailModal from "../../models/orderDetail.modal";
import ProductModal from "../../models/product.model";
import UserService, { CreateNotice } from "../user/User.service";
import Util from "../../utils";
import CategoryModal from "../../models/cate.model";
import RedisServer from "../../redis/redis.config";
import UserModel from "../../models/user.model";
import { Op } from "sequelize";
import ReviewModal from "../../models/review.model";
const StatusPay = {
  s1: "Chờ xử lý",
  s2: "Đã kiểm duyệt",
  s3: "Đang giao hàng",
  s4: "Thành công",
  s5: "Thất bại",
};
class OrderServices {
  // lấy danh sách sản phẩm  đặt hàng chi tiết
  async GetOrderDetail(order_id) {
    const listOrderDetail = await OrderDetailModal.findAll({
      where: {
        order_id,
      },
      include: [
        {
          model: ProductModal,
          attributes: [
            "name",
            "imageUrl",
            "price",
            "description",
            "slug",
            "id",
          ],
          include: {
            model: CategoryModal,
            attributes: ["slug"],
          },
        },
      ],
    });
    return DataResponse(
      { orderdetails: listOrderDetail },
      200,
      "Lấy danh sách đơn hàng  chi tiết thành công"
    );
  }
  async EditOrder(id, orderUpdate) {
    await OrderModal.update(orderUpdate, {
      where: {
        id,
      },
    });
    try {
      CreateNotice({
        title: `Thông báo về đơn hàng #${orderUpdate.codebill}`,
        content: `Đơn hàng đang ở trạng thái ${StatusPay[orderUpdate.status]}`,
        receiver_id: orderUpdate.user_id,
        user_id: orderUpdate.user_id,
        isSee: false,
      });
      if (orderUpdate.status == "s4") {
        let orderDetail = await OrderDetailModal.findAll({
          where: {
            order_id: id,
          },
          attributes: ["product_id"],
        });
        orderDetail = Util.coverDataFromSelect(orderDetail);
        orderDetail.forEach((item) => {
          ProductModal.increment(
            {
              view: +1,
              sales: +1,
            },
            {
              where: {
                id: item.product_id,
              },
            }
          );
        });
      }
    } catch (error) {}

    const order = await OrderModal.findByPk(id);

    return DataResponse({ order: order }, 200, "Cập nhập hóa đơn thành công");
  }

  async GetAllOrderAdmin(limit, skip) {
    const listOrder = await OrderModal.findAll({
      limit: limit,
      offset: skip,
      order: [["updatedAt", "DESC"]],
    });
    const total = await OrderModal.count();
    return DataResponse(
      { orders: listOrder, total },
      200,
      "Lấy danh sách đơn hàng thành công"
    );
  }
  async GetListOrderClient(user_id, limit = 3, skip = 0) {
    const total = await OrderModal.count({
      where: {
        user_id,
      },
    });
    const listOrder = await OrderModal.findAll({
      where: {
        user_id,
      },
      order: [["updatedAt", "DESC"]],
      limit: limit * 1,
      offset: skip * 1,
    });
    return DataResponse(
      { listOrder, total },
      200,
      "Lấy danh sách đơn hàng thành công"
    );
  }
  async CreateOrder(order, order_detail = []) {
    const user_id = order.user_id;
    if (!user_id) {
      throw new Error("Bạn chưa đăng nhập");
    }
    let account = UserModel.findByPk(user_id);
    if (!account) {
      throw new Error("Tài khoản không tồn tại");
    }
    account = Util.coverDataFromSelect(account);
    const { fullname, address, phone, total, payment_method, shipping_fee } =
      order;
    if (!fullname || !address || !phone) {
      throw new Error("Dữ liệu bị thiếu");
    }
    if (account.phone || account.address) {
      // cập nhập tài khoản
      await UserService.UpdateProfile(account.id, {
        address,
        phone,
      });
    }
    if (order_detail?.length < 0) {
      throw new Error("Chưa có đơn hàng nào");
    }

    if (order.discount_id) {
      const findDiscount = await DiscountModel.findByPk(order.discount_id);

      if (!findDiscount) {
        delete order.discount_id;
      } else {
        order.discount_id = findDiscount.id;
        order.discount = findDiscount.value;
        DiscountModel.update(
          { status: true },
          {
            where: {
              id: order.discount_id,
            },
          }
        );
      }
    } else {
      delete order.discount_id;
    }
    order.codebill = Util.GenerateDiscountCode(10);
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
      await ReviewModal.create({
        user_id: order.user_id,
        product_id: item.id,
        quantity: item.quantity,
        order_id: CreateOrder.id,
      });
    });
    try {
      RedisServer.publish(
        "order",
        JSON.stringify({
          listProduct: order_detail,
          email: order.email,
          total,
          address,
          payment_method,
          shipping_fee,
          code: CreateOrder?.codebill,
        })
      );
    } catch (error) {}
    const notice = await CreateNotice({
      receiver_id: order.user_id,
      title: "Đặt đơn hàng thành công",
      user_id: order.user_id,
      isSee: false,
      content: `Bạn đã đặt hàng với mã đơn là ${
        CreateOrder?.codebill
      } vào ngày ${moment(CreateOrder.createdAt).format("DD/MM/YYYY")}`,
    });

    return DataResponse(
      { order: CreateOrder, listorderdetals: listOrderDetail, notice },
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
    return DataResponse({}, 200, "Xóa đơn hàng chi tiết thành công");
  }
  async Search(text) {
    const listOrder = await OrderModal.findAll({
      where: {
        [Op.or]: {
          codebill: {
            [Op.substring]: text,
          },
          email: {
            [Op.substring]: text,
          },
          fullname: {
            [Op.substring]: text,
          },
          phone: {
            [Op.substring]: text,
          },
        },
      },
    });
    return DataResponse(
      { orders: listOrder },
      200,
      "Lấy danh sách hóa đơn thành công"
    );
  }
}
export default new OrderServices();
