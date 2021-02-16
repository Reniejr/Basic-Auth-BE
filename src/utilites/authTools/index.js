const UserModel = require("../../services/users/model");
const atob = require("atob");

const basicAuth = async (req, res, next) => {
  if (!req.headers.authorization) {
    const error = new Error();
    error.httpStatusCode = 401;
    error.message = "Invalid authorization - NO authorizations provided";
    next(error);
  } else {
    const [email, password] = atob(
      req.headers.authorization.split(" ")[1]
    ).split(":");

    const user = await UserModel.findByCredentials(email, password);
    if (!user) {
      const error = new Error();
      error.httpStatusCode = 401;
      error.message = "Invalid authorization - WRONG credentials";
      next(error);
    } else {
      req.user = user;
    }
    next();
  }
};

const adminOnly = async (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    const error = new Error();
    error.httpStatusCode = 403;
    error.message = "NOT ALLOWED - ADMIN ONLY";
    next(error);
  }
};

module.exports = {
  basicAuth,
  adminOnly,
};
