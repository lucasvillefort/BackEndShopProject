const joi = require("joi");

const fieldsCheck4 = joi.object({
  nome: joi.string().required(),
  email: joi.string().email().required(),
  cpf: joi.string().required(),
  cep: joi.string().required(),
  rua: joi.string().required(),
  numero: joi.number().required(),
  bairro: joi.string().required(),
  cidade: joi.string().required(),
  estado: joi.string().required(),
});
module.exports = fieldsCheck4;
