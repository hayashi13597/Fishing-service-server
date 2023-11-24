import { DataResponse } from "../../middlewares";
import ContactModal from "../../models/contact.model";
import RedisServer from "../../redis/redis.config";

class ContactService {
  async Create({ fullname, email, content, phone }) {
    ContactModal.create({ fullname, email, content, phone });
    return DataResponse({}, 201, "Bạn đã liên hệ thành công");
  }
  async ContactMail(email, title, content, id) {
    if (!email || !title || !content) {
      throw new Error("Thiếu dữ liệu ");
    }
    RedisServer.publish(
      "SendContentContact",
      JSON.stringify({ email, title, content })
    );
    await ContactModal.update(
      { status: true },
      {
        where: {
          id,
        },
      }
    );
    return DataResponse(
      {},
      201,
      "Gửi thư liên hệ thành công đến địa chỉ " + email
    );
  }
  async GetAll(limit, skip) {
    const listContact = await ContactModal.findAll({
      limit: parseInt(limit),
      offset: parseInt(skip),
      order: [["createdAt", "DESC"]],
    });
    const total = await ContactModal.count();
    return DataResponse(
      { listContact, total },
      200,
      "Lấy danh sách liên hệ thành công"
    );
  }
  async Delete(id) {
    const listContact = await ContactModal.destroy({
      where: {
        id,
      },
    });
    return DataResponse({ listContact }, 200, "Xóa thành công liên hệ này");
  }
}
export default new ContactService();
