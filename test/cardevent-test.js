var lt = require('loopback-testing');
var assert = require('assert');
var app = require('../server/server.js'); 
var querystring = require('querystring')

lt.beforeEach.withApp(app);

var users = require('./fixtures/users');

describe('# Cardevent By Cashier', function() {

  lt.beforeEach.withUserModel('account');
  lt.beforeEach.givenLoggedInUser(users.cashier);
  
  describe('## Find', function() {
    var filter = {
      // order: ['CreateTime DESC'],
      where:{
        id: {inq: ['891399341333']}
      },
      limit: 10,
      skip: 0
    }
    var qs = querystring.stringify({filter: JSON.stringify(filter)})
    lt.describe.whenCalledRemotely('GET', '/api/cardevents?'+qs, function () {
      it('should success', function(done) {
        console.log(this.res.body);
        done();
      });
    });
  });
  
  describe.only('## Statistic City', function() {
    var filter = {
      target: 'wxclient.city',
      order: ['wxclient.city DESC'],
      where:{
        // "wxclient.city": "苏州",
        CardId: {$in: [
          'pAtUNs2kaIzJjl6ZXUO-fMP_KabQ',
          'pAtUNs5y63pZFOCoOD6V8pg4bMQk',
          'pAtUNsyFRkWSW8D92mnqKyvNJFVA'
        ]}
      },
      limit: 10,
      skip: 0
    }
    var qs = querystring.stringify({filter: JSON.stringify(filter)})
    lt.describe.whenCalledRemotely('GET', '/api/cardevents/statcity?'+qs, function () {
      it('should success', function(done) {
        console.log(this.res.body);
        done();
      });
    });
  });
});