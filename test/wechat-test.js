var WechatAPI = require('wechat-api');
var api = new WechatAPI(process.env.WX_APPID, process.env.WX_APPSECRET);

var lt = require('loopback-testing');
var assert = require('assert');
var app = require('../server/server.js'); 
var querystring = require('querystring')

var loggedInUser = {email:"gbo2@example.com", password: "123456", id: 123456}

describe('Wechat API', function() {
  describe('#User', function() {
    var users = []
    it('should success get user list', function(done) {
      api.getFollowers(function (err, result) {
        // console.log(result)
        users = result.data.openid
        done(err)
      })
    });
    
    it('should get User Info', function(done) {
      var count = 0;
      users.forEach(function (openid) {
        api.getUser(openid, function (err, result) {
          // console.log(result)
          if(++count === users.length) done(err)
        });
      })
    });
  });
  
});

describe('#Wechatuse', function() {
  lt.beforeEach.withApp(app);
  lt.beforeEach.givenLoggedInUser(loggedInUser);
  
  var qs = querystring.stringify({
    limit: 5,
    skip:0
  })
  lt.describe.whenCalledRemotely('GET', '/api/wechatusers?'+qs, function () {
    it('should success get users', function() {
      assert.equal(this.res.statusCode, 200);
      // console.log(this.res.body.data.users)
    });
  });
});

describe('# Coupon', function() {
  it('should success issue', function(done) {
    api.createQRCode({
      card_id: 'p2sNkuPxb3PR_vZGJGb32lipWtHI',
      expire_seconds: '60',
      is_unique_code: true,
      out_id: 1
    }, function (err, result) {
      var url = api.showQRCodeURL(result.ticket)
      console.log(url)
      done()
    })
  });
});

describe('# Short Url', function() {
  it('should success convert long2short', function(done) {
   var longurl =  'http://fusion.qq.com/app_download?appid=1104658877&platform=qzone&via=QZ.MOBILEDETAIL.QRCODE'
   api.shorturl(longurl, function (err, result) {
     console.log(result);
     done();
   })
  });
});