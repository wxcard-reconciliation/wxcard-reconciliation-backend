var lt = require('loopback-testing');
var assert = require('assert');
var app = require('../server/server.js'); 
var querystring = require('querystring')

lt.beforeEach.withApp(app);
lt.beforeEach.withUserModel('account');

var loggedInUser = {email:"gbo2@example.com", password: "123456", id: 233, companyId:4, job: '管理员'}
var gasstationUser = {email:"gasstation@example.com", password: '123456', id: 333, job: '加油站长'}

describe('# Account', function() {
  lt.beforeEach.givenLoggedInUser(loggedInUser, 'account');
  
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

describe.only('# Account Exeception', function() {
  
  describe('## Find', function() {
    lt.describe.whenCalledAnonymously('GET', '/api/accounts', function () {
      lt.it.shouldBeDenied();
    })
    
    lt.describe.whenCalledByUser(gasstationUser, 'GET', '/api/accounts', function () {
      lt.it.shouldBeDenied();
    })
  });
});