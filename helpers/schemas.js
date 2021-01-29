const Joi = require("joi");

const schemas = {
  ruleModel: Joi.object().required().keys({
    rule: Joi.object().required().keys({
      field: Joi.string().required(),
      condition: Joi.string().required().valid('eq', 'neq', 'gt', 'gte', 'contains'),
      condition_value: Joi.required()
    }),
   data: Joi.alternatives().try(Joi.string(), Joi.array(), Joi.object()).required()
  })
};

module.exports = schemas;



