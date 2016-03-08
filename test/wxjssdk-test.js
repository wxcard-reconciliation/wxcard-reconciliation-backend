var lt = require('loopback-testing');
var assert = require('assert');
var app = require('../server/server.js'); 
var querystring = require('querystring')

lt.beforeEach.withApp(app);

describe('# Wechat JSSDK API', function() {
  
  describe('## Get openid via OAuth', function() {
    var code = '03196e9c0e8b4fff485d33f2953775ax';
    var qs = querystring.stringify({code: code});
    lt.describe.whenCalledRemotely('GET', '/api/wxaccesstokens/getoauthaccesstoken?'+qs, function () {
      it('should success', function(done) {
        console.log(this.res.body);
        done();
      });
    });    
  });
  
  describe.only('## Get User By code', function() {
    var qs = querystring.stringify({code: '04192f2bcecb59d3e0477bc1fef17d8y'});
    lt.describe.whenCalledRemotely('GET', '/api/wxaccesstokens/getuserbycode?'+qs, function () {
      it('should success', function(done) {
        console.log(this.res.body);
        done();
      });
    });    
  });
  
  describe('## Get JS Config', function() {
    var param = {
      debug: true,
      jsApiList: ['addCard']
    }
    var qs = querystring.stringify({param: JSON.stringify(param)});
    lt.describe.whenCalledRemotely('GET', '/api/wxaccesstokens/getjsconfig?'+qs, function () {
      it('should success', function(done) {
        console.log(this.res.body);
        done();
      });
    });    
  });
  
  describe('## Get JS CardExt', function() {
    var param = {
      card_id: "pGsPwt8rfPfl8A7DBrhVTlUdYPHQ"
    }
    var qs = querystring.stringify({param: JSON.stringify(param)});
    lt.describe.whenCalledRemotely('GET', '/api/wxaccesstokens/getcardext?'+qs, function () {
      it('should success', function(done) {
        console.log(this.res.body);
        setTimeout(done, 1000);
      });
    });
  });
});