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
      where: {
        receiver_id: {
          [Op.or]: [receiver_id, "all"],
        },
      },
    });
    return DataResponse({ notices }, 200, "Lấy danh sách thông báo thành công");
  }
}

export default new NoticeServices();
