import { DataResponse } from "../../middlewares";
import CategoryModal from "../../models/cate.model";
import ProductModal from "../../models/product.model";
import UserModel from "../../models/user.model";

class ProductServices {
  async GetAllAdmin() {
    const listProduct = await ProductModal.findAll();
    return DataResponse(
      { products: listProduct },
      200,
      "Lấy thành  công tất cả sản phẩm"
    );
  }
  async GetViewHomeClient() {
    const [ListProductSaleTop, ListProductNews] = await Promise.all([
      ProductModal.findAll({ limit: 10, order: [["sell", "DESC"]] }),
      ProductModal.findAll({ limit: 10, order: [["createAt", "DESC"]] }),
    ]);
    return DataResponse(
      { ListProductSaleTop, ListProductNews },
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
          attributes: ["id", "name"],
        },
      ],
    });
    if (!ProductDetail) {
      throw new Error("Sản phẩm không tồn tại");
    }
    ProductModal.increment({ view: +1 }, { where: { slug } });

    return DataResponse({ ProductDetail }, 200, "Lấy sản phẩm thành công");
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
      listSubimages = [],
      description,
    }
  ) {
    const checkExists = await ProductModal.findOne({ where: { slug } });
    if (checkExists) throw new Error("Sản phẩm đã tồn tại");
    const newProduct = await ProductModal.create({
      category_id,
      user_id,
      idPath,
      price,
      name,
      slug,
      imageUrl,
      listSubimages,
      description,
      selloff,
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
    console.log(productUpdate);
    const product = await ProductModal.findByPk(id);
    if (!product) throw new Error("Cập nhập thất bại");
    return DataResponse({ product }, 200, "Cập nhập sản phẩm  thành công");
  }

  async Delete(id) {
    await ProductModal.destroy({
      where: {
        id: id,
      },
    });
    return DataResponse({}, 200, "Xóa sản phẩm thành công");
  }
}
export default new ProductServices();
