import { DataResponse } from "../middlewares";

import RedisServer from "../redis/redis.config";
import CloudinaryServices from "../services/cloudinary.services";

import UserService from "../services/user/User.service";
import Util from "../utils";

class UserController {
  async RegisterAccount(req, res) {
    const { email, password, fullname } = req.body.data;
    if (!email || !password || !fullname) {
      throw new Error("Thiếu dữ liệu");
    }
    const account = await UserService.register(email, password, fullname);
    RedisServer.publish(
      "sendmailregister",
      JSON.stringify({ email, createdAt: Util.formatDate(account.createdAt) })
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
  async UpdateProfile(req, res) {
    const { address, phone, email, fullname, id } = req.body.data;

    if (address && phone && email && fullname && id) {
      const data = await UserService.UpdateProfile(id, {
        address,
        fullname,
        email,
        phone,
      });
      res.status(200).json(data);
    } else {
      throw new Error("Thiếu dữ liệu");
    }
  }
  async ChangePassword(req, res) {
    const { oldPassword, newPassword, id } = req.body.data;
    if (oldPassword && newPassword && id) {
      const data = await UserService.ChangePassword(id, {
        oldPassword,
        newPassword,
      });
      res.status(200).json(data);
    } else {
      throw new Error("Thiếu dữ liệu");
    }
  }
  async ChangeAvatar(req, res) {
    const file = req.file;
    const id = req.body.id;

    if (id && file) {
      const { path } = req.file;
      if (path) {
        const result = await CloudinaryServices.uploadImage(path);
        await CloudinaryServices.DeleteFileInServer(path);
        const data = await UserService.ChangeAvatar(
          id,
          result.url,
          result.path
        );
        res.status(200).json(data);
        return;
      }
      throw new Error("Ảnh không đạt yêu cầu");
    }
  }
  async ResetAvatar(req, res) {
    const { id } = req.body.data;
    if (id) {
      const data = await UserService.ChangeAvatar(
        id,
        "https://i.imgur.com/iOTWGLo.png",
        ""
      );
      res.status(200).json(data);
    } else {
      throw new Error("Thiếu dữ liệu");
    }
  }
  async DeleteUser(req, res) {
    const id = req.params.userid;
    if (id) {
      const data = await UserService.DeleteAccount(id);
      res.status(200).json(data);
    } else {
      throw new Error("Thiếu dữ liệu");
    }
  }
  async MissPassword(req, res) {
    const { email } = req.body.data;
    const info = await UserService.MissPassword(email);
    RedisServer.publish("misspassword", JSON.stringify(info));
    await RedisServer.set(email, info.code);
    await RedisServer.expire(email, 60 * 2);
    const data = DataResponse(
      "",
      200,
      "Vui lòng kiểm tra email để nhận mã xác thực"
    );

    res.status(200).json(data);
  }
  async CheckCodeMissPassword(req, res) {
    const { code, email } = req.body.data;
    const getCode = (await RedisServer.get(email)) || "";
    if (!getCode) {
      throw new Error("Mã đã hết hạn hoặc  không tồn tại");
    } else if (getCode == code) {
      const data = await UserService.VeryfiryOke(email);
      res.status(200).json(data);
      return;
    } else {
      throw new Error("Mã xác thực không chính xác");
    }
  }
}
export default new UserController();
