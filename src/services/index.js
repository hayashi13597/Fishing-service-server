import pkg from "jsonwebtoken";
const { sign, verify } = pkg;
import argon from "argon2";
const expiresIn_Time = "3d";
/*
options:{
    userName:"",
    fullName:"",
}
*/
class AuthServices {
  genarationToken(options, accessToken = true) {
    return sign(
      options,
      process.env[accessToken ? "ACCESS_TOKEN" : "REFRESH_TOKEN"],
      { expiresIn: accessToken ? expiresIn_Time : "10d" }
    );
  }
  verifyToken(token, options, accessToken = true) {
    return jwt.verify(
      token,
      process.env[accessToken ? "ACCESS_TOKEN" : "REFRESH_TOKEN"],
      options
    );
  }
  checkToken(token, isAccesToken = true) {
    return verify(
      token,
      process.env[isAccesToken ? "ACCESS_TOKEN" : "REFRESH_TOKEN"],
      (err, decoded) => {
        if (err) {
          console.log("err", err);
          if (err.message.includes("jwt expired"))
            return { message: "Token hết hạn", status: -1 };
          return { message: err.message, status: 0 };
        }
        return { message: "token chính xác", status: 1, ...decoded };
      }
    );
  }
  async genaratePassword(data) {
    try {
      return await argon.hash(data);
    } catch (error) {
      return false;
    }
  }
  async verifyHash(dataHash, data) {
    try {
      return await argon.verify(dataHash, data);
    } catch {
      return false;
    }
  }
}

export default new AuthServices();
