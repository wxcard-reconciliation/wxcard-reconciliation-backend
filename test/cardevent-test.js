var lt = require('loopback-testing');
var assert = require('assert');
var app = require('../server/server.js'); 
var querystring = require('querystring')

lt.beforeEach.withApp(app);

var users = require('./fixtures/users');

describe('# Cardevent By Cashier', function() {

  lt.beforeEach.withUserModel('account');
  lt.beforeEach.givenLoggedInUser(users.cashier2);
  
  describe('## Find', function() {
    var filter = {
      // order: ['CreateTime DESC'],
      where:{
        id: '650243564813'
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
  
});