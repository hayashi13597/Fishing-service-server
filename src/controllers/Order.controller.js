import OrderServices from "../services/order/order.services";

class OrderController {
  async GetListOrderClient(req, res) {
    const { id } = req.params;
    const data = await OrderServices.GetListOrderClient(id);
    res.status(200).json(data);
  }
  async GetAllOrderAdmin(req, res) {
    const data = await OrderServices.GetAllOrderAdmin(id);
    res.status(200).json(data);
  }
  async GetOrderDetail(req, res) {
    //post
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
    const { id } = req.params;
    const data = await OrderServices.DeleteOrder(id);
    res.status(200).json(data);
  }
  async DeleteOrderDetails(req, res) {
    const { id } = req.params;
    const data = await OrderServices.DeleteOrderDetails(id);
    res.status(200).json(data);
  }
}
export default new OrderController();
