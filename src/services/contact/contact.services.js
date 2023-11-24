import { DataResponse } from "../../middlewares";
import ContactModal from "../../models/contact.model";

class ContactService {
  async Create({ fullname, email, content, phone }) {
    ContactModal.create({ fullname, email, content, phone });

    return DataResponse({}, 201, "Bạn đã liên hệ thành công");
  }
  async GetAll() {
    const listContact = await ContactModal.findAll({
      order: [["createdAt", "DESC"]],
    });
    return DataResponse(
      { listContact },
      201,
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
