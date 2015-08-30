var WechatAPI = require('wechat-api');
var api = new WechatAPI(process.env.WX_APPID, process.env.WX_APPSECRET);

var assert = require('assert');

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

describe('# Wechat POI', function() {
  describe('getPois', function() {
    it('should ok', function(done) {
      api.getPois(0, 5, function (err, result) {
        console.log(result.business_list);
        done();
      });
    });
  });
});