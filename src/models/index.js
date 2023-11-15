require("dotenv").config();
const { Sequelize } = require("sequelize");
const sequelize = new Sequelize(
  process.env.MYSQL_DATABASE_NAME,
  process.env.MYSQL_USERNAME,
  null,

  {
    dialect: "mysql",
    timezone: "+07:00",
    host: process.env.MYSQL_HOST,
    port: process.env.MYSQL_PORT,
    logging: false,
  }
);

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
