const SyncMySQL = require('sync-mysql');
const dbConfig = require("./config/db.config");

const connection = new SyncMySQL({
  host: dbConfig.HOST,
  user: dbConfig.USERNAME,
  database: dbConfig.DATABASE,
  password: dbConfig.PASSWORD,
  port:dbConfig.PORT,
  timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
});

try {
  connection.query('USE '+dbConfig.DATABASE);
  console.error('Database is connected:', connection);
} catch (err) {
  console.error('Database not connected:', err.message);
}

module.exports = connection;