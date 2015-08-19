var lt = require('loopback-testing');
var assert = require('assert');
var app = require('../server/server.js'); 
var querystring = require('querystring')

lt.beforeEach.withApp(app);
lt.beforeEach.withUserModel('account');

var loggedInUser = {username: "13912345678", email:"13912345678@example.com", password: "123456", id: 2}


describe.only('# WXClient', function() {
  this.timeout(0);
  lt.beforeEach.givenLoggedInUser(loggedInUser);
  
  describe('## Sync', function() {
    lt.describe.whenCalledRemotely('POST', '/api/wxclients/sync', {}, function () {
      it('should success', function() {
        // console.log(this.res.body.length);
        // assert.equal(this.res.statusCode, 200);
      });
    });
    
  });
});