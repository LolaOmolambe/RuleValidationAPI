const AppError = require("../helpers/appError");
const vowels = "aeiouAEIOU";

const handleRequiredFields = (err) => {
  let message = `${err.context.key} is required.`;
  return new AppError(message, 400);
};
const handleWrongType = (err) => {
  let type = err.type.split(".")[0];
  let adjective = vowels.indexOf(type[0]) ? "an" : "a";
  let message = `${err.context.key} should be ${adjective} ${type}.`;
  return new AppError(message, 400);
};
const handleInvalidJSON = (err) => {
  let message = `Invalid JSON payload passed.`;
  return new AppError(message, 400);
};

const responseBody = (err, req, res) => {
  return res.status(err.statusCode).json({
    message: err.message,
    status: "error",
    data: null,
  });
};

module.exports = (err, req, res, next) => {
  let error = err;
  error.type = error.type || "none";

  if (error.type === "any.required") {
    error = handleRequiredFields(error);
  } else if (error.type.includes("base")) {
    error = handleWrongType(error);
  } else if (
    error.type === "entity.parse.failed" ||
    error.type === "any.only" ||
    error.type === "alternatives.types"
  ) {
    error = handleInvalidJSON(error);
  }

  responseBody(error, req, res);
};
