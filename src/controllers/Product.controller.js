import { coverSlug } from "react-swisskit";
import productServices from "../services/products/product.services";

class ProductController {
  async GetAllAdmin(_, res) {
    const data = await productServices.GetAllAdmin();
    res.status(200).json(data);
  }
  async GetAllSlug(_, res) {
    console.log("đang lấy danh sách slug");
    const data = await productServices.GetAllSlug();
    res.status(200).json(data);
  }
  async GetOne(req, res) {
    const { slug } = req.params;
    const data = await productServices.GetOne(slug);
    res.status(200).json(data);
  }
  async GetOneToSeo(req, res) {
    const { slug } = req.params;
    const data = await productServices.GetOneToSeo(slug);
    res.status(200).json(data);
  }
  async GetViewHomeClient(req, res) {
    const data = await productServices.GetViewHomeClient();
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
    const data = await productServices.Create(user_id, category_id, {
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
    const data = await productServices.Update(id, product);
    res.status(200).json(data);
  }
  async UpdateSubImage(req, res) {
    const { id, idPath } = req.body.data;
    if (!id || !idPath) {
      throw new Error("Thiếu dữ liệu");
    }
    const data = await productServices.UpdateSubImage(id, idPath);
    res.status(200).json(data);
  }
  async Delete(req, res) {
    const id = req.params.id;
    const data = await productServices.Delete(id);
    res.status(200).json(data);
  }
  async Search(req, res) {
    const { search } = req.body.data;
    const data = await productServices.SearchProduct(search);
    res.status(200).json(data);
  }
}
export default new ProductController();
