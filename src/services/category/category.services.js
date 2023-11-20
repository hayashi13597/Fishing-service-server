import { DataResponse } from "../../middlewares";
import CategoryModal from "../../models/cate.model";
import UserModel from "../../models/user.model";
import ProductModal from "../../models/product.model";

import Util from "../../utils";

class CategoryServices {
  async GetAll() {
    const listCategory = await CategoryModal.findAll();
    return DataResponse(
      { categories: listCategory },
      200,
      "Lấy thành công danh sách danh mục"
    );
  }
  async GetOne(id) {
    const category = await CategoryModal.findByPk(id, {
      include: [
        {
          model: UserModel,
          attributes: ["id", "fullname", "avatar", "role"],
        },
      ],
    });
    if (!category) {
      throw new Error("Danh mục không tồn tại");
    }
    return DataResponse({ category }, 200, "Lấy thành công danh sách danh mục");
  }
  async GetOneSlugSeo(slug) {
    const category = await CategoryModal.findOne({
      where: {
        slug,
      },
      includes: [
        {
          model: UserModel,
          attributes: ["id", "fullname", "avatar"],
        },
      ],
    });
    if (!category) {
      throw new Error("Danh mục không tồn tại");
    }
    return DataResponse({ category }, 200, "Lấy thành công danh muc SEO");
  }
  async GetOneSlug(slug, limit, skip) {
    let category = await CategoryModal.findOne({
      where: {
        slug,
      },
      attributes: ["slug", "name", "id"],
      include: [
        {
          model: UserModel,
          attributes: ["id", "fullname", "avatar", "role"],
        },
      ],
    });
    if (!category) {
      throw new Error("Danh mục không tồn tại");
    }
    category = Util.coverDataFromSelect(category);

    const listProducts = await ProductModal.findAll({
      where: {
        category_id: category.id,
      },

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

      order: [["view", "DESC"]],
      offset: skip,
      limit,
    });
    const totalProductFollowCate = await ProductModal.count({
      where: {
        category_id: category.id,
      },
    });
    return DataResponse(
      { category, listProducts, total: totalProductFollowCate },
      200,
      "Lấy thành công danh sách danh mục"
    );
  }
  async Create(user_id, category) {
    const slug = category.slug;
    let isExterst = await CategoryModal.findOne({ where: { slug } });
    isExterst = Util.coverDataFromSelect(isExterst);
    if (isExterst?.id) {
      throw new Error("Danh mục đã tồn tại");
    }
    const newCate = await CategoryModal.create({
      user_id,
      ...category,
    });

    return DataResponse(
      { category: newCate },
      201,
      "Tạo thành công danh mục mới"
    );
  }
  async Update(id, categoryUpdate) {
    let newCate = await CategoryModal.update(categoryUpdate, {
      where: {
        id,
      },
    });
    newCate = await CategoryModal.findByPk(id);
    return DataResponse(
      { category: newCate },
      200,
      "Cập nhập danh mục thành công"
    );
  }

  async Delete(id) {
    await CategoryModal.destroy({
      where: {
        id: id,
      },
    });
    return DataResponse({}, 200, "Xóa danh mục thành công");
  }
}
export default new CategoryServices();
