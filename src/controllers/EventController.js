import EventServices from "../services/event/event.services";

class EventController {
  async GetAll(_, res) {
    const data = await EventServices.GetAll();
    res.status(200).json(data);
  }
  async GetViewNewScreen(_, res) {
    const data = await EventServices.GetViewNewScreen();
    res.status(200).json(data);
  }
  async GetAllSlug(_, res) {
    const data = await EventServices.GetAllSlug();
    res.status(200).json(data);
  }
  async GetOne(req, res) {
    const slug = req.params.slug;

    const data = await EventServices.GetOne(slug);
    res.status(200).json(data);
  }
  async Create(req, res) {
    const dataCreate = req.body.data;
    const data = await EventServices.Create(dataCreate);
    res.status(201).json(data);
  }
  async Edit(req, res) {
    const { id, ...EventUpload } = req.body.data;
    const data = await EventServices.Edit(id, EventUpload);
    res.status(200).json(data);
  }
  async Delete(req, res) {
    const id = req.params.id;
    const data = await EventServices.Delete(id);
    res.status(200).json(data);
  }
}
export default new EventController();
