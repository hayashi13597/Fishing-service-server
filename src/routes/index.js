import UserRouter from "./user.route";
import NoticeRouter from "./notice.route";
const AllRouter = (app) => {
  app.use("/user", UserRouter);
  app.use("/notice", NoticeRouter);
};
export default AllRouter;
