import casual from "casual";
class Util {
  static CreateID(length = 6) {
    return casual.uuid.replace(/-/g, "").substring(0, length);
  }
  static formatID(firstChar, length = 6) {
    return `${firstChar}${this.CreateID(length)}`;
  }
}
export default Util;
