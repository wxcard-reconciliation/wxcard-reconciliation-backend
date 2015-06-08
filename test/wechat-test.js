var WechatAPI = require('wechat-api');
var api = new WechatAPI(process.env.WX_APPID, process.env.WX_APPSECRET);

var lt = require('loopback-testing');
var assert = require('assert');
var app = require('../server/server.js'); 
var querystring = require('querystring')


describe.only('Wechat API', function() {
  lt.beforeEach.withApp(app);
  
  describe.skip('#User', function() {
    var users = []
    it('should success get user list', function(done) {
      api.getFollowers(function (err, result) {
        console.log(result)
        users = result.data.openid
        done(err)
      })
    });
    
    it('should get User Info', function(done) {
      var count = 0;
      users.forEach(function (openid) {
        api.getUser(openid, function (err, result) {
          console.log(result)
          if(++count === users.length) done(err)
        });
      })
    });
  });
  
  describe('#Wechatuse', function() {
    // this.timeout(5000)
    var qs = querystring.stringify({
      limit: 5,
      skip:0
    })
    lt.describe.whenCalledRemotely('GET', '/api/wechatusers?'+qs, function () {
      it('should success get users', function() {
        console.log(this.res.body.data.users)
      });
    });
  });
});