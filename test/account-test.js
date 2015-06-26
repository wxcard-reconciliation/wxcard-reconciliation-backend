var lt = require('loopback-testing');
var assert = require('assert');
var app = require('../server/server.js'); 
var querystring = require('querystring')

var loggedInUser = {email:"gbo2@example.com", password: "123456", id: 123456, companyId:4}

describe('# Account', function() {
  lt.beforeEach.withApp(app);
  lt.beforeEach.givenLoggedInUser(loggedInUser);
  
  describe('## Update', function() {
    lt.describe.whenCalledRemotely('PUT', '/api/accounts/'+loggedInUser.id,{
      id: loggedInUser.id,
      name: "update name "+Date.now()
    }, function () {
      it('should have successCode 200', function() {
        assert.equal(this.res.statusCode, 200);
      });
    });
  });
  
  describe('## Find', function() {
    var filter = {
      include: ['company'],
      limit: 25,
      skip: 0
    }
    var qs = querystring.stringify({filter: JSON.stringify(filter)})
    lt.describe.whenCalledRemotely('GET', '/api/accounts?'+qs, function () {
      it('should have successCode 200', function() {
        console.log(this.res.body);
      });
    })
  });
  
});