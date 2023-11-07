import AuthServices from "..";
import UserModel from "../../models/user.model";

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
    delete account.password;

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
}
export default new UserService();
