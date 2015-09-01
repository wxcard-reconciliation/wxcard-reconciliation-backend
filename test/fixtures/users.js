var pois = require('./pois');

module.exports = {
  cashier: {
    id: 'abc223',
    email: "18612345678@petrojs.com",
    username: "18612345678",
    password: "123456",
    job: "加油站收银员",
    poi: pois[0]
  },
  administrator: {
    id: 'abc123',
    email: "18712345678@petrojs.com",
    username: "18712345678",
    password: "123456",
    job: "管理员"
  },
  cashier2: {
    email: "18687654321@petrojs.com",
    username: "18687654321",
    password: "123456",
    job: "加油站收银员",
    poi: pois[0]
  }
}