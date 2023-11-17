import { coverSlug } from "react-swisskit";
import categoryServices from "../services/category/category.services";

class CategoryController {
  async GetAll(_, res) {
    const data = await categoryServices.GetAll();
    res.status(200).json(data);
  }
  async GetOne(req, res) {
    const { id } = req.params;
    const data = await categoryServices.GetOne(id);
    res.status(200).json(data);
  }
  async Create(req, res) {
    const {
      user_id,
      name,
      description,
      imageUrl,
      idPath,
      visiable = true,
    } = req.body.data;
    const slug = coverSlug(name);
    const data = await categoryServices.Create(user_id, {
      name,
      description,
      imageUrl,
      idPath,
      visiable,
      slug,
    });
    res.status(201).json(data);
  }
  async Update(req, res) {
    const { id, ...category } = req.body.data;
    if (category?.name) {
      category.slug = coverSlug(category.name);
    }
    const data = await categoryServices.Update(id, category);
    res.status(200).json(data);
  }

  async Delete(req, res) {
    const id = req.params.id;
    const data = await categoryServices.Delete(id);
    res.status(200).json(data);
  }
}
export default new CategoryController();
