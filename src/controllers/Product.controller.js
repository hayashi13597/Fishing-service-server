import { coverSlug } from "react-swisskit";
import productServices from "../services/products/product.services";

class CategoryController {
  async GetAllAdmin(_, res) {
    const data = await productServices.GetAllAdmin();
    res.status(200).json(data);
  }
  async GetOne(req, res) {
    const { slug } = req.params;
    const data = await productServices.GetOne(slug);
    res.status(200).json(data);
  }
  async GetViewHomeClient() {
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
      description,
      selloff = 0,
    } = req.body.data;

    const slug = coverSlug(name);
    const data = await productServices.Create(user_id, category_id, {
      idPath,
      price,
      name,
      imageUrl,
      listSubimages,
      description,
      selloff,
      slug,
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

  async Delete(req, res) {
    const id = req.params.id;
    const data = await productServices.Delete(id);
    res.status(200).json(data);
  }
}
export default new CategoryController();
