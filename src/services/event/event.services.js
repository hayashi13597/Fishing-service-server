import { coverSlug } from "react-swisskit";
import { DataResponse } from "../../middlewares";
import EventModal from "../../models/event.model";
import UserModel from "../../models/user.model";
import Util from "../../utils";
import CloudinaryServices from "../cloudinary.services";
import { Op } from "sequelize";
import { CreateNotice } from "../user/User.service";
import sequelize from "../../models";
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
  async GetAllSlug() {
    const listSlugs = await EventModal.findAll({ attributes: ["slug"] });
    return DataResponse({ listSlugs }, 200, `Lấy thành công tất cả slug`);
  }
  async GetOne(slug) {
    const EventItems = await EventModal.findOne({
      where: {
        slug,
      },
      include: [
        {
          model: UserModel,
          attributes: ["fullname", "avatar"],
        },
      ],
    });
    const listNewsTop = await EventModal.findAll({
      limit: 6,
      attributes: [
        "title",
        "description",
        "imageUrl",
        "updatedAt",
        "slug",
        "id",
      ],
      where: {
        slug: {
          [Op.not]: slug,
        },
      },
      include: [
        {
          model: UserModel,
          attributes: ["fullname", "avatar"],
        },
      ],
      order: [["views", "DESC"]],
    });
    const listSame = await EventModal.findAll({
      limit: 6,
      attributes: [
        "title",
        "description",
        "imageUrl",
        "updatedAt",
        "slug",
        "id",
      ],
      where: {
        slug: {
          [Op.not]: slug,
        },
        isEvent: EventItems.isEvent,
      },
      include: [
        {
          model: UserModel,
          attributes: ["fullname", "avatar"],
        },
      ],
      order: sequelize.random(),
    });
    await EventModal.increment(
      { views: +1 },
      {
        where: {
          slug,
        },
      }
    );

    return DataResponse(
      {
        event: EventItems,
        listNewsTop,
        listSame,
      },
      200,
      "Lấy danh sách events thành công"
    );
  }
  async GetViewNewScreen() {
    const [listTopNews, listNewHot, listEventHost, listNewNew, listEventNews] =
      await Promise.all([
        EventModal.findAll({
          limit: 5,
          order: [["views", "DESC"]],
          where: {
            visiable: true,
          },
          attributes: {
            exclude: ["content"],
          },
          include: [
            {
              model: UserModel,
              attributes: ["avatar", "fullname"],
            },
          ],
        }),
        EventModal.findAll({
          limit: 6,
          where: {
            isEvent: false,
            visiable: true,
          },
          order: [["views", "DESC"]],
          attributes: {
            exclude: ["content"],
          },
          include: [
            {
              model: UserModel,
              attributes: ["avatar", "fullname"],
            },
          ],
        }),
        EventModal.findAll({
          limit: 6,

          where: {
            isEvent: true,
            visiable: true,
          },
          include: [
            {
              model: UserModel,
              attributes: ["avatar", "fullname"],
            },
          ],
          order: [["views", "DESC"]],
          attributes: {
            exclude: ["content"],
          },
        }),
        EventModal.findAll({
          limit: 4,

          where: {
            isEvent: false,
          },
          order: [["createdAt", "DESC"]],
          include: [
            {
              model: UserModel,
              attributes: ["avatar", "fullname"],
            },
          ],
          attributes: {
            exclude: ["content"],
          },
        }),
        EventModal.findAll({
          limit: 4,

          where: {
            isEvent: true,
            visiable: true,
          },
          order: [["createdAt", "DESC"]],
          include: [
            {
              model: UserModel,
              attributes: ["avatar", "fullname"],
            },
          ],
          attributes: {
            exclude: ["content"],
          },
        }),
      ]);

    return DataResponse(
      { listTopNews, listNewHot, listEventHost, listNewNew, listEventNews },
      200,
      `Lấy danh sách vie tin tức thành công`
    );
  }
  async Create(infoEvemt) {
    const slug = coverSlug(infoEvemt.title);
    let EventItems = {};
    try {
      if (infoEvemt.isEvent) {
        CreateNotice(
          {
            title: `Thông báo sự kiện ${infoEvemt.title}`,
            content: `${infoEvemt.description}`,
            receiver_id: "all",
            user_id: infoEvemt.user_id,
            isSee: false,
          },
          "/tin-tuc/" + slug
        );
      }

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
    const time_end = editContent?.time_end || "";
    let timeEvent = 0;
    if (time_end && editContent.isEvent) {
      timeEvent = Math.floor(Util.TimeDiff(time_end) / (3600 * 24 * 1000));
    }

    await EventModal.update(
      { ...editContent, timeEvent, time_end },
      {
        where: {
          id,
        },
      }
    );
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
  async Search(text) {
    const listEVents = await EventModal.findAll({
      where: {
        [Op.or]: {
          title: {
            [Op.substring]: text,
          },
          description: {
            [Op.substring]: text,
          },
        },
      },
      include: [
        {
          model: UserModel,
          attributes: ["avatar", "fullname"],
        },
      ],
      order: [["updatedAt", "DESC"]],
      limit: 10,
    });
    const total = await EventModal.count({
      where: {
        [Op.or]: {
          title: {
            [Op.substring]: text,
          },
          description: {
            [Op.substring]: text,
          },
        },
      },
    });
    return DataResponse(
      { events: listEVents, total },
      200,
      "Tìm kiếm tin tức thành công"
    );
  }
}
export default new EventService();
