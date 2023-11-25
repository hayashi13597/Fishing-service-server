import ReviewModal from "../../models/review.model";
import { DataResponse } from "../../middlewares";
import { CreateNotice } from "../user/User.service";
import ProductModal from "../../models/product.model";
import Util from "../../utils";
import CategoryModal from "../../models/cate.model";
import UserModel from "../../models/user.model";
class ReviewServices {
  async GetAll(limit, skip) {
    const listReview = await ReviewModal.findAll({
      limit: parseInt(limit),
      offset: parseInt(skip),
      order: [["updatedAt", "DESC"]],
      include: [
        {
          model: ProductModal,
          attributes: ["name"],
        },
        {
          model: UserModel,
          attributes: ["fullname"],
        },
      ],
    });
    const total = await ReviewModal.count();
    return DataResponse({ listReview, total }, 200, "Lấy danh sách đánh giá");
  }
  async CreateReview(star, user_id, product_id, content = "", listImage = "") {
    let product = await ProductModal.findOne({
      where: {
        id: product_id,
      },
      include: [
        {
          model: CategoryModal,
          attributes: ["id", "name", "slug"],
        },
        {
          model: UserModel,
          attributes: ["id", "fullname", "avatar"],
        },
      ],
    });
    product = Util.coverDataFromSelect(product);
    if (!product.id) {
      throw new Error("Không tìm thấy sản phẩm để đánh giá");
    }
    const newReview = await ReviewModal.create({
      star,
      user_id,
      product_id,
      content,
      listImage,
    });
    try {
      await CreateNotice(
        {
          title: `Thông báo đánh giá sản phẩm ${product.name}`,
          content: `Bạn đã đánh giá cho sản phẩm ${product.name} thành công với số sao là ${star}`,
          receiver_id: user_id,
          user_id: user_id,
          isSee: false,
        },
        `/${product.Category.slug}/${product.slug}`
      );
    } catch (error) {
      console.log(error);
    }
    return DataResponse(
      { review: newReview },
      201,
      "Tạo thành công đánh giá mới"
    );
  }
  async GetOne(idProduct) {
    const listReview = await ReviewModal.findAll({
      where: {
        product_id: idProduct,
      },
      include: [
        {
          model: UserModel,
          attributes: ["avatar", "fullname"],
        },
        {
          model: ProductModal,
          attributes: ["slug", "name"],
          include: {
            model: CategoryModal,
            attributes: ["slug", "name"],
          },
        },
      ],
    });
    const [star1, start2, start3, start4, star5] = await Promise.all([
      ReviewModal.count({
        where: {
          product_id: idProduct,
          star: 1,
        },
      }),
      ReviewModal.count({
        where: {
          product_id: idProduct,
          star: 2,
        },
      }),
      ReviewModal.count({
        where: {
          product_id: idProduct,
          star: 3,
        },
      }),
      ReviewModal.count({
        where: {
          product_id: idProduct,
          star: 4,
        },
      }),
      ReviewModal.count({
        where: {
          product_id: idProduct,
          star: 5,
        },
      }),
    ]);
    return DataResponse(
      { reviews: listReview, star1, start2, start3, start4, star5 },
      200,
      "Lấy thành công đánh giá"
    );
  }
  async DeleteReview(id) {
    await ReviewModal.destroy({
      where: {
        id,
      },
    });
    return DataResponse({}, 200, "Xóa thành công đánh giá");
  }
}
export default new ReviewServices();
