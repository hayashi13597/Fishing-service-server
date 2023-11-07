import UserModel from "../../models/user.model.js";
import Util from "../../utils/index.js";

class AccuracyPerson {
  async Authentication(req, res, next) {
    try {
      const [_, accessToken] = req.headers["authorization"].split(" ");

      if (accessToken) {
        // check token có trong db ko
        let account = await UserModel.findOne({
          where: {
            accessToken,
          },
        });
        account = Util.coverDataFromSelect(account);
        if (account.id) {
          next();
        } else {
          throw new Error("Bạn không thể sử dụng quyền này");
        }
      } else {
        throw new Error("Bạn không thể sử dụng quyền này");
      }
    } catch (err) {
      console.log(err.message);
    }
  }
  async Authorization(req, res, next) {
    try {
      const [_, accessToken] = req.headers["authorization"].split(" ");

      if (accessToken) {
        // check token có trong db ko
        const account = await UserModel.findOne({
          accessToken,
          blocked: false,
        });

        if (account && account.permission !== "member") {
          next();
        }
      }
    } catch (err) {
      console.log("Bạn ko phải là quản trị viên");
      console.log(err.message);
    }
  }
}
export default new Authentication();
