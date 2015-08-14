var lt = require('loopback-testing');
var assert = require('assert');
var app = require('../server/server.js'); 
var querystring = require('querystring')

lt.beforeEach.withApp(app);
lt.beforeEach.withUserModel('account');

var loggedInUser = {username: "13912345678", email:"13912345678@example.com", password: "123456", id: 2}

describe('# Card', function() {
  lt.beforeEach.givenLoggedInUser(loggedInUser);
  
  describe.only('## Sync', function() {
    this.timeout(100000)
    lt.describe.whenCalledRemotely('POST', '/api/cards/sync', {
      offset: 0,
      count: 50
    }, function () {
      it('should success get coupon', function() {
        console.log(this.res.body);
        // assert.equal(this.res.statusCode, 200);
      });
    });
    
  });
});