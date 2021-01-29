const AppError = require("../helpers/appError");

exports.information = (req, res, next) => {
  try {
    res.status(200).json({
      message: "My Rule-Validation API",
      status: "success",
      data: {
        name: "Omolola Omolambe",
        github: "@LolaOmolambe",
        email: "lola.omolambe@gmail.com",
        mobile: "08031364884",
        twitter: "",
      },
    });
  } catch (err) {
    next(err);
  }
};

exports.validateRule = (req, res, next) => {
  try {
    let { rule, data } = req.body;

    let first = rule.field.split(".");
    let first1 = first[0];
    let second = first[1];
    let value;

    if (second) {
      value = data[first1][second];
    } else {
      value = data[first1];
    }

    if (!data[first1]) {
      return next(
        new AppError(`field ${rule.field} is missing from data.`, 400)
      );
    } else if (second != undefined && !data[first1][second]) {
      return next(
        new AppError(`field ${rule.field} is missing from data.`, 400)
      );
    } else if (first.length > 2) {
      return next(new AppError(`Invalid JSON payload passed.`, 400));
    }

    let valid = false;
    switch (rule.condition) {
      case "eq":
        valid = value == rule.condition_value ? true : false;
        break;
      case "neq":
        valid = value != rule.condition_value ? true : false;
        break;
      case "gt":
        valid = value > rule.condition_value ? true : false;
        break;
      case "gte":
        valid = value >= rule.condition_value ? true : false;
        break;
      case "contains":
        valid = value.includes(rule.condition_value);
        break;
      default:
        valid = false;
    }

    return res.status(valid ? 200 : 400).json({
      message: valid
        ? `field ${rule.field} successfully validated.`
        : `field ${rule.field} failed validation.`,
      status: valid ? "success" : "error",
      data: {
        validation: {
          error: !valid,
          field: rule.field,
          field_value: value,
          condition: rule.condition,
          condition_value: rule.condition_value,
        },
      },
    });
  } catch (err) {
    next(err);
    //return next(new AppError(`Invalid JSON payload passed.`, 400));
  }
};
