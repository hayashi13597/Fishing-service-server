import { DataResponse } from "../middlewares";

import RedisServer from "../redis/redis.config";
import CloudinaryServices from "../services/cloudinary.services";
import NoticeServices from "../services/notice/notice.services";

import Util from "../utils";

class NoticeController {
  async UpdateNotice(req, res) {
    const { id } = req.body.data;
    const data = await NoticeServices.UpdateNotice(id);
    res.status(200).json(data);
  }
  async GetAllNotice(req, res) {
    const { id } = req.body.data;
    const data = await NoticeServices.GetAllNotice(id);
    res.status(200).json(data);
  }
}

export default new NoticeController();
