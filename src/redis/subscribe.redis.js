import { createClient } from "redis";
import MailService from "../services/mail.service";

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
    console.log(`message: ${message} with channel: ${channel}`);
  });

  subscriber.subscribe("misspassword", async (message, channel) => {
    console.log(`message: ${message} with channel: ${channel}`);
    const { email, code } = JSON.parse(message);
    await MailService.missPssword(email, code);
  });

  subscriber.subscribe("sendmailregister", async (message, channel) => {
    console.log("--------------------------------");

    const { email, createdAt } = JSON.parse(message);
    console.log("--------------------------------");

    console.log(email, createdAt);
    await MailService.register(email, createdAt);
    console.log(`message: ${message} with channel: ${channel}`);
  });

  subscriber.subscribe("formcontact", async (message, channel) => {
    console.log("--------------------------------");

    const { email, fullname, phone } = JSON.parse(message);
    console.log("--------------------------------");

    await MailService.FormContact(email, fullname, phone);
    console.log(`message: ${message} with channel: ${channel}`);
  });
})();
