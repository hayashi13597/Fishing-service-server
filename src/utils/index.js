import casual from "casual";
import moment from "moment";
import vi from "moment/locale/vi";
class Util {
  static CreateID(length = 6) {
    return casual.uuid.replace(/-/g, "").substring(0, length);
  }
  static formatID(firstChar, length = 6) {
    return `${firstChar}${this.CreateID(length)}`;
  }
  static formatDate(createat) {
    return moment(createat).format("DD/MM/YYYY HH:mm:ss");
  }
  static coverDataFromSelect(data) {
    data = JSON.stringify(data);
    return JSON.parse(data);
  }
}
export default Util;
