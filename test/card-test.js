var lt = require('loopback-testing');
var assert = require('assert');
var app = require('../server/server.js'); 
var querystring = require('querystring')

lt.beforeEach.withApp(app);
lt.beforeEach.withUserModel('account');

var users = require('./fixtures/users');
var cards = require('./fixtures/cards');

describe('# Card', function() {
  
  lt.beforeEach.givenLoggedInUser(users.cashier);
  
  describe('## Delivery QRCode', function() {
    lt.describe.whenCalledRemotely('POST', '/api/cards/qrcode', {
      "expire_seconds": 1800,
      "card": {
        // "openid": "oAtUNs_WhBwy3QiftzLuk6aihKlU",
        "card_id": "pAtUNs1c3cBtMs5KeL8FP1f3fOaE"
      }
      // "multiple_card": {
      //   "card_list": [
      //     {
      //       // "openid": "oAtUNs_WhBwy3QiftzLuk6aihKlU",
      //       "card_id": "pAtUNs-HV0evhGTWbU3ohp99tW7k"
      //     },
      //     {
      //       // "openid": "oAtUNs_WhBwy3QiftzLuk6aihKlU",
      //       "card_id": "pAtUNs1c3cBtMs5KeL8FP1f3fOaE"
      //     }
      //   ]
      // }
    }, function () {
      it('should success get', function() {
        console.log(this.res.body);
        assert.equal(this.res.statusCode, 200);
      });
    });
  });
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
  
  describe.only('## Create Card', function() {
    this.timeout(15000)
    console.log(cards[0]);
    lt.describe.whenCalledRemotely('POST', '/api/cards/createCard', cards[0], function () {
      it('should success', function(done) {
        console.log(this.res.body);
        done()
      });
    })
  });
});