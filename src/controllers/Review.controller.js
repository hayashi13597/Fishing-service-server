import ReviewServices from "../services/review/review.services";

class ReviewController {
  async GetAll(req, res) {
    const { limit = 5, skip = 0 } = req.query;
    const data = await ReviewServices.GetAll(limit, skip);
    res.status(200).json(data);
  }

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
  async HandleEvaluate(req, res) {
    const { id, star, content, idProduct } = req.body.data;
    const data = await ReviewServices.HandleEvaluate(
      id,
      idProduct,
      star,
      content
    );
    res.status(201).json(data);
  }
  async GetOne(req, res) {
    const id = req.params.productId;
    const { limit = 6, skip = 0, star = "all" } = req.query;
    const data = await ReviewServices.GetOne(
      id,
      star,
      parseInt(limit),
      parseInt(skip)
    );
    res.status(200).json(data);
  }
  async Delete(req, res) {
    const id = req.params.id;
    const data = await ReviewServices.DeleteReview(id);
    res.status(200).json(data);
  }
  async GetOrderReviews(req, res) {
    const { id, limit = 6, skip = 0 } = req.body.data;
    const data = await ReviewServices.GetDetailListReview(id, limit, skip);
    res.status(200).json(data);
  }
}
export default new ReviewController();
