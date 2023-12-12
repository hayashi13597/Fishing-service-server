import { coverSlug } from "react-swisskit";
import ProductServices from "../services/products/product.services";

class ProductController {
  async GetAllAdmin(_, res) {
    const data = await ProductServices.GetAllAdmin();
    res.status(200).json(data);
  }
  async GetChartAdmin(_, res) {
    const data = await ProductServices.GetChartAdmin();
    res.status(200).json(data);
  }
  async GetAllSlug(_, res) {
    const data = await ProductServices.GetAllSlug();
    res.status(200).json(data);
  }
  async GetOne(req, res) {
    const { slug } = req.params;
    const data = await ProductServices.GetOne(slug);
    res.status(200).json(data);
  }
  async GetOneToSeo(req, res) {
    const { slug } = req.params;
    const data = await ProductServices.GetOneToSeo(slug);
    res.status(200).json(data);
  }
  async GetFilterProduct(req, res) {
    const { idCate = "", filter = "", limit = 8, skip = 0 } = req.query;
    const data = await ProductServices.GetFilterProduct(
      idCate,
      filter,
      parseInt(limit),
      parseInt(skip)
    );
    res.status(200).json(data);
  }
  async GetViewHomeClient(req, res) {
    const data = await ProductServices.GetViewHomeClient();
    res.status(200).json(data);
  }
  async Create(req, res) {
    const {
      category_id,
      user_id,
      idPath,
      price,
      name,
      imageUrl,
      listSubimages,
      visiable = true,
      description,
      selloff = 0,
      content = "",
    } = req.body.data;

    const slug = coverSlug(name);
    const data = await ProductServices.Create(user_id, category_id, {
      idPath,
      price,
      name,
      imageUrl,
      listSubimages,
      visiable,
      description,
      sale_off: selloff,
      slug,
      content,
    });
    res.status(201).json(data);
  }
  async Update(req, res) {
    const { id, ...product } = req.body.data;

    if (product && product?.name) {
      product.slug = coverSlug(product.name);
    }
    const data = await ProductServices.Update(id, product);
    res.status(200).json(data);
  }
  async UpdateSubImage(req, res) {
    const { id, idPath } = req.body.data;
    if (!id || !idPath) {
      throw new Error("Thiếu dữ liệu");
    }
    const data = await ProductServices.UpdateSubImage(id, idPath);
    res.status(200).json(data);
  }
  async Delete(req, res) {
    const id = req.params.id;
    const data = await ProductServices.Delete(id);
    res.status(200).json(data);
  }
  async Search(req, res) {
    const { search, limit = 12, skip = 0 } = req.body.data;
    const data = await ProductServices.SearchProduct(search, limit, skip);
    res.status(200).json(data);
  }
}
export default new ProductController();
