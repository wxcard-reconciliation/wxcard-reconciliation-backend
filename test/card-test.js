var lt = require('loopback-testing');
var assert = require('assert');
var app = require('../server/server.js'); 
var querystring = require('querystring')

lt.beforeEach.withApp(app);
lt.beforeEach.withUserModel('account');

var users = require('./fixtures/users');

describe('# Card', function() {
  
  lt.beforeEach.givenLoggedInUser(users.cashier);
  
  describe('## Sync', function() {
    this.timeout(0)
    lt.describe.whenCalledRemotely('POST', '/api/cards/sync', {
      offset: 0,
      count: 50
    }, function () {
      it('should success get coupon', function() {
        assert.equal(this.res.statusCode, 200);
      });
    });    
  });
  
  describe('## Cancel', function() {
    lt.describe.whenCalledRemotely('POST', '/api/cards/cancel', {
      code: '430218938436',
      receipt: 'http://zsydz.aceweet.com/app/img/logo-single.png'
    }, function () {
      it('should success', function() {
        console.log(this.res.body);
      });
    });
  });
  
  describe('## Check Code', function() {
    lt.describe.whenCalledRemotely('POST', '/api/cards/check', {
      code: '430218938436'
    }, function () {
      it('should success', function(done) {
        console.log(this.res.body);
        done()
      });
    })
  });
});