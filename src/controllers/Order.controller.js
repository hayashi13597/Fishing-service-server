import OrderServices from "../services/order/order.services";

class OrderController {
  async GetListOrderClient(req, res) {
    const { id, limit, skip } = req.query;
    const data = await OrderServices.GetListOrderClient(id, limit, skip);
    res.status(200).json(data);
  }
  async GetAllOrderAdmin(req, res) {
    const { limit = 5, skip = 0 } = req.query;
    const data = await OrderServices.GetAllOrderAdmin(
      parseInt(limit),
      parseInt(skip)
    );
    res.status(200).json(data);
  }
  async Edit(req, res) {
    const { id, ...orderUpdate } = req.body.data;
    const data = await OrderServices.EditOrder(id, orderUpdate);
    res.status(200).json(data);
  }
  async GetOrderDetail(req, res) {
    const { order_id } = req.body.data;
    const data = await OrderServices.GetOrderDetail(order_id);
    res.status(200).json(data);
  }
  async CreateOrder(req, res) {
    const { order, order_detail } = req.body;
    const data = await OrderServices.CreateOrder(order, order_detail);
    res.status(201).json(data);
  }
  async DeleteOrder(req, res) {
    imageUrl;
    const { id } = req.params;
    const data = await OrderServices.DeleteOrder(id);
    res.status(200).json(data);
  }

  async DeleteOrderDetails(req, res) {
    const { id } = req.params;
    const data = await OrderServices.DeleteOrderDetails(id);
    res.status(200).json(data);
  }
  async Search(req, res) {
    const { search } = req.body.data;
    const data = await OrderServices.Search(search);
    res.status(200).json(data);
  }
}
export default new OrderController();
