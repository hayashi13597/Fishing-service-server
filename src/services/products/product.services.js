import { DataResponse } from "../../middlewares";
import CategoryModal from "../../models/cate.model";
import OrderDetailModal from "../../models/orderDetail.modal";
import ProductModal from "../../models/product.model";
import UserModel from "../../models/user.model";
import EventModal from "../../models/event.model";

import Util from "../../utils";
import CloudinaryServices from "../cloudinary.services";
import { Op } from "sequelize";

class ProductServices {
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
        limit: 6,
        order: [["sales", "DESC"]],
      }),
      ProductModal.findAll({
        limit: 6,
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
        limit: 6,
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
        limit: 2,

        where: {
          isEvent: false,
        },
        order: [["createdAt", "DESC"]],
      }),
      EventModal.findAll({
        limit: 2,

        where: {
          isEvent: true,
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
}
export default new ProductServices();
