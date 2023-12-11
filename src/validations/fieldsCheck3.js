const joi = require("joi");

const fieldsCheck3 = joi.object({
  descricao: joi.string().required(),
  quantidade_estoque: joi.number().required(),
  valor: joi.number().required(),
  categoria_id: joi.number().required(),
});
module.exports = fieldsCheck3;
