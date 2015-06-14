var lt = require('loopback-testing');
var assert = require('assert');
var app = require('../server/server.js'); 
var querystring = require('querystring')

var loggedInUser = {email:"gbo2@example.com", password: "123456", id: 123456}

describe.only('Coupon', function() {
  lt.beforeEach.withApp(app);
  lt.beforeEach.givenLoggedInUser(loggedInUser);
  
  describe.skip('#Find Coupon', function() {
    lt.describe.whenCalledRemotely('GET', '/api/coupons', function () {
      it('should success get coupon', function() {
        console.log(this.res.body)
      });
    })
  });
  
  describe('#Find Coupon Record', function() {
    var filter = {
      includeWechatuser: true,
      include: ['coupon'],
      limit: 25,
      skip: 4
    }
    var qs = querystring.stringify({filter: JSON.stringify(filter)})
    lt.describe.whenCalledRemotely('GET', '/api/couponRecords?'+qs, function () {
      it('should success get coupon records', function() {
        assert.equal(this.res.statusCode, 200);
      });
    });
  });
  
  describe('#Count count User', function() {
    lt.describe.whenCalledRemotely('GET', '/api/couponRecords/countUser', function () {
      it('should success get count user', function() {
        console.log(this.res.body)
      });
    })
  });
});