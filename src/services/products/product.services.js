import { DataResponse } from "../../middlewares";
import CategoryModal from "../../models/cate.model";
import OrderDetailModal from "../../models/orderDetail.modal";
import ProductModal from "../../models/product.model";
import UserModel from "../../models/user.model";
import EventModal from "../../models/event.model";

import Util from "../../utils";
import CloudinaryServices from "../cloudinary.services";
import { Op } from "sequelize";
import sequelize from "../../models";
import OrderModal from "../../models/order.model";
import moment from "moment";

class ProductServices {
  async SearchProduct(text, limit, skip) {
    const listProductSearch = await ProductModal.findAll({
      where: {
        [Op.or]: {
          name: {
            [Op.substring]: text,
          },
          description: {
            [Op.substring]: text,
          },
          price: {
            [Op.substring]: text,
          },
        },
      },
      include: [
        {
          model: UserModel,
          attributes: ["id", "fullname", "avatar"],
        },
        {
          model: CategoryModal,
          attributes: ["id", "name", "slug"],
        },
      ],
      order: [["updatedAt", "DESC"]],
      limit: limit,
      offset: skip,
    });
    const total = await ProductModal.count({
      where: {
        [Op.or]: {
          name: {
            [Op.substring]: text,
          },
          description: {
            [Op.substring]: text,
          },
          price: {
            [Op.substring]: text,
          },
        },
      },
    });
    return DataResponse(
      { products: listProductSearch, total },
      200,
      "Tìm kiếm sản phẩm thành công"
    );
  }
  async GetAllAdmin() {
    const listProduct = await ProductModal.findAll({
      include: [
        {
          model: CategoryModal,
          attributes: ["id", "name", "slug"],
        },
        {
          model: UserModel,
          attributes: ["avatar", "fullname"],
        },
      ],
      order: [["updatedAt", "DESC"]],
    });
    return DataResponse(
      { products: listProduct },
      200,
      "Lấy thành  công tất cả sản phẩm"
    );
  }
  async GetViewHomeClient() {
    const [
      ListProductSaleTop,
      ListProductNews,
      ListFoods,
      listNews,
      listEvents,
    ] = await Promise.all([
      ProductModal.findAll({
        where: {
          price: {
            [Op.gt]: 0,
          },
        },
        include: [
          {
            model: CategoryModal,
            attributes: ["id", "name", "slug"],
          },
        ],
        limit: 8,
        order: [["sales", "DESC"]],
      }),
      ProductModal.findAll({
        limit: 8,
        include: [
          {
            model: CategoryModal,
            attributes: ["id", "name", "slug"],
          },
        ],
        where: {
          price: {
            [Op.gt]: 0,
          },
        },
        order: [["createdAt", "DESC"]],
      }),
      ProductModal.findAll({
        limit: 8,
        include: [
          {
            model: CategoryModal,
            attributes: ["id", "name", "slug"],
          },
        ],
        where: {
          price: 0,
        },
        order: [["createdAt", "DESC"]],
      }),
      EventModal.findAll({
        limit: 10,
        include: [
          {
            model: UserModel,
            attributes: ["id", "fullname", "avatar"],
          },
        ],
        order: [["createdAt", "DESC"]],
        attributes: {
          exclude: ["content"],
        },
      }),
      EventModal.findAll({
        limit: 2,
        where: {
          isEvent: true,
        },
        include: [
          {
            model: UserModel,
            attributes: ["id", "fullname", "avatar"],
          },
        ],
        attributes: {
          exclude: ["content"],
        },
        order: [["createdAt", "DESC"]],
      }),
    ]);
    return DataResponse(
      { ListProductSaleTop, ListProductNews, ListFoods, listNews, listEvents },
      200,
      "Lấy danh sách sản phẩm trong home"
    );
  }
  async GetOne(slug) {
    const ProductDetail = await ProductModal.findOne({
      where: {
        slug,
      },
      include: [
        {
          model: UserModel,
          attributes: ["id", "fullname", "avatar"],
        },
        {
          model: CategoryModal,
          attributes: ["id", "name", "slug"],
        },
      ],
    });

    const listProductSame = await ProductModal.findAll(
      {
        where: {
          category_id: ProductDetail.category_id,
          id: {
            [Op.not]: ProductDetail.id,
          },
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
      },
      { limit: 6, order: '"view" DESC' }
    );
    if (!ProductDetail) {
      throw new Error("Sản phẩm không tồn tại");
    }
    ProductModal.increment({ view: +1 }, { where: { slug } });

    return DataResponse(
      { ProductDetail, listProductSame },
      200,
      "Lấy sản phẩm thành công"
    );
  }
  async Create(
    user_id,
    category_id,
    {
      price,
      name,
      slug,
      imageUrl,
      idPath,
      sale_off: selloff,
      listSubimages = "",
      visiable = true,
      description,
      content,
    }
  ) {
    const checkExists = await ProductModal.findOne({ where: { slug } });
    if (checkExists) throw new Error("Sản phẩm đã tồn tại");
    let newProduct = await ProductModal.create({
      category_id,
      user_id,
      idPath,
      price,
      name,
      slug,
      imageUrl,
      listSubimages,
      visiable,
      description,
      sale_off: selloff,
      content,
    });

    newProduct = await ProductModal.findByPk(newProduct.id, {
      include: [
        {
          model: CategoryModal,
          attributes: ["id", "name"],
        },
        {
          model: UserModel,
          attributes: ["avatar", "fullname"],
        },
      ],
    });

    return DataResponse(
      { product: newProduct },
      201,
      "Tạo thành công sản phẩm mới"
    );
  }
  async Update(id, productUpdate) {
    await ProductModal.update(productUpdate, {
      where: {
        id,
      },
    });

    ProductModal.increment({ view: +1 }, { where: { id } });

    const productEdit = await ProductModal.findOne({
      where: { id },
      include: [
        {
          model: CategoryModal,
          attributes: ["id", "name"],
        },
        {
          model: UserModel,
          attributes: ["avatar", "fullname"],
        },
      ],
    });

    return DataResponse(
      { product: productEdit },
      200,
      "Cập nhập sản phẩm  thành công"
    );
  }
  async UpdateSubImage(id, idPath) {
    let findProduct = await ProductModal.findByPk(id);
    findProduct = Util.coverDataFromSelect(findProduct);
    if (idPath == findProduct?.idPath) {
      CloudinaryServices.deleteFileImage(idPath);
    } else if (findProduct?.listSubimages) {
      try {
        let listImageRender =
          JSON.parse(findProduct?.listSubimages || []) || [];
        listImageRender = listImageRender.filter(
          (item) => item.idPath != idPath
        );

        listImageRender = JSON.stringify(listImageRender);
        CloudinaryServices.deleteFileImage(idPath);
        await ProductModal.update(
          { listSubimages: listImageRender },
          {
            where: {
              id,
            },
          }
        );
      } catch {
        throw new Error("Không xóa thành công");
      }
    }

    return DataResponse({}, 200, "Xóa ảnh phụ thành công");
  }
  async GetOneToSeo(slug) {
    const product = await ProductModal.findOne({
      where: {
        slug,
      },
      include: [
        {
          model: UserModel,
          attributes: ["id", "fullname", "avatar"],
        },
        {
          model: CategoryModal,
          attributes: ["id", "name", "slug"],
        },
      ],
    });
    return DataResponse({ product }, 200, "Lấy thành công sản phảm để seo");
  }
  async GetAllSlug() {
    const listSlug = await ProductModal.findAll({
      attributes: ["id", "slug"],
      include: [
        {
          model: CategoryModal,
          attributes: ["id", "name", "slug"],
        },
      ],
    });
    return DataResponse(
      { products: listSlug },
      200,
      "Lấy danh sách slug thành công"
    );
  }
  async Delete(id) {
    let FindProduct = await ProductModal.findByPk(id);
    FindProduct = Util.coverDataFromSelect(FindProduct);
    if (FindProduct && FindProduct.listSubimages) {
      const listImageRender =
        JSON.parse(FindProduct?.listSubimages || []) || [];
      listImageRender.map((item) => {
        CloudinaryServices.deleteFileImage(item.idPath);
      });
      if (FindProduct.idPath) {
        CloudinaryServices.deleteFileImage(FindProduct.idPath);
      }
    }
    // xóa
    await OrderDetailModal.destroy({
      where: {
        product_id: id,
      },
    });
    await ProductModal.destroy({
      where: {
        id: id,
      },
    });
    return DataResponse({}, 200, "Xóa sản phẩm thành công");
  }
  async GetFilterProduct(idCate, filter, limit, skip) {
    let total = 0;
    let listProducts = [];
    let optionsFilter = [["createdAt", "DESC"]];
    if (filter) {
      switch (filter) {
        case "za":
          optionsFilter = [["name", "DESC"]];
          break;
        case "az":
          optionsFilter = [["name", "ASC"]];
          break;
        case "lowest":
          optionsFilter = [["price", "ASC"]];
          break;
        case "hightest":
          optionsFilter = [["price", "DESC"]];
          break;
      }
    }
    if (idCate && filter) {
      [total, listProducts] = await Promise.all([
        ProductModal.count({
          where: {
            category_id: idCate,
          },
          order: optionsFilter,
        }),
        ProductModal.findAll({
          where: {
            category_id: idCate,
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
          attributes: {
            exclude: ["content"],
          },
          limit,
          offset: skip,
          order: optionsFilter,
        }),
      ]);
    } else if (idCate) {
      [total, listProducts] = await Promise.all([
        ProductModal.count({
          where: {
            category_id: idCate,
          },
        }),
        ProductModal.findAll({
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
          attributes: {
            exclude: ["content"],
          },
          where: {
            category_id: idCate,
          },
          limit,
          offset: skip,
        }),
      ]);
    } else {
      [total, listProducts] = await Promise.all([
        ProductModal.count({
          order: optionsFilter,
        }),
        ProductModal.findAll({
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
          attributes: {
            exclude: ["content"],
          },
          limit,
          offset: skip,
          order: optionsFilter,
        }),
      ]);
    }
    return DataResponse(
      { products: listProducts, total },
      200,
      "Lấy danh sách sản phẩm thành công"
    );
  }
  async GetChartAdmin() {
    let listOrderStatus = await OrderModal.findAll({
      where: {
        status: "s4",
      },
      attributes: ["id"],
    });
    listOrderStatus = listOrderStatus.map((item) => item.id);
    const listData = await Promise.all([
      GetDataFollowMonth(1, listOrderStatus),
      GetDataFollowMonth(2, listOrderStatus),

      GetDataFollowMonth(3, listOrderStatus),
      GetDataFollowMonth(4, listOrderStatus),

      GetDataFollowMonth(5, listOrderStatus),

      GetDataFollowMonth(6, listOrderStatus),

      GetDataFollowMonth(7, listOrderStatus),

      GetDataFollowMonth(8, listOrderStatus),

      GetDataFollowMonth(9, listOrderStatus),

      GetDataFollowMonth(10, listOrderStatus),
      GetDataFollowMonth(11, listOrderStatus),
      GetDataFollowMonth(12, listOrderStatus),
    ]);
    return DataResponse(
      { listTotal: listData },
      200,
      "Lấy danh sách sản phẩm cho chart"
    );
  }
}
async function GetDataFollowMonth(month, listStatusS4 = []) {
  const listData = await OrderDetailModal.findAll({
    where: {
      createdAt: {
        [Op.gte]: moment("0101", "MMDD")
          .add(month - 1, "months")
          .toDate(),
        [Op.lt]: moment("0101", "MMDD").add(month, "months").toDate(),
      },
      order_id: {
        [Op.in]: listStatusS4,
      },
    },
  });

  const total = listData.reduce(
    (total, { price, quantity }) => (total += price * quantity),
    0
  );

  return total || 0;
}
export default new ProductServices();
