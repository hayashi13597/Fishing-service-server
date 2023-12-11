import ReviewModal from "../../models/review.model";
import { DataResponse, Logger } from "../../middlewares";
import { CreateNotice } from "../user/User.service";
import ProductModal from "../../models/product.model";
import Util from "../../utils";
import CategoryModal from "../../models/cate.model";
import UserModel from "../../models/user.model";
class ReviewServices {
  async GetAll(limit, skip) {
    const listReview = await ReviewModal.findAll({
      where: {
        status: true,
      },
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
    const total = await ReviewModal.count({
      where: {
        status: true,
      },
    });
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
      Logger(error);
    }
    return DataResponse(
      { review: newReview },
      201,
      "Tạo thành công đánh giá mới"
    );
  }
  async GetOne(idProduct, star, limit, skip) {
    let total = 0;
    let listReview = [];

    if (star == "all") {
      total = await ReviewModal.count({
        where: {
          product_id: idProduct,
          status: true,
        },
      });
      listReview = await ReviewModal.findAll({
        where: {
          product_id: idProduct,
          status: true,
        },
        include: [
          {
            model: UserModel,
            attributes: ["avatar", "fullname", "id"],
          },

          {
            model: ProductModal,
            attributes: ["name"],
            include: {
              model: CategoryModal,
              attributes: ["slug", "name"],
            },
          },
        ],
        limit: limit,
        offset: skip,
        order: [["createdAt", "DESC"]],
      });
    } else {
      total = await ReviewModal.count({
        where: {
          product_id: idProduct,
          star,
          status: true,
        },
      });
      listReview = await ReviewModal.findAll({
        where: {
          product_id: idProduct,
          star,
          status: true,
        },
        include: [
          {
            model: UserModel,
            attributes: ["avatar", "fullname", "id"],
          },

          {
            model: ProductModal,
            attributes: {
              exclude: ["description", "content", "listSubimages"],
            },
            include: {
              model: CategoryModal,
              attributes: ["slug", "name"],
            },
          },
        ],
        limit: limit,
        offset: skip,
        order: [["createdAt", "DESC"]],
      });
    }

    const [star1 = 0, star2 = 0, star3 = 0, star4 = 0, star5 = 0] =
      await Promise.all([
        ReviewModal.count({
          where: {
            product_id: idProduct,
            star: 1,
            status: true,
          },
        }),
        ReviewModal.count({
          where: {
            product_id: idProduct,
            star: 2,
            status: true,
          },
        }),
        ReviewModal.count({
          where: {
            product_id: idProduct,
            star: 3,
            status: true,
          },
        }),
        ReviewModal.count({
          where: {
            product_id: idProduct,
            star: 4,
            status: true,
          },
        }),
        ReviewModal.count({
          where: {
            product_id: idProduct,
            star: 5,
            status: true,
          },
        }),
      ]);
    return DataResponse(
      { reviews: listReview, star1, star2, star3, star4, star5, total },
      200,
      "Lấy thành công đánh giá"
    );
  }
  async HandleEvaluate(idReview, idProduct, star, content) {
    const total = await ReviewModal.count({
      where: {
        product_id: idProduct,
        status: true,
      },
    });
    const [star1 = 0, star2 = 0, star3 = 0, star4 = 0, star5 = 0] =
      await Promise.all([
        ReviewModal.count({
          where: {
            product_id: idProduct,
            star: 1,
            status: true,
          },
        }),
        ReviewModal.count({
          where: {
            product_id: idProduct,
            star: 2,
            status: true,
          },
        }),
        ReviewModal.count({
          where: {
            product_id: idProduct,
            star: 3,
            status: true,
          },
        }),
        ReviewModal.count({
          where: {
            product_id: idProduct,
            star: 4,
            status: true,
          },
        }),
        ReviewModal.count({
          where: {
            product_id: idProduct,
            star: 5,
            status: true,
          },
        }),
      ]);
    const average =
      (star1 + star2 * 2 + star3 * 3 + star4 * 4 + star5 * 5 + star) /
      (total + 1);
    await ProductModal.update(
      {
        stars: average.toFixed(1),
      },
      {
        where: {
          id: idProduct,
        },
      }
    );

    const evaluate = await ReviewModal.update(
      { star, content, status: true },
      {
        where: {
          id: idReview,
        },
      }
    );
    return DataResponse(
      { evaluate },
      200,
      `Cảm ơn bạn đã đánh giá ${star} sao`
    );
  }
  async GetDetailListReview(accountId, limit, skip) {
    const listReview = await ReviewModal.findAll({
      where: {
        user_id: accountId,
        status: false,
      },
      include: [
        {
          model: UserModel,
          attributes: ["avatar", "fullname", "id"],
        },

        {
          model: ProductModal,
          attributes: {
            exclude: ["description", "content", "listSubimages"],
          },
          include: {
            model: CategoryModal,
            attributes: ["slug", "name"],
          },
        },
      ],
      limit: limit,
      offset: skip,
      order: [["createdAt", "DESC"]],
    });
    const total = await ReviewModal.count({
      where: {
        user_id: accountId,
        status: false,
      },
    });
    Logger("ge tlist oke");
    return DataResponse(
      { reviews: listReview, total },
      200,
      "Lấy tất cả đánh giá thành công"
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
