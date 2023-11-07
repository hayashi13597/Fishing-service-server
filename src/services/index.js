import jwt from "jsonwebtoken";
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
    return jwt.sign(
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
