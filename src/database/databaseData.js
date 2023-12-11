const databaseData = {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD, // put your password here please
  database: process.env.DB_NAME,
};

module.exports = databaseData;
