var lt = require('loopback-testing');
var assert = require('assert');
var app = require('../server/server.js'); 
var querystring = require('querystring')

lt.beforeEach.withApp(app);
lt.beforeEach.withUserModel('account');

var loggedInUser = {email:"gbo2@example.com", password: "123456", id: 233, companyId: 4}
var gasstationUser = {email:"stations@example.com", password: "123456", id: 333, job: '加油站长', companyId:4}
describe('Coupon', function() {
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
      // order: ['add_time DESC'],
      where:{
        is_use: {gt: 0}
        // use_time:{between:[1433956235, Date.now()/1000]},
        // cancel_code: '383022229292'
      },
      include: ['coupon', 'wxuser', 'company'],
      limit: 10,
      skip: 0
    }
    var qs = querystring.stringify({filter: JSON.stringify(filter)})
    lt.describe.whenCalledRemotely('GET', '/api/couponRecords?'+qs, function () {
      it('should success get coupon records', function() {
        this.res.body.forEach(function (item) {
          console.log(item.use_time, item.is_use, item.id);
        })
        // console.log(this.res.body, this.res.body.length)
      });
    });
  });
  
  describe('# Get Receipt Signed Url', function() {
    this.timeout(10000);
    var filter = {
      receipt: 'sample.jpg'
    }
    var qs = querystring.stringify({filter: JSON.stringify(filter)})
    lt.describe.whenCalledRemotely('GET', '/api/couponRecords/receiptUrl?receipt=sample.jpg', function () {
      it('should success get receipt signed url', function() {
        console.log(this.res.body);
      });
    })
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
      code: '804328683411',
      receipt: 'receipt.jpg'
    }, function () {
      it('should success cancel code', function() {
        assert.equal(this.res.statusCode, 200);
      });
    })
  });
  
  describe('# Delivery card', function() {
    this.timeout(10000)
    lt.describe.whenCalledRemotely('POST', '/api/coupons/delivery', {
      card_id: 'p2sNkuI1l8tpQMM2taeJGufBjC7o',
      openid: 'o2sNkuOLxSKDVL5SkO-Gsc4OFDbY'
    }, function () {
      it('should success cancel code', function() {
        assert.equal(this.res.statusCode, 200);
      });
    })
  });
  
  describe('# Sync cards from wechat', function() {
    // this.timeout(10000)
    lt.describe.whenCalledRemotely('POST', '/api/coupons/sync', {
      offset: 0
    }, function () {
      it('should success sync cards', function() {
        assert.equal(this.res.statusCode, 200);
      });
    })
  });
});

describe('# Cancel code error', function() {

  lt.describe.whenCalledUnauthenticated('POST', '/api/coupons/cancel', {
    code: '070539146169'
  }, function () {
    it('should be forbidden', function() {
      assert.equal(this.res.statusCode, 401);
    });
  })
  
});

describe('# Gasstation', function() {
  
  describe('## Cancel code', function() {
    lt.describe.whenCalledByUser(gasstationUser, 'POST', '/api/coupons/cancel', {
      code: '689285956012'
    }, function () {
      it('should success cancel by gasstation', function() {
        console.log(this.res.body)
      });
    });
  });
});