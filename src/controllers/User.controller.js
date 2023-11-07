import { DataResponse } from "../middlewares";

import RedisServer from "../redis/redis.config";
import MailService from "../services/mail.service";
import UserService from "../services/user/User.service";
import Util from "../utils";

class UserController {
  async register(req, res) {
    const { email, password } = req.body.data;

    if (!email || !password) {
      throw new Error("Thiếu dữ liệu");
    }
    const account = await UserService.register(email, password);

    RedisServer.publish(
      "sendmailregister",
      JSON.stringify({
        email: account.email,
        createdAt: Util.formatDate(account.createdAt),
      })
    );

    delete account.password;
    const data = DataResponse(account, 201, "Tạo tài khoản thành công");
    res.status(201).json(data);
  }
  async login(req, res) {
    const { email, password } = req.body.data;
    if (!email || !password) {
      throw new Error("Thiếu dữ liệu");
    }
    const data = await UserService.Login(email, password);
    res.status(200).json(data);
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
  async FirstLogin(req, res) {
    const [_, accessToken] = req.headers["authorization"].split(" ");
    const data = await UserService.FirstLogin(accessToken);
    res.status(200).json(data);
  }
}
export default new UserController();
