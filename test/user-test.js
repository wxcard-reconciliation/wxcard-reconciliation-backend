var lt = require('loopback-testing');
var assert = require('assert');
var app = require('../server/server.js'); 
var querystring = require('querystring')

lt.beforeEach.withApp(app);

var users = require('./fixtures/users')

describe('# Administrator User', function() {
  
  lt.beforeEach.withUserModel('user');
  lt.beforeEach.givenLoggedInUser(users.administrator);
  
  describe('## Find', function() {
    var filter = {
      limit: 25,
      skip: 0
    }
    var qs = querystring.stringify({filter: JSON.stringify(filter)})
    lt.describe.whenCalledRemotely('GET', '/api/users?'+qs, function () {
      it('should have successCode 200', function() {
        console.log(this.res.body);
      });
    });    
  });
});

describe.only('# Cashier User', function() {
  
  lt.beforeEach.withUserModel('user');
  lt.beforeEach.givenLoggedInUser(users.cashier);

  describe('## FindById', function() {
    lt.describe.whenCalledRemotely('GET', '/api/users/'+users.cashier.id, function () {
      it('should have successCode 200', function(done) {
        console.log(this.res.body);
        done();
      });
    });    
  });
});