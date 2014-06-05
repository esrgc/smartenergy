//set node environment
process.env.NODE_ENV = 'development';

module.exports = {
  server: {
    port: 3011
  },
  mssql: {
    userName: ''
    , password: ''
    , server: ''
    , options: {
      port: 1433
      , database: ''
    }
  }
}
