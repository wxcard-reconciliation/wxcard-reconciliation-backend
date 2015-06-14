var lt = require('loopback-testing');
var assert = require('assert');
var app = require('../server/server.js'); 
var querystring = require('querystring')

var loggedInUser = {email:"gbo2@example.com", password: "123456", id: 233}

describe.only('Coupon', function() {
  // this.timeout(10000)
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
      // where:{use_time:{between:[1433956235, Date.now()/1000]}},
      includeWechatuser: true,
      include: ['coupon', 'company'],
      limit: 25,
      skip: 0
    }
    var qs = querystring.stringify({filter: JSON.stringify(filter)})
    lt.describe.whenCalledRemotely('GET', '/api/couponRecords?'+qs, function () {
      it('should success get coupon records', function() {
        console.log(this.res.body)
        // assert.equal(this.res.statusCode, 200);
      });
    });
  });
  
  describe.skip('#Count count User', function() {
    lt.describe.whenCalledRemotely('GET', '/api/couponRecords/countUser', function () {
      it('should success get count user', function() {
        assert.equal(this.res.statusCode, 200);
      });
    })
  });
});