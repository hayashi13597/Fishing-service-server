import AuthServices from "..";
import UserModel from "../../models/user.model";

import { DataResponse } from "../../middlewares";
import Util from "../../utils";
class UserService {
  async register(email, password) {
    // kiểm tra
    const isAccount = await UserModel.findOne({ where: { email } });

    if (isAccount) throw new Error("Email đã được đăng ký");

    // tạo token
    const [accessToken, refreshToken, passwordHash] = await Promise.all([
      AuthServices.genarationToken({ email: email }),
      AuthServices.genarationToken({ email: email }, false),
      AuthServices.genaratePassword(password),
    ]);

    // thềm vào database
    const account = await UserModel.create({
      email,
      password: passwordHash,
      accessToken,
      refreshToken,
    });

    // trả về
    return account;
  }
  async loginWithFirebase(uid, avatar, email, fullname) {
    email = email || `${uid}@gmail.com`;
    // kiểm tra
    const isAccount = await UserModel.findOne({
      where: { uid },
    });

    if (isAccount) return isAccount;

    // tạo token
    const [accessToken, refreshToken] = await Promise.all([
      AuthServices.genarationToken({ email }),
      AuthServices.genarationToken({ email }, false),
    ]);

    // thềm vào database
    const account = await UserModel.create({
      email,
      avatar,
      fullname,
      accessToken,
      uid,
      refreshToken,
    });
    delete account.password;

    // trả về
    return account;
  }

  async FirstLogin(accessToken) {
    // đăng nhập lần tiếp theo bằng token
    if (accessToken) {
      // check token có trong db ko
      let account = await UserModel.findOne({
        where: {
          accessToken,
        },
        plain: true,
      });
      account = Util.coverDataFromSelect(account);

      if (!account) {
        throw new Error("Không tồn tại token này!");
      } else if (account.visiable) {
        throw new Error("Tài khoản đã bị khóa");
      }

      const result = await AuthServices.checkToken(accessToken, true);

      switch (result.status) {
        case -1:
          /// token hết hạn
          const [accessToken, refreshToken] = await Promise.all([
            AuthServices.genarationToken({ email: account.email }),
            AuthServices.genarationToken({ email: account.email }, false),
          ]);
          account.accessToken = accessToken;
          account.refreshToken = refreshToken;
          UserModel.update(
            { refreshToken, accessToken },
            {
              where: {
                id: account.id,
              },
            }
          );
          break;
        case 0:
          // token này không chính xác
          throw new Error("Token không chính xác");

        case 1:
          // token còn hạn
          break;
        default:
          throw new Error(result.message);
      }

      delete account.password;
      return DataResponse(account, 200, "Xác thực đăng nhập thành công");
    }
    throw new Error("Tài khoản chưa đăng nhập");
  }
  async Login(email, password) {
    let account = await UserModel.findOne({
      where: { email },
    });
    account = Util.coverDataFromSelect(account);
    if (!account.password) {
      throw new Error("Tài khoản không tồn tại");
    }
    const isCheckPassword = await AuthServices.verifyHash(
      account.password,
      password
    );
    if (isCheckPassword) {
      return DataResponse(account, 200, "Đăng nhập thành công");
    } else {
      return DataResponse("", 400, "Mật khẩu không chính xác");
    }
  }
}
export default new UserService();
