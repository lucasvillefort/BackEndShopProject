const joi = require("joi");

const fieldsCheck1 = joi.object({
  nome: joi.string().required(),
  email: joi.string().email().required(),
  senha: joi.string().required(),
});
module.exports = fieldsCheck1;
