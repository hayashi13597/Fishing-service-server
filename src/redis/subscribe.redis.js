import { createClient } from "redis";
import MailService from "../services/mail.service";
import { Logger } from "../middlewares";

const subscriber = createClient({
  password: "uVP2uQwxrDZVVPbcwWXY5aumdYezo5QM",
  socket: {
    host: "redis-13027.c292.ap-southeast-1-1.ec2.cloud.redislabs.com",
    port: 13027,
  },
});
(async () => {
  await subscriber.connect();
  subscriber.subscribe("order", (message, channel) => {
    Logger(`message: ${message} with channel: ${channel}`);
  });

  subscriber.subscribe("misspassword", async (message, channel) => {
    Logger(`message: ${message} with channel: ${channel}`);
    const { email, code } = JSON.parse(message);
    await MailService.missPssword(email, code);
  });

  subscriber.subscribe("sendmailregister", async (message, channel) => {
    const { email, createdAt } = JSON.parse(message);
    await MailService.register(email, createdAt);
    Logger(`message: ${message} with channel: ${channel}`);
  });

  subscriber.subscribe("formcontact", async (message, channel) => {
    const { email, fullname, phone } = JSON.parse(message);
    await MailService.FormContact(email, fullname, phone);
    Logger(`message: ${message} with channel: ${channel}`);
  });
  subscriber.subscribe("SendContentContact", async (message, channel) => {
    const { email, title = "Trả lời liên hệ", content } = JSON.parse(message);
    await MailService.MailContact(email, title, content);
    Logger(`message: ${message} with channel: ${channel}`);
  });
  subscriber.subscribe("order", async (message, channel) => {
    const {
      listProduct = [],
      email,
      total,
      address,
      payment_method,
      shipping_fee,
      code,
    } = JSON.parse(message);
    await MailService.Order(
      listProduct,
      email,
      total,
      address,
      payment_method,
      shipping_fee,
      code
    );
    Logger(` with channel: ${channel}`);
  });
})();
