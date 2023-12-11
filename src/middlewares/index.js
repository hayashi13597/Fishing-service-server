const ErrorHandler = (err, res) => {
  try {
    const errStatus = err.statusCode || 400;
    const errMsg = err.message || "Something went wrong";
    const errMessage = {
      success: false,
      status: errStatus,
      message: errMsg,
      // stack: process.env.NODE_ENV === "development" ? err.stack : {},
    };
    // console.log("======================================");
    // console.log("Đang Bị lỗi: ", errMessage);

    res.status(errStatus).json(errMessage);
  } catch {}
};
export const Logger = (...message) => {
  if (process.env?.NODE_ENV === "development") {
    console.log("===> ", message);
  }
};
export const DataResponse = (data, status = 200, message = "") => {
  return {
    data,
    statusCode: status,
    message,
  };
};

class MiddleWare {
  handleTryCate = (controller) => async (req, res, next) => {
    try {
      await controller(req, res, next);
    } catch (err) {
      await ErrorHandler(err, res);
    }
  };
}

export default new MiddleWare();
