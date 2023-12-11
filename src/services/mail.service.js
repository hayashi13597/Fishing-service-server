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
const EmailSend = process.env.NODEMAILER_USERNAME || "namph2102@gmail.com";
class MailService {
  async register(email, createdAt) {
    const info = await transporter
      .sendMail({
        from: `"${EmailSend} 👻" <${EmailSend}>`, //Địa chỉ gửi
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
          <li>Thời gian tạo: <strong> ${createdAt}</strong></li>
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
         <hr style="height: 3px; width: 100%; background-color: black;">
        <div>
          <p>Trân trọng,</p>
          <p>Nguyễn Quốc Trường</p>
          <p>Hồ câu cá Ốc đảo kỳ đà</p>
          <p>Địa chỉ email liên hệ: ${EmailSend}</p>
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
        from: `"${EmailSend} 👻" <${EmailSend}>`, //Địa chỉ gửi
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
         <hr style="height: 3px; width: 100%; background-color: black;">
        <div>
          <p>Trân trọng,</p>
          <p>Nguyễn Quốc Trường</p>
          <p>Hồ câu cá Ốc đảo kỳ đà</p>
          <p>Địa chỉ email liên hệ: ${EmailSend}</p>
          <p>Số điện thoại liên hệ: 0347.088.538</p>
        </div>
      </div>`, // Nội dung trong Email Dạng inline style
      })
      .catch((err) => {
        throw new Error(err);
      });

    console.log("Message sent: %s", info.messageId); //  Đả gửi mail nhận mật khẩu
  }
  async FormContact(email, fullname, phone) {
    const info = await transporter
      .sendMail({
        from: `"${EmailSend} 👻" <${EmailSend}>`, //Địa chỉ gửi
        to: `${email}`, //  danh sách người nhận
        subject: "Chúng tôi sẽ trả lời  liên hệ cho bạn sớm nhất ✔", // Tiêu đề
        text: "Hello world?", // plain text body
        html: `
         <h1>Lời cảm ơn đến ${fullname}</h1>
     
        <p>
        Chúng tôi cảm ơn bạn đã liên hệ tại trang website của chúng tôi!</p>
        </p>
        <br />
        <p>Thông tin liên hệ của bạn:</p>
        <ul>
          <li>Họ và tên: <strong> ${email}</strong></li>
          <li>Số điện thoại: <strong> ${phone}</strong></li>
          <li>Thời gian liên hệ: <strong> ${Util.formatDate(
            new Date(Date.now()).toISOString()
          )}</strong></li>
        </ul>
        <br />
        <p>
          Chúng tôi đọc liên hệ bạn torng thời gian sớm nhất! Nếu có việc gì gấp vui lòng gọi đường dây nóng
        </p>
 
        <p>
          Chúc bạn có một thời gian thú vị và hạnh phúc khi sử dụng tài khoản của
          mình để mua sắp và nhận giảm giá hàng tháng trên nền tảng của chúng tôi!
        </p>
        <hr style="height: 3px; width: 100%; background-color: black;">
        <div>
          <p>Trân trọng,</p>
          <p>Nguyễn Quốc Trường</p>
          <p>Hồ câu cá Ốc đảo kỳ đà</p>
          <p>Địa chỉ email liên hệ: ${EmailSend}</p>
          <p>Số điện thoại liên hệ: 0347.088.538</p>
        </div>
      </div>`, // Nội dung trong Email Dạng inline style
      })
      .catch((err) => {
        throw new Error(err);
      });

    console.log("Message sent: %s", info.messageId);
  }
  async MailContact(email, title, content) {
    const info = await transporter
      .sendMail({
        from: `"${EmailSend} 👻" <${EmailSend}>`, //Địa chỉ gửi
        to: `${email}`, //  danh sách người nhận
        subject: `${title} ✔`, // Tiêu đề
        text: "Thư liên hệ", // plain text body
        html: `
         ${content}

        <hr style="height: 3px; width: 100%; background-color: black;">
        <div>
          <p>Trân trọng,</p>
          <p>Nguyễn Quốc Trường</p>
          <p>Hồ câu cá Ốc đảo kỳ đà</p>
          <p>Địa chỉ email liên hệ: ${EmailSend}</p>
          <p>Số điện thoại liên hệ: 0347.088.538</p>
        </div>
      </div>`, // Nội dung trong Email Dạng inline style
      })
      .catch((err) => {
        throw new Error(err);
      });

    console.log("Message sent: %s", info.messageId);
  }
  async Order(
    listProduct = [],
    email,
    total,
    address,
    payment_method,
    shipping_fee,
    code
  ) {
    const info = await transporter
      .sendMail({
        from: `"${EmailSend} 👻" <${EmailSend}>`, //Địa chỉ gửi
        to: `${email}`, //  danh sách người nhận
        subject: `Đơn hàng chi tiết của bạn `, // Tiêu đề
        text: "Thư liên hệ", // plain text body
        html: ` <div
      style="
        max-width: 600px;
        margin: 20px auto;
        background-color: #fff;
        padding: 20px;
        border-radius: 8px;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
      "
    >

      <h2 style="text-align: center;">Hóa Đơn Chi Tiết - #${code}</h2
      <table style="width: 100%; border-collapse: collapse; margin-top: 20px">
        <thead>
          <tr>
            <th
              colspan="2"
              style="
                background-color: #f2f2f2;
                border: 1px solid #ddd;
                padding: 12px;
                text-align: center;
              "
            >
              Sản phẩm
            </th>
            <th
              style="
                background-color: #f2f2f2;
                border: 1px solid #ddd;
                padding: 12px;
                text-align: left;
              "
            >
              Số lượng
            </th>
            <th
              style="
                background-color: #f2f2f2;
                border: 1px solid #ddd;
                padding: 12px;
                text-align: left;
              "
            >
              Đơn Giá
            </th>
            <th
              style="
                background-color: #f2f2f2;
                border: 1px solid #ddd;
                padding: 12px;
                text-align: left;
              "
            >
              Tổng Cộng 
            </th>
          </tr>
        </thead>
        <tbody>
        ${listProduct
          .map(
            (item) => ` <tr>
            <td style="border: 1px solid #ddd; padding: 12px; text-align: left">
              <img
                width="30"
                height="30"
                style="object-fit: cover"
                src="${item.imageUrl}"
                alt=""
              />
            </td>
            <td style="border: 1px solid #ddd; padding: 12px; text-align: left">
             ${item.name}
            </td>

            <td style="border: 1px solid #ddd; padding: 12px; text-align: left">
               ${item.quantity}
            </td>
            <td style="border: 1px solid #ddd; padding: 12px; text-align: left">
               ${formatMoney(item.price)}
            </td>
            <td style="border: 1px solid #ddd; padding: 12px; text-align: left">
              ${formatMoney(item.quantity * item.price)}
            </td>
          </tr>`
          )
          .join("")}
         
      
        </tbody>
      </table>

      <p style="font-weight: bold">Tổng cộng:   ${formatMoney(total)}</p>

      <div style="margin-top: 20px">
        <p>Phương thức thanh toán: ${payment_method}</p>
        <p>Phí vận chuyển: ${formatMoney(shipping_fee)}</p>
        <p>Địa chỉ: ${address}</p>
      </div>

      <footer style="margin-top: 20px; text-align: center; color: #888">
        Cảm ơn bạn đã sử dụng dịch vụ của chúng tôi. <br />
      </footer>
      <div>
        <p>Trân trọng,</p>
        <p>Nguyễn Quốc Trường</p>
        <p>Hồ câu cá Ốc đảo kỳ đà</p>
        <p>Địa chỉ email liên hệ: ${EmailSend}</p>
        <p>Số điện thoại liên hệ: 0347.088.538</p>
      </div>
    </div>`,
      })
      .catch((err) => {
        throw new Error(err);
      });

    console.log("Message sent: %s", info.messageId);
  }
}

function formatMoney(price) {
  if (isNaN(price)) {
    return price;
  }
  return (
    Math.floor(price)
      .toString()
      .replace(/\B(?=(\d{3})+(?!\d))/g, ",") + "đ"
  );
}
export default new MailService();
