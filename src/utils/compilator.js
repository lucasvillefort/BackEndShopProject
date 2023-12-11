const fs = require("fs/promises");
const handlebars = require("handlebars");
const compiladorHtml = async (arquivo, contexto) => {
  const html = await fs.readFile(arquivo);
  const compilar = handlebars.compile(html.toString()); // => it work to get put several variable into the tag
  const htmlString = compilar(contexto);
  return htmlString;
};

module.exports = compiladorHtml;
