const Joi = require("joi");

const validationMiddleware = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);
    const valid = error == null;

    if (valid) {
      next();
    } else {
      const { details } = error;
      return next(details[0]);
    }
  };
};

module.exports = validationMiddleware;
