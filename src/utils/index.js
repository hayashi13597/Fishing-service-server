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
  static isTimeEnd(timecreate) {
    return new Date(timecreate).getTime() - new Date(Date.now()) > 0;
  }
  static TimeDiff(timecreate) {
    return new Date(timecreate).getTime() - new Date(Date.now());
  }
  static GenerateDiscountCode(maxlength = 6) {
    const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890";
    let discountCode = "";

    for (let i = 0; i < maxlength; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      discountCode += characters.charAt(randomIndex);
    }

    return discountCode;
  }
}
export default Util;
