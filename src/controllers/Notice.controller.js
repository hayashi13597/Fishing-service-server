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
  async GetNoticeAccount(req, res) {
    const { id, limit, skip } = req.query;
    const data = await NoticeServices.GetNoticeAccount(id, limit, skip);
    res.status(200).json(data);
  }
  async CleanOne(req, res) {
    const { id } = req.params;
    const data = await NoticeServices.CleanOne(id);
    res.status(200).json(data);
  }
  async CleanAll(req, res) {
    const data = await NoticeServices.CleanAllNotice();
    res.status(200).json(data);
  }
}

export default new NoticeController();
