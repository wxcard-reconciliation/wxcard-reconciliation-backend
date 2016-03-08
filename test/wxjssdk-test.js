var lt = require('loopback-testing');
var assert = require('assert');
var app = require('../server/server.js'); 
var querystring = require('querystring')

lt.beforeEach.withApp(app);

describe('# Wechat JSSDK API', function() {
  
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
  
  describe.only('## Get JS CardExt', function() {
    var param = {
      card_id: "pGsPwt8rfPfl8A7DBrhVTlUdYPHQ"
    }
    var qs = querystring.stringify({param: JSON.stringify(param)});
    lt.describe.whenCalledRemotely('GET', '/api/wxaccesstokens/getcardext?'+qs, function () {
      it('should success', function(done) {
        console.log(this.res.body);
        done();
      });
    });
  });
});