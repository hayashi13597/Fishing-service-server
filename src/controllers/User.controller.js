import { DataResponse } from "../middlewares";
import UserModel from "../models/user.model";

import RedisServer from "../redis/redis.config";
import CloudinaryServices from "../services/cloudinary.services";

import UserService from "../services/user/User.service";
import Util from "../utils";

class UserController {
  async AdminLogin(req, res) {
    const { email, password } = req.body.data;
    if (!email || !password) {
      throw new Error("Thiếu trường dữ liệu");
    }
    const data = await UserService.AdminLogin(email, password);

    res.status(200).json(data);
  }
  async GeAllUserDashboard(req, res) {
    const accounts = await UserModel.findAll({
      attributes: [
        "id",
        "email",
        "fullname",
        "avatar",
        "role",
        "visiable",
        "createdAt",
        "updatedAt",
        "address",
      ],
      order: [["createdAt", "DESC"]],
    });
    const data = DataResponse(
      { accounts: accounts },
      200,
      "Lấy danh sách tài khoảng"
    );
    res.status(201).json(data);
  }
  async ResetPassword(req, res) {
    const { id } = req.body.data;
    const data = await UserService.ResetPassword(id);
    res.status(200).json(data);
  }
  async EditUserAdminProfile(req, res) {
    const { id, ...profile } = req.body.data;
    if (!id) throw new Error("Cập nhập hồ sơ thất bại");

    await UserService.UpdateProfile(id, profile);

    const data = DataResponse({}, 200, "Cập nhập hồ sơ thành công");
    res.status(200).json(data);
  }
  async RegisterAccount(req, res) {
    const { email, password, fullname } = req.body.data;
    if (!email || !password || !fullname) {
      throw new Error("Thiếu dữ liệu");
    }
    const data = await UserService.register(email, password, fullname);
    RedisServer.publish(
      "sendmailregister",
      JSON.stringify({
        email,
        createdAt: Util.formatDate(data.account.createdAt),
      })
    );
    delete data.account.password;

    const dataReponsive = DataResponse(data, 201, "Tạo tài khoản thành công");

    res.status(201).json(dataReponsive);
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
  async FirstLoginAdmin(req, res) {
    const [_, accessToken] = req.headers["authorization"].split(" ");
    const data = await UserService.AdminFirstLogin(accessToken);
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
  async DeleteUser(req, res) {
    const id = req.params.userid;
    if (id) {
      const data = await UserService.DeleteAccount(id);
      res.status(200).json(data);
    } else {
      throw new Error("Thiếu dữ liệu");
    }
  }
  async AdminScreenDashboard(req, res) {
    const data = await UserService.AdminScreenDashboard();
    res.status(200).json(data);
  }
  async Search(req, res) {
    const { search } = req.body.data;
    const data = await UserService.Search(search);
    res.status(200).json(data);
  }
}
export default new UserController();
