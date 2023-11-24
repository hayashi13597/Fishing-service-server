import { DataResponse } from "../middlewares";
import DiscountModel from "../models/discount.model";
import Util from "../utils";

class DiscountController {
  async checkoutCode(req, res) {
    const { code } = req.body.data;
    let discountItem = await DiscountModel.findOne({
      where: {
        code,
      },
    });
    discountItem = Util.coverDataFromSelect(discountItem);
    console.log(discountItem);
    if (!discountItem) {
      throw new Error("Mã giảm giá không tồn tại");
    } else if (discountItem.expirydate) {
      const isExisit = Util.isTimeEnd(discountItem.expirydate);

      if (!isExisit) {
        DiscountModel.update(
          { statue: true },
          {
            where: {
              code,
            },
          }
        );
        throw new Error("Mã giảm giá hết hạn");
      }
    } else if (discountItem.status) {
      throw new Error("Mã giảm giá đã sử dụng rồi");
    }
    res.status(200).json(DataResponse({}, 200, "Bạn có thể sử dụng mã này"));
  }
  async GetAllDiscount(req, res) {
    const listDiscount = await DiscountModel.findAll();
    res
      .status(200)
      .json(DataResponse({ listDiscount }, 200, "Danh sách mã giảm giá"));
  }
  async AddDiscount(req, res) {
    const { value, user_id, expirydate = "" } = req.body.data;
    const createDiscount = await DiscountModel.create({
      value,
      user_id,
      expirydate,
      code: Util.GenerateDiscountCode(),
    });
    res
      .status(201)
      .json(
        DataResponse(
          { discount: createDiscount },
          201,
          "Tạo mã giảm giá thành công"
        )
      );
  }
  async UpdateDiscount(req, res) {
    const { id, value } = req.body.data;
    const Check = await DiscountModel.update(
      { value },
      {
        where: {
          id,
        },
      }
    );
    if (Check && Check[0]) {
      res.status(200).json(DataResponse({}, 200, "Cập nhập thành công"));
      return;
    }
    throw new Error("Cập nhập thất bại");
  }
  async DeleteDiscount(req, res) {
    const id = req.params.discountId;
    const isDelete = await DiscountModel.destroy({
      where: {
        id,
      },
    });

    if (!isDelete) {
      throw new Error("Xóa thất bại");
    }
    res
      .status(200)
      .json(
        DataResponse({ isSccess: isDelete }, 200, "Xóa thành công mã giảm giá")
      );
  }
}

export default new DiscountController();
