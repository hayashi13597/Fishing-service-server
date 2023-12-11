import UserModel from "../../models/user.model.js";
import Util from "../../utils/index.js";
import { Logger } from "../index.js";

class AccuracyPerson {
  async Authentication(req, res, next) {
    Logger("Đang tiến hành xác thực người dùng");
    try {
      const [_, accessToken] = req.headers["authorization"]?.split(" ") || [
        "",
        "",
      ];

      if (accessToken) {
        // check token có trong db ko
        let account = await UserModel.findOne({
          where: {
            accessToken,
          },
        });
        account = Util.coverDataFromSelect(account);
        if (!account.visiable) {
          throw new Error("Tài khoản đã bị khóa");
        } else if (account.id) {
          next();
          return;
        } else {
          throw new Error("Bạn không thể sử dụng quyền này");
        }
      }
      throw new Error("Xác thực tài khoản thất bại");
    } catch (err) {
      throw new Error(err.message);
    }
  }
  async Authorization(req, res, next) {
    Logger("Đang tiến hành xác thực quản trị viên");
    try {
      const [_, accessToken] = req.headers["authorization"]?.split(" ") || [
        "",
        "",
      ];

      if (accessToken) {
        // check token có trong db ko
        let account = await UserModel.findOne({
          where: {
            accessToken,
          },
        });
        account = Util.coverDataFromSelect(account);
        if (!account.visiable) {
          throw new Error("Tài khoản bị khóa");
        } else if (account && account.permission !== "member") {
          next();
          return;
        }
      }
      throw new Error("Xác thực là quản trị viên thất bại");
    } catch (err) {
      Logger("Bạn ko phải là quản trị viên");
      throw new Error(err.message);
    }
  }
}
export default new AccuracyPerson();
