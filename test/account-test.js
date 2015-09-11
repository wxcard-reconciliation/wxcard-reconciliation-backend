var lt = require('loopback-testing');
var assert = require('assert');
var app = require('../server/server.js'); 
var querystring = require('querystring')

lt.beforeEach.withApp(app);
lt.beforeEach.withUserModel('account');

var users = require('./fixtures/users');

describe('# Administrator User', function() {
  
  lt.beforeEach.givenLoggedInUser(users.administrator);
  
  describe('## Create new Cashier', function() {
    lt.describe.whenCalledRemotely('POST', '/api/accounts', users.cashier, function () {
      it('should success', function(done) {
        console.log(this.res.body);
        done();
      });
    });
  });
  
  describe('## Find', function() {
    var filter = {
      limit: 25,
      skip: 0
    }
    var qs = querystring.stringify({filter: JSON.stringify(filter)})
    lt.describe.whenCalledRemotely('GET', '/api/accounts?'+qs, function () {
      it('should have successCode 200', function() {
        console.log(this.res.body);
      });
    });    
  });
});

describe('# Cashier User', function() {
  
  lt.beforeEach.withUserModel('account');
  lt.beforeEach.givenLoggedInUser(users.cashier);

  describe('## FindById', function() {
    lt.describe.whenCalledRemotely('GET', '/api/accounts/'+users.cashier.id, function () {
      it('should have successCode 200', function(done) {
        console.log(this.res.body);
        done();
      });
    });    
  });
});