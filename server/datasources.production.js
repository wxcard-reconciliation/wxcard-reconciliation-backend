module.exports = {
  mysql: {
    hostname: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: 'wxcarddb',
    connector: 'mysql'
  }
};
