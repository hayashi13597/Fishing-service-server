import contactServices from "../services/contact/contact.services";
import RedisServer from "../redis/redis.config";
class Contactcontroller {
  async Create(req, res) {
    const { fullname, email, content, phone } = req.body.data;
    if (fullname && email && content) {
      const data = await contactServices.Create({
        fullname,
        email,
        content,
        phone,
      });
      RedisServer.publish(
        "formcontact",
        JSON.stringify({ email, fullname, phone })
      );
      return res.status(201).json(data);
    } else {
      throw new Error("Dữ liệu thiếu");
    }
  }
  async GetAll(req, res) {
    const data = await contactServices.GetAll();
    return res.status(200).json(data);
  }
  async Delete(req, res) {
    const id = req.params.id;
    const data = await contactServices.Delete(id);
    return res.status(200).json(data);
  }
}
export default new Contactcontroller();
