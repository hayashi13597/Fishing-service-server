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
      order: [["createdAt", "DESC"]],
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
        order: [["sell", "DESC"]],
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
    const listProductSamee = await ProductModal.findAll(
      {
        where: {
          slug,
        },
        include: [
          {
            model: CategoryModal,
            attributes: ["id", "name"],
          },
        ],
      },
      { limit: 6, order: '"updatedAt" DESC' }
    );
    if (!ProductDetail) {
      throw new Error("Sản phẩm không tồn tại");
    }
    ProductModal.increment({ view: +1 }, { where: { slug } });

    return DataResponse(
      { ProductDetail, listProductSamee },
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
      selloff = 0,
      listSubimages = "",
      visiable = true,
      description,
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
      selloff,
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
    if (productUpdate?.listSubimages) {
      try {
        let findProduct = await ProductModal.findByPk(id);

        findProduct = Util.coverDataFromSelect(findProduct);

        const listImageRender =
          JSON.parse(findProduct?.listSubimages || []) || [];
        const newSubImage = JSON.parse(productUpdate.listSubimages);
        productUpdate.listSubimages = JSON.stringify([
          ...listImageRender,
          ...newSubImage,
        ]);
      } catch {
        console.log("Lỗi update subimage");
      }
    }

    await ProductModal.update(productUpdate, {
      where: {
        id,
      },
    });

    ProductModal.increment({ view: +1 }, { where: { id } });

    const Listproduct = await ProductModal.findAll({
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
      { products: Listproduct },
      200,
      "Cập nhập sản phẩm  thành công"
    );
  }
  async UpdateSubImage(id, idPath) {
    let findProduct = await ProductModal.findByPk(id);
    findProduct = Util.coverDataFromSelect(findProduct);
    if (findProduct?.listSubimages) {
      try {
        let listImageRender =
          JSON.parse(findProduct?.listSubimages || []) || [];
        listImageRender = listImageRender.filter(
          (item) => item.idPath != idPath
        );
        listImageRender = JSON.stringify(listImageRender);
        await Promise.all([
          CloudinaryServices.deleteFileImage(idPath),
          ProductModal.update(
            { listSubimages: listImageRender },
            {
              where: {
                id,
              },
            }
          ),
        ]);
        CloudinaryServices.deleteFileImage(idPath);
      } catch {
        throw new Error("Không xóa thành công");
      }
    }
    const listProduct = await ProductModal.findAll({
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
      order: [["createdAt", "DESC"]],
    });
    return DataResponse(
      { products: listProduct },
      200,
      "Xóa ảnh phụ thành công"
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
