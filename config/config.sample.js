//set node environment
process.env.NODE_ENV = 'production';

module.exports = {
  server: {
    port: 1234
  },
  socrata: {
     uids: {
      'renewable': 'renewable-uid',
      'efficiency': 'efficiency-uid',
      'transportation': 'transportation-uid'
    },
    apptoken: 'socrata-token',
    user: 'username',
    password: 'password'
  },
  mongo: 'mongodb://the-mongo-string',
  adminpass: 'admin-password'
}
