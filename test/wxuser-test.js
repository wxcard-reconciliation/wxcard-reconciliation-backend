var lt = require('loopback-testing');
var assert = require('assert');
var app = require('../server/server.js'); 
var querystring = require('querystring')

var loggedInUser = {email:"gbo2@example.com", password: "123456", id: 233}

describe.only('WXUser', function() {
  lt.beforeEach.withApp(app);
  lt.beforeEach.givenLoggedInUser(loggedInUser);
    
  describe('##Find', function() {
    var qs = querystring.stringify({filter: JSON.stringify({
      // where: {token: 'ipgmlz1433818755'},
      limit: 10,
      skip: 0
    })});
    lt.describe.whenCalledRemotely('GET', '/api/wxusers?'+qs, function () {
      it('should success get wxusers', function() {
        console.log(this.res.body, this.res.body.length)
      });
    });
  });
});