const supabase = require("../email/sendEmail");
const emailFunction = async (
  insertProducts,
  originalname,
  buffer,
  mimetype
) => {
  const { data } = await supabase.storage
    .from("lastprojectteamcode21")
    .upload(`${insertProducts.rows[0].id}/${originalname}`, buffer, {
      contentType: mimetype,
    });
  const path_image = data.path;
  const urlImage = `https://nuquoltxaosivekpvcpx.supabase.co/storage/v1/object/public/lastprojectteamcode21/${data.path}`;
  return { urlImage, path_image };
};

const emailFunction2 = async (id, originalname, buffer, mimetype) => {
  const { data } = await supabase.storage
    .from("lastprojectteamcode21")
    .upload(`${id}/${originalname}`, buffer, {
      contentType: mimetype,
      upsert: true,
    });
  const path_image = data.path;
  const urlImage = `https://nuquoltxaosivekpvcpx.supabase.co/storage/v1/object/public/lastprojectteamcode21/${data.path}`;
  return { urlImage, path_image };
};
module.exports = { emailFunction, emailFunction2 };
