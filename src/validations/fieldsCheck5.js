const joi = require("joi");

const fieldsCheck5 = joi.object({
  nome: joi.string().required(),
  email: joi.string().email().required(),
  cpf: joi.string().required(),
});
module.exports = fieldsCheck5;
