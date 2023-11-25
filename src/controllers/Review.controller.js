import ReviewServices from "../services/review/review.services";

class ReviewController {
  async GetAll(req, res) {
    const { limit = 5, skip = 0 } = req.query;
    const data = await ReviewServices.GetAll(limit, skip);
    res.status(200).json(data);
  }
  Edit(req, res) {}
  async Create(req, res) {
    const {
      star,
      user_id,
      product_id,
      content = "",
      listImage = "",
    } = req.body.data;
    const data = await ReviewServices.CreateReview(
      star,
      user_id,
      product_id,
      content,
      listImage
    );
    res.status(201).json(data);
  }
  async GetOne(req, res) {
    const id = req.params.productId;
    const data = await ReviewServices.GetOne(id);
    res.status(200).json(data);
  }
  async Delete(req, res) {
    const id = req.params.id;
    const data = await ReviewServices.DeleteReview(id);
    res.status(200).json(data);
  }
}
export default new ReviewController();
