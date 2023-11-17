import UserRouter from "./user.route";
import NoticeRouter from "./notice.route";
import CateRotuer from "./cate.route";
import ProductRouter from "./product.route";
import DiscountRouter from "./discount.route";
import OrderRouter from "./order.route";
import EventRouter from "./event.route";
const AllRouter = (app) => {
  app.use("/user", UserRouter);
  app.use("/notice", NoticeRouter);
  app.use("/cate", CateRotuer);
  app.use("/product", ProductRouter);
  app.use("/order", OrderRouter);
  app.use("/discount", DiscountRouter);
  app.use("/event", EventRouter);
};
export default AllRouter;
