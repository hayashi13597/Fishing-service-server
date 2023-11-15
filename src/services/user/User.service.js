import AuthServices from "..";
import UserModel from "../../models/user.model";

import { DataResponse } from "../../middlewares";
import Util from "../../utils";
import CloudinaryServices from "../cloudinary.services";
import casual from "casual";
class UserService {
  async register(email, password, fullname) {
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
      fullname,
      password: passwordHash,
      accessToken,
      refreshToken,
    });

    // trả về
    return Util.coverDataFromSelect(account);
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

    if (!account || !account.password) {
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
  async UpdateProfile(id, profiledata) {
    const account = await UserModel.update(profiledata, {
      where: {
        id,
      },
    });

    return DataResponse(account, 200, "Cập nhập hồ sơ thành công");
  }
  async ChangePassword(id, { oldPassword, newPassword }) {
    let account = await UserModel.findOne({
      where: {
        id,
      },
    });
    account = Util.coverDataFromSelect(account);
    const isMatch = await AuthServices.verifyHash(
      account.password,
      oldPassword
    );
    if (!isMatch) {
      throw new Error("Mật khẩu cũ chưa chính xác");
    } else {
      const newPasswordHash = await AuthServices.genaratePassword(newPassword);
      account = await UserModel.update(
        { password: newPasswordHash },
        {
          where: {
            id,
          },
        }
      );
      return DataResponse(account, 200, "Cập nhập mật khẩu thành công");
    }
  }
  async ChangeAvatar(id, imageUrl, idPath = "") {
    let account = await UserModel.findOne({
      where: {
        id,
      },
    });
    account = Util.coverDataFromSelect(account);
    if (account?.idPath) {
      CloudinaryServices.deleteFileImage(account.idPath);
    }
    await UserModel.update(
      { avatar: imageUrl, idPath },
      {
        where: {
          id,
        },
      }
    );
    return DataResponse(
      { avatar: imageUrl },
      200,
      "Cập nhập ảnh đại diện thành công"
    );
  }
  async DeleteAccount(id) {
    const account = await UserModel.destroy({
      where: {
        id,
      },
    });
    console.log("account bị xóa", account);
    return DataResponse("account", 200, "Xóa Thành công");
  }
  async MissPassword(email) {
    let account = await UserModel.findOne({
      where: { email },
    });
    account = Util.coverDataFromSelect(account);
    if (account?.id) {
      const code = casual.integer(100000, 999999);
      return {
        email,
        code,
      };
    }
    throw new Error("Tài khoảng không tồn tại trên hệ thống");
  }
  async VeryfiryOke(email) {
    const password = await AuthServices.verifyHash("123456");
    let account = await UserModel.update(
      { password },
      {
        where: {
          email,
        },
      }
    );
    const [isOke] = account;
    if (!isOke) {
      throw new Error("Tài khoản không tồn tại");
    }
    account = await UserModel.findOne({
      where: {
        email,
      },
    });
    return DataResponse(account, 200, "Mật khẩu mới sẽ là `123456`");
  }
}

export default new UserService();
