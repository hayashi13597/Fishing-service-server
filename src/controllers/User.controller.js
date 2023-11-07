import { DataResponse } from "../middlewares";
import db from "../models";
import UserModel from "../models/user.model";
import RedisServer from "../redis/redis.config";
import MailService from "../services/mail.service";
import UserService from "../services/user/User.service";

class UserController {
  async register(req, res) {
    const { email, password } = req.body.data;

    if (!email || !password) {
      throw new Error("Thiếu dữ liệu");
    }
    const account = await UserService.register(email, password);
    // const time = new Date().getTime();
    // await MailService.login();

    // RedisServer.publish("order", "Bạn đặt hàng thành công");
    // RedisServer.publish("sendmail", "Gửi mail thành công");
    const data = DataResponse(account, 201, "Tạo tài khoản thành công");
    res.status(201).json(data);
  }
  async LoginWithFirebase(req, res) {
    const { uid, avatar, email, fullname } = req.body.data;

    if (!fullname || !avatar || !uid) {
      throw new Error("Thiếu dữ liệu");
    }
    const account = await UserService.loginWithFirebase(
      uid,
      avatar,
      email,
      fullname
    );

    const data = DataResponse(account, 200, "Đăng nhập thành công");
    res.status(200).json(data);
  }
}
export default new UserController();
