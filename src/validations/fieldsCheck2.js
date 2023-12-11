const joi = require("joi");

const fieldsCheck2 = joi.object({
  email: joi.string().email().required(),
  senha: joi.string().required(),
});
module.exports = fieldsCheck2;
