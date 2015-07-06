var lt = require('loopback-testing');
var assert = require('assert');
var app = require('../server/server.js'); 
var querystring = require('querystring')

var loggedInUser = {email:"gbo2@example.com", password: "123456", id: 233, companyId: 4}

describe('Coupon', function() {
  lt.beforeEach.withApp(app);
  lt.beforeEach.withUserModel('account');
  lt.beforeEach.givenLoggedInUser(loggedInUser);
  
  describe('#Find Coupon', function() {
    lt.describe.whenCalledRemotely('GET', '/api/coupons', function () {
      it('should success get coupon', function() {
        assert.equal(this.res.statusCode, 200);
      });
    });
  });
  
  describe('#Find Coupon Record', function() {
    var filter = {
      order: 'add_time DESC',
      where:{
        // use_time:{between:[1433956235, Date.now()/1000]},
        cancel_code: '383022229292'
      },
      include: ['coupon', 'wxuser', 'company'],
      limit: 10,
      skip: 0
    }
    var qs = querystring.stringify({filter: JSON.stringify(filter)})
    lt.describe.whenCalledRemotely('GET', '/api/couponRecords?'+qs, function () {
      it('should success get coupon records', function() {
        console.log(this.res.body, this.res.body.length)
      });
    });
  });
  
  describe('#Count count User', function() {
    lt.describe.whenCalledRemotely('GET', '/api/couponRecords/countUser', function () {
      it('should success get count user', function() {
        assert.equal(this.res.statusCode, 200);
      });
    })
  });
  
  describe('# Cancel code', function() {
    this.timeout(10000)
    lt.describe.whenCalledRemotely('POST', '/api/coupons/cancel', {
      code: '070539146169'
    }, function () {
      it('should success cancel code', function() {
        assert.equal(this.res.statusCode, 200);
      });
    })
  });
  
});

describe.only('# Cancel code error', function() {
  lt.beforeEach.withApp(app);
  lt.describe.whenCalledUnauthenticated('POST', '/api/coupons/cancel', {
    code: '070539146169'
  }, function () {
    it('should be forbidden', function() {
      // console.log(this.res.body)
      assert.equal(this.res.statusCode, 401);
    });
  })
});
