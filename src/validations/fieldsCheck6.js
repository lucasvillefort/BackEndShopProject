const joi = require("joi");

const fieldsCheck6 = joi.object({
  cliente_id: joi.number().required(),
  observacao: joi.string(),
  pedido_produtos: joi.array().required(),
});
module.exports = fieldsCheck6;
