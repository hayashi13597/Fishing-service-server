import AuthServices from "..";
import UserModel from "../../models/user.model";

import { DataResponse } from "../../middlewares";
import Util from "../../utils";
import CloudinaryServices from "../cloudinary.services";
import casual from "casual";
import NoticeModal from "../../models/notice.model";
import { Op } from "sequelize";
import ProductModal from "../../models/product.model";
import EventModal from "../../models/event.model";
import OrderModal from "../../models/order.model";
import OrderDetailModal from "../../models/orderDetail.modal";
import CategoryModal from "../../models/cate.model";

export const CreateNotice = async (
  { title = "", content = "", receiver_id, user_id, isSee = true },
  link = ""
) => {
  return await NoticeModal.create({
    title,
    content,
    receiver_id,
    user_id,
    isSee,
    link,
  });
};
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
    let account = await UserModel.create({
      email,
      fullname,
      password: passwordHash,
      accessToken,
      refreshToken,
    });

    account = Util.coverDataFromSelect(account);

    await {
      title: "Thông báo đăng ký tài khoản",
      content:
        "Chúc mừng thành viên mới gia nhập vào câu lạc bộ câu cá Ốc đảo!",
      receiver_id: account.id,
      user_id: account.id,
      isSee: true,
    };

    const notices = await NoticeModal.findAll(
      {
        where: {
          receiver_id: {
            [Op.or]: [account.id, "all"],
          },
        },
      },
      { limit: 10, order: '"updatedAt" DESC' }
    );
    // trả về
    return {
      account,
      notices: notices,
    };
  }
  async loginWithFirebase(uid, avatar, email, fullname) {
    email = email || `${uid}@gmail.com`;
    // kiểm tra
    let account = await UserModel.findOne({
      where: { uid },
    });
    account = Util.coverDataFromSelect(account);

    if (account?.id) {
      const notices = await NoticeModal.findAll(
        {
          where: {
            user_id: {
              [Op.or]: [account.id, "all"],
            },
          },
        },
        { limit: 10, order: '"updatedAt" DESC' }
      );
      delete account.password;
      return { account, notices: notices };
    }

    // tạo token
    const [accessToken, refreshToken, password] = await Promise.all([
      AuthServices.genarationToken({ email }),
      AuthServices.genarationToken({ email }, false),
      AuthServices.genaratePassword("123456"),
    ]);

    // thềm vào database
    account = await UserModel.create({
      email,
      avatar,
      fullname,
      accessToken,
      uid,
      refreshToken,
      password,
    });
    account = Util.coverDataFromSelect(account);

    delete account.password;

    // trả về
    return { account, notices: [] };
  }

  async FirstLogin(accessToken) {
    // đăng nhập lần tiếp theo bằng token
    if (accessToken) {
      // check token có trong db ko
      let account = await UserModel.findOne({
        where: {
          accessToken,
        },
      });
      account = Util.coverDataFromSelect(account);

      if (!account) {
        throw new Error("Không tồn tại token này!");
      } else if (!account.visiable) {
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
      const notices = await NoticeModal.findAll(
        {
          where: {
            user_id: {
              [Op.or]: [account.id, "all"],
            },
          },
        },
        { limit: 10, order: '"updatedAt" DESC' }
      );
      return DataResponse(
        { account, notices },
        200,
        "Xác thực đăng nhập thành công"
      );
    }
    throw new Error("Tài khoản chưa đăng nhập");
  }
  async AdminLogin(email, password) {
    let account = await UserModel.findOne({
      where: {
        email,
      },
      $or: [
        {
          role: {
            $eq: "admin",
          },
        },
        {
          role: {
            $eq: "manager",
          },
        },
      ],
    });

    account = Util.coverDataFromSelect(account);

    if (!account || !account.password) {
      throw new Error("Yêu cầu đăng nhâp tài khoản quản trị viên");
    }
    if (account?.role == "member") {
      throw new Error("Bạn không phải là quản trị viên");
    }
    const isCheckPassword = await AuthServices.verifyHash(
      account.password,
      password
    );
    if (isCheckPassword) {
      return DataResponse(
        { account },
        200,
        "Đăng nhập  quản trị viên thành công"
      );
    } else {
      throw new Error("Mật khẩu không chính xác");
    }
  }
  async AdminFirstLogin(accessToken) {
    // đăng nhập lần tiếp theo bằng token
    if (accessToken) {
      // check token có trong db ko
      let account = await UserModel.findOne({
        where: {
          accessToken,
        },
        $or: [
          {
            role: {
              $eq: "admin",
            },
          },
          {
            role: {
              $eq: "manager",
            },
          },
        ],
      });
      account = Util.coverDataFromSelect(account);

      if (!account) {
        throw new Error("Vui lòng đăng nhập tài khoản admin");
      } else if (!account.visiable) {
        throw new Error("Tài khoản đã bị khóa");
      } else if (account.role == "member") {
        throw new Error("Bạn không phải là quản trị viên");
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

      return DataResponse(
        { account },
        200,
        "Xác thực đăng nhập admin thành công"
      );
    }
    throw new Error("Tài khoản chưa đăng nhập");
  }
  async Login(email, password) {
    let account = await UserModel.findOne({
      where: { email },
    });

    account = Util.coverDataFromSelect(account);
    if (!account.visiable) {
      throw new Error("Tài khoản đã bị khóa");
    } else if (!account || !account.password) {
      throw new Error("Tài khoản không tồn tại");
    }
    const isCheckPassword = await AuthServices.verifyHash(
      account.password,
      password
    );
    if (isCheckPassword) {
      const notices = await NoticeModal.findAll(
        {
          where: {
            user_id: {
              [Op.or]: [account.id, "all"],
            },
          },
        },
        { limit: 10, order: '"updatedAt" DESC' }
      );
      return DataResponse({ account, notices }, 200, "Đăng nhập thành công");
    } else {
      throw new Error("Mật khẩu không chính xác");
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

  async MissPassword(email) {
    let account = await UserModel.findOne({
      where: { email },
    });
    account = Util.coverDataFromSelect(account);
    if (account.uid) {
      throw new Error("Chỉ chấp nhận đổi mật khẩu khi đăng ký bằng biểu mẫu");
    } else if (account?.id) {
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
  async ResetPassword(id) {
    let account = await UserModel.findByPk(id);
    account = Util.coverDataFromSelect(account);
    if (!account?.id) {
      throw new Error("Không tìm thấy tài khoảng");
    }
    const password = await AuthServices.genaratePassword("123456");
    await UserModel.update(
      { password },
      {
        where: {
          id,
        },
      }
    );
    return DataResponse({}, 200, "Đặt mật khẩu mới thành công");
  }
  async AdminScreenDashboard() {
    let listOrderSuccess = await OrderModal.findAll({
      where: {
        status: "s4",
      },
      attributes: ["id", "discount", "shipping_fee"],
    });

    const FindOrderDetail = listOrderSuccess.map((item) => item.id);

    const [
      totalViewProduct,
      totalViewNew,
      listProductSellFinish,
      totalProduct,
      totalAccount,
      listProductSelltop,
      listProductNew,
      listAccountNew,
    ] = await Promise.all([
      ProductModal.sum("view"),
      EventModal.sum("views"),
      OrderDetailModal.findAll({
        where: { order_id: FindOrderDetail },
        attributes: ["quantity", "price", "order_id"],
      }),
      ProductModal.count(),
      UserModel.count(),
      ProductModal.findAll({
        order: [["sales", "DESC"]],
        attributes: ["name", "imageUrl", "price", "sales", "view"],

        limit: 5,
      }),
      ProductModal.findAll({
        order: [["createdAt", "DESC"]],
        attributes: ["name", "imageUrl", "price", "sales", "view"],

        limit: 5,
      }),
      UserModel.findAll({
        order: [["createdAt", "DESC"]],
        limit: 5,

        where: {
          role: {
            [Op.not]: "member",
          },
        },
        attributes: ["role", "email", "uid", "fullname", "visiable"],
      }),
    ]);

    return DataResponse(
      {
        totalViewProduct,
        totalViewNew,
        listProductSellFinish,
        totalProduct,
        totalAccount,
        listProductSelltop,
        listProductNew,
        listAccountNew,
        listOrderSuccess,
      },
      200,
      "Lấy thành công danh sách sản phẩm cho trang quản trị"
    );
  }
  async DeleteAccount(id) {
    await Promise.all([
      NoticeModal.destroy({
        where: {
          user_id: id,
        },
      }),
    ]);
    const account = await UserModel.destroy({
      where: {
        id,
      },
    });

    return DataResponse("account", 200, "Xóa Thành công");
  }
  async Search(text) {
    const listAccounts = await UserModel.findAll({
      where: {
        [Op.or]: {
          email: {
            [Op.substring]: text,
          },
          fullname: {
            [Op.substring]: text,
          },
          role: {
            [Op.substring]: text,
          },
        },
      },

      order: [["updatedAt", "DESC"]],
      limit: 10,
    });

    return DataResponse(
      { users: listAccounts },
      200,
      "Tìm kiếm  tài khoản thành công"
    );
  }
}

export default new UserService();
