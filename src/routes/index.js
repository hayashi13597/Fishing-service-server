import UserRouter from "./user.route";
import NoticeRouter from "./notice.route";
import CateRotuer from "./cate.route";
import ProductRouter from "./product.route";
import DiscountRouter from "./discount.route";
import OrderRouter from "./order.route";
import EventRouter from "./event.route";
import ContactRouter from "./contact.route";
import ReviewRouter from "./review.route";
const AllRouter = (app) => {
  app.use("/user", UserRouter);

  app.use("/notice", NoticeRouter);

  app.use("/cate", CateRotuer);

  app.use("/product", ProductRouter);

  app.use("/order", OrderRouter);

  app.use("/discount", DiscountRouter);

  app.use("/event", EventRouter);

  app.use("/contact", ContactRouter);
  app.use("/review", ReviewRouter);
};
ContactRouter;
export default AllRouter;
