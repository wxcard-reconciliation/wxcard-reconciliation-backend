var WechatAPI = require('wechat-api');
var api = new WechatAPI(process.env.WX_APPID, process.env.WX_APPSECRET);

var lt = require('loopback-testing');
var assert = require('assert');
var app = require('../server/server.js'); 
var querystring = require('querystring')

lt.beforeEach.withApp(app);

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

describe('# WXMessage', function() {
  describe('## Get Card', function() {
    lt.describe.whenCalledRemotely('POST', '/api/wxmessages', {
      ToUserName: 'zyjshkez',
      FromUserName: 'o2sNkuH9b_Q6E3ABpBKvHUUQiktI',
      CreateTime: Math.round(Date.now()/1000),
      MsgType: 'event',
      Event: 'user_get_card',
      CardId: 'pAtUNs-HV0evhGTWbU3ohp99tW7k',
      IsGiveByFriend: 0,
      UserCardCode: '1234567890',
      OuterId: 0
    }, function () {
      it('should success', function(done) {
        assert.equal(this.res.statusCode, 200);
        done()
      });
    });
  });
  
  describe('## Donate Card', function() {
    lt.describe.whenCalledRemotely('POST', '/api/wxmessages', {
      ToUserName: 'zyjshkez',
      FromUserName: 'o2sNkuDGXZ6ei0kXxpBkjW5akra8',
      FriendUserName: 'o2sNkuH9b_Q6E3ABpBKvHUUQiktI',
      CreateTime: Math.round(Date.now()/1000),
      MsgType: 'event',
      Event: 'user_get_card',
      CardId: 'pAtUNs-HV0evhGTWbU3ohp99tW7k',
      IsGiveByFriend: 1,
      UserCardCode: '0987654321',
      OldUserCardCode: '1234567890',
      OuterId: 0
    }, function () {
      it('should success', function(done) {
        assert.equal(this.res.statusCode, 200);
        done()
      });
    });
  });
  
  describe('## Consume Card', function() {
    lt.describe.whenCalledRemotely('POST', '/api/wxmessages', {
      ToUserName: 'zyjshkez',
      FromUserName: 'o2sNkuH9b_Q6E3ABpBKvHUUQiktI',
      CreateTime: Math.round(Date.now()/1000),
      MsgType: 'event',
      Event: 'user_consume_card',
      CardId: 'pAtUNs-HV0evhGTWbU3ohp99tW7k',
      UserCardCode: '0987654321',
      ConsumeSource: 'FROM_API'
    }, function () {
      it('should success', function(done) {
        assert.equal(this.res.statusCode, 200);
        done()
      });
    });
  });
  
  describe('## Delete Card', function() {
    var code = '451234567890';
    lt.describe.whenCalledRemotely('POST', '/api/wxmessages', {
      ToUserName: 'zyjshkez',
      FromUserName: 'o2sNkuH9b_Q6E3ABpBKvHUUQiktI',
      CreateTime: Math.round(Date.now()/1000),
      MsgType: 'event',
      Event: 'user_get_card',
      CardId: 'pAtUNs-HV0evhGTWbU3ohp99tW7k',
      IsGiveByFriend: 0,
      UserCardCode: code,
      OuterId: 0
    }, function () {
      it('should success', function(done) {
        assert.equal(this.res.statusCode, 200);
        done()
      });
    });
    
    lt.describe.whenCalledRemotely('POST', '/api/wxmessages', {
      ToUserName: 'zyjshkez',
      FromUserName: 'o2sNkuH9b_Q6E3ABpBKvHUUQiktI',
      CreateTime: Math.round(Date.now()/1000),
      MsgType: 'event',
      Event: 'user_del_card',
      CardId: 'pAtUNs-HV0evhGTWbU3ohp99tW7k',
      UserCardCode: code
    }, function () {
      it('should success', function(done) {
        assert.equal(this.res.statusCode, 200);
        done()
      });
    });
  });
  
  describe.only('## Subscribe Event', function() {
    lt.describe.whenCalledRemotely('POST', '/api/wxmessages', {
      ToUserName: 'zyjshkez',
      FromUserName: 'oAtUNs_WhBwy3QiftzLuk6aihKlU',
      CreateTime: Math.round(Date.now()/1000),
      MsgType: 'event',
      Event: 'subscribe'
    }, function () {
      it('should success', function(done) {
        console.log(this.res.body);
        // assert.equal(this.res.statusCode, 200);
        done()
      });
    })
  });
});