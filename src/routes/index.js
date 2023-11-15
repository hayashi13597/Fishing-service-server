import UserRouter from "./user.route";
const AllRouter = (app) => {
  app.use("/user", UserRouter);
};
export default AllRouter;
