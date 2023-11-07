import UserRouter from "./user.route";
const initRoute = (app) => {
  app.use("/user", UserRouter);
};
export default initRoute;
