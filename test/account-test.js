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

describe('# Consumer User', function() {
  
  this.timeout(5000);

  describe('## Create new Consumer', function() {
    lt.describe.whenCalledRemotely('POST', '/api/accounts', users.consumer, function () {
      it('should success', function(done) {
        // console.log(this.res.body);
        setTimeout(done, 2000);
      });
    });
  });
  
  describe.only('## Add Consumer', function() {
    lt.beforeEach.givenLoggedInUser(users.administrator);
    lt.describe.whenCalledRemotely('POST', '/api/accounts/addConsumer', {
      username: "13915922954",
      locationId: "279521991"
    }, function () {
      it('should success', function(done) {
        console.log(this.res.body);
        setTimeout(done, 2000);
      });
    });
  });
});