import { coverSlug } from "react-swisskit";
import { DataResponse } from "../../middlewares";
import EventModal from "../../models/event.model";
import UserModel from "../../models/user.model";
import Util from "../../utils";
import CloudinaryServices from "../cloudinary.services";

class EventService {
  async GetAll() {
    const listEvents = await EventModal.findAll({
      order: [["createdAt", "DESC"]],
      include: [
        {
          model: UserModel,
          attributes: ["fullname"],
        },
      ],
    });
    return DataResponse(
      {
        events: listEvents,
      },
      200,
      "Lấy danh sách events thành công"
    );
  }
  async GetOne(slug) {
    const EventItems = await EventModal.findOne({
      where: {
        slug,
      },
      include: [
        {
          model: UserModel,
          attributes: ["fullname"],
        },
      ],
    });
    return DataResponse(
      {
        event: EventItems,
      },
      200,
      "Lấy danh sách events thành công"
    );
  }
  async Create(infoEvemt) {
    const slug = coverSlug(infoEvemt.title);
    let EventItems = {};
    try {
      EventItems = await EventModal.create({ slug, ...infoEvemt });
    } catch (error) {
      throw new Error(error.message);
    }
    return DataResponse(
      {
        event: EventItems,
      },
      201,
      `Tạo thành công ${infoEvemt.isEvent ? "Sự kiện" : "Tin tức"} mới`
    );
  }
  async Edit(id, editContent) {
    await EventModal.update(editContent, {
      where: {
        id,
      },
    });
    const EventItems = await EventModal.findOne({
      where: {
        id,
      },
      include: [
        {
          model: UserModel,
          attributes: ["fullname"],
        },
      ],
    });
    return DataResponse(
      { event: EventItems },
      201,
      `Thay đổi thông ti sự kiện thành công`
    );
  }
  async Delete(id) {
    let findItem = await EventModal.findByPk(id);
    findItem = Util.coverDataFromSelect(findItem);
    if (findItem?.idPath) {
      CloudinaryServices.deleteFileImage(findItem.idPath);
    } else {
      throw new Error("Không tìm thấy tin tuc sự kiện cần xóa");
    }

    await EventModal.destroy({
      where: {
        id,
      },
    });
    return DataResponse(
      {},
      201,
      `Xóa thành công 
    ${findItem.isEvent ? "sự kiện" : "tin tức"}  này!`
    );
  }
}
export default new EventService();
