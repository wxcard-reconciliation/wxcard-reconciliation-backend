var lt = require('loopback-testing');
var assert = require('assert');
var app = require('../server/server.js'); 
var querystring = require('querystring')

var loggedInUser = {email:"gbo2@example.com", password: "123456", id: 123456}

describe('# Account', function() {
  lt.beforeEach.withApp(app);
  lt.beforeEach.givenLoggedInUser(loggedInUser);
  
  describe.only('## Update', function() {
    lt.describe.whenCalledRemotely('PUT', '/api/accounts/'+loggedInUser.id,{
      id: loggedInUser.id,
      name: "update name "+Date.now()
    }, function () {
      it('should have successCode 200', function() {
        // assert.equal(this.res.statusCode, 200);
        console.log(this.res.body);
      });
    })
  });
  
});