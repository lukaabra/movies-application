// Update with your config settings.
require('dotenv').config({
  path: require('find-config')('.env')
});

module.exports = {

  development: {
    client: 'pg',
    connection: process.env.DB_CONNECTION,
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations'
    }
  }

};