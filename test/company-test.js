var lt = require('loopback-testing');
var assert = require('assert');
var app = require('../server/server.js'); 
var querystring = require('querystring')

var loggedInUser = {email:"gbo2@example.com", password: "123456", id: 233}

describe('# Company', function() {
  lt.beforeEach.withApp(app);
  lt.beforeEach.withUserModel('account');
  lt.beforeEach.givenLoggedInUser(loggedInUser);
    
  describe('##Find', function() {
    var qs = querystring.stringify({filter: JSON.stringify({
      where: {"name": {like: "%江宁%"}},
      limit: 10,
      skip: 0
    })});
    lt.describe.whenCalledRemotely('GET', '/api/companies?'+qs, function () {
      it('should success get comanpayies', function() {
        console.log(this.res.body, this.res.body.length)
      });
    });
  });
  
  describe('## Sync from wechat', function() {
    this.timeout(10000)
    lt.describe.whenCalledRemotely('POST', '/api/companies/sync', {
      begin: 0
    }, function () {
      it('should success sync', function() {
        console.log(this.res.body)
      });
    })
  });
});