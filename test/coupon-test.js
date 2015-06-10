var lt = require('loopback-testing');
var assert = require('assert');
var app = require('../server/server.js'); 
var querystring = require('querystring')

describe.only('Coupon', function() {
  lt.beforeEach.withApp(app);
  
  describe('#Find Coupon Record', function() {
    var qs = querystring.stringify({
      include: 'coupon'
      limit: 5,
      skip:0
    })
    lt.describe.whenCalledRemotely('GET', '/api/coupon-records?'+qs, function () {
      it('should success get users', function() {
        console.log(this.res.body)
      });
    });
  });
});