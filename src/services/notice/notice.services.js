import AuthServices from "..";
import UserModel from "../../models/user.model";

import { DataResponse } from "../../middlewares";
import Util from "../../utils";
import CloudinaryServices from "../cloudinary.services";
import casual from "casual";
import NoticeModal from "../../models/notice.model";
import { Op } from "sequelize";
class NoticeServices {
  async UpdateNotice(receiver_id, isSee = true) {
    await NoticeModal.update(
      { isSee: isSee },
      {
        where: {
          receiver_id,
        },
      }
    );
    return DataResponse({}, 200, "Cập nhập thông báo thành công");
  }
  async GetAllNotice(receiver_id) {
    const notices = await NoticeModal.findAll({
      limit: 10,
      where: {
        receiver_id: {
          [Op.or]: [receiver_id, "all"],
        },
      },
      order: [["createdAt", "DESC"]],
    });
    return DataResponse({ notices }, 200, "Lấy danh sách thông báo thành công");
  }
  async GetNoticeAccount(id, limit = 6, skip) {
    const notices = await NoticeModal.findAll({
      where: {
        receiver_id: {
          [Op.or]: [id, "all"],
        },
      },
      limit: Number(limit),
      offset: Number(skip),
      order: [["createdAt", "DESC"]],
    });
    const total = await NoticeModal.count({
      where: {
        receiver_id: {
          [Op.or]: [id, "all"],
        },
      },
    });
    return DataResponse(
      { notices, total },
      200,
      "Lấy danh sách thông báo thành công"
    );
  }
}

export default new NoticeServices();
