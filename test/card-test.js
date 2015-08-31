var lt = require('loopback-testing');
var assert = require('assert');
var app = require('../server/server.js'); 
var querystring = require('querystring')

lt.beforeEach.withApp(app);

var users = require('./fixtures/users');

describe('# Card', function() {
  
  lt.beforeEach.withUserModel('account');
  lt.beforeEach.givenLoggedInUser(users.cashier);
  
  describe('## Sync', function() {
    this.timeout(100000)
    lt.describe.whenCalledRemotely('POST', '/api/cards/sync', {
      offset: 0,
      count: 50
    }, function () {
      it('should success get coupon', function() {
        assert.equal(this.res.statusCode, 200);
      });
    });    
  });
  
  describe.only('## Cancel', function() {
    lt.describe.whenCalledRemotely('POST', '/api/cards/cancel', {
      code: '041625691557',
      receipt: 'http://zsydz.aceweet.com/app/img/logo-single.png'
    }, function () {
      it('should success', function() {
        console.log(this.res.body);
      });
    })
  });
});