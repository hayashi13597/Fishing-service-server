import { createClient } from "redis";
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
  subscriber.subscribe("sendmail", (message, channel) => {
    console.log(`message: ${message} with channel: ${channel}`);
  });
})();
