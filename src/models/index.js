const { Sequelize } = require("sequelize");
const sequelize = new Sequelize("fishing", "root", null, {
  host: "localhost",
  dialect: "mysql",
  timezone: "+07:00",

  port: process.env.PORT_XAMMP || 3325,
  logging: true,

  // host: "viaduct.proxy.rlwy.net",
  // dialect: "mysql",
  // timezone: "+07:00",
  // username: "root",
  // password: "EA-53aCCG4Eb3FFE431D5b1H14de3dB4",
  // database: "railway",
  // port: 14107,
  // logging: true,
});
async function connectDataBase() {
  try {
    await sequelize.authenticate();
    console.log("Connection has been established successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
}
connectDataBase();
export default sequelize;
