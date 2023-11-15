"use strict";

import Util from "../utils";

const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.NODEMAILER_USERNAME || "namph2102@gmail.com",
    pass: process.env.NODEMAILER_PASSWORD || "tatvcdfftwrtwzwb",
  },
});
class MailService {
  async register(email, createdAt) {
    const info = await transporter
      .sendMail({
        from: `"${email} 👻" <adminocdao@gmail.com>`, //Địa chỉ gửi
        to: `${email}`, //  danh sách người nhận
        subject: "Chúc mừng thành viên mới ✔", // Tiêu đề
        text: "Hello world?", // plain text body
        html: ` <div>
        <h1>Xin chào <strong>thành viên mới</strong></h1>
        <br />
        <p>
          Chúng tôi xin gửi lời chúc mừng đến bạn về việc tạo tài khoản thành công
          trên nền tảng của chúng tôi. Chúc mừng bạn đã tham gia vào cộng đồng của
          chúng tôi!
        </p>
        <br />
        <p>Thông tin tài khoản của bạn:</p>
        <ul>
          <li>Tài khoản: <strong> ${email}</strong></li>
          <li>Ngày tạo: <strong> ${createdAt}</strong></li>
        </ul>
        <br />
        <p>
          Chúng tôi rất vui mừng khi bạn đã quyết định tham gia cùng chúng tôi và
          chúng tôi tin rằng bạn sẽ có những trải nghiệm thú vị và bổ ích tại đây.
        </p>
        <br />
        <p>
          Chúc bạn có một thời gian thú vị và hạnh phúc khi sử dụng tài khoản của
          mình để mua sắp và nhận giảm giá hàng tháng trên nền tảng của chúng tôi!
        </p>
        <div>
          <p>Trân trọng,</p>
          <p>Nguyễn Quốc Trường</p>
          <p>Hồ câu cá Ốc đảo kỳ đà</p>
          <p>Địa chỉ email liên hệ: adminocdao@gmail.com</p>
          <p>Số điện thoại liên hệ: 0347.088.538</p>
        </div>
      </div>`, // Nội dung trong Email Dạng inline style
      })
      .catch((err) => {
        throw new Error(err);
      });

    console.log("Message sent: %s", info.messageId); // nếu trả ra id là bạn gửi dúng rồi
  }
  async missPssword(email, code) {
    const info = await transporter
      .sendMail({
        from: `"${email} 👻" <adminocdao@gmail.com>`, //Địa chỉ gửi
        to: `${email}`, //  danh sách người nhận
        subject: "Mã xác nhận đổi mật khẩu ✔", // Tiêu đề
        text: "Hello world?", // plain text body
        html: ` <div>
        <h3>Mã Xác nhận của bạn có hiệu lực <strong>2 phút</strong></h3>
        <br />
        <p>
            Vui lòng không cung mã xác thực cho bất kỳ ai!
            Lưu ý: Xác thực thành công thì mật khẩu sẽ là 123456
        </p>
        <br />
          <div style="display: flex">
        <div
          style="
            margin: auto;
            background-color: green;
            padding: 8px 16px;
            border-radius: 20px;
            font-size: 22px;
            color: white;
            letter-spacing: 3px;
          "
        >
          ${code}
        </div>
      </div>
        <ul>
          <li>Tài khoản: <strong> ${email}</strong></li>
          <li>Thời gian tạo: <strong> ${Util.formatDate(
            new Date(Date.now()).toISOString()
          )}</strong></li>
        </ul>
        <br />
      
        <p>
          Chúc bạn một ngày vui vẻ nhé!
        </p>
        <div>
          <p>Trân trọng,</p>
          <p>Nguyễn Quốc Trường</p>
          <p>Hồ câu cá Ốc đảo kỳ đà</p>
          <p>Địa chỉ email liên hệ: adminocdao@gmail.com</p>
          <p>Số điện thoại liên hệ: 0347.088.538</p>
        </div>
      </div>`, // Nội dung trong Email Dạng inline style
      })
      .catch((err) => {
        throw new Error(err);
      });

    console.log("Message sent: %s", info.messageId); //  Đả gửi mail nhận mật khẩu
  }
}

export default new MailService();
