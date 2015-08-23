var lt = require('loopback-testing');
var assert = require('assert');
var app = require('../server/server.js'); 
var querystring = require('querystring')
var request = require('request');
var punycode = require('punycode');

lt.beforeEach.withApp(app);
lt.beforeEach.withUserModel('account');

var loggedInUser = {username: "13912345678", email:"13912345678@example.com", password: "123456", id: 2}

describe('# WXClient', function() {
  this.timeout(0);
  lt.beforeEach.givenLoggedInUser(loggedInUser);
  
  describe.only('## Sync', function() {
    lt.describe.whenCalledRemotely('POST', '/api/wxclients/sync', {}, function () {
      it('should success', function() {
        // console.log(this.res.body);
        assert.equal(this.res.statusCode, 200);
      });
    });   
  });
  
});

describe('## Sync2', function() {
  var apiurl = "https://api.weixin.qq.com/cgi-bin/user/info?access_token=byKh6zRYf2Vwci5vBXm-svyt9TSvanQdJXQc3SM5uTYybtm4xJnNNxKXV_15ECjtn0MscrKR3f6TbzSmwq0iOkALhvYZ3m0J-8SR-fFEAKk&openid=oAtUNsweXUu7EA7mSWNy95_u3VMA&&lang=zh_CN"
  it('should ok', function(done) {
    request({url: apiurl}, function (err, res, body) {
      console.log(body);
      console.log(JSON.parse(body.replace(/[\u0000-\u001F]/g, "")));
      done()
    })
  });
});

describe('# Invalidate JSON String', function() {
  var str = '{"user_info_list":[{"subscribe":1,"openid":"oAtUNsweXUu7EA7mSWNy95_u3VMA","nickname":"孙元骥","sex":1,"language":"zh_CN","city":"","province":"\\n\u000e\u0088117.135.170.22","country":"","headimgurl":"http:\\/\\/wx.qlogo.cn\\/mmopen\\/TTQibyKjricky3CLjODtasIOqLYvzs0OTQWPwqRA2Zu6PQIl8uYpDlLr1SF40kmEH3u1f0NlvqknRSG3mib5u1RplEvvaHWTfCu\\/0","subscribe_time":1437700764,"remark":"","groupid":0}]}';
  it('should ok', function() {
    str = str.replace(/[\u0000-\u001f\u0080-\u009f]/g, "");
    console.log(str);
    console.log(JSON.parse(str));
  });
});

describe('# Invalidate JSON String', function() {
  var str = '{"user_info_list":[{"subscribe":1,"openid":"oAtUNs4nYe4hBW9bh6lqCJFmuDGY","nickname":"\\躲茬角落看天倥\"","sex":1,"language":"zh_CN","city":"Yangzhou","province":"Jiangsu","country":"China","headimgurl":"http:\/\/wx.qlogo.cn\/mmopen\/ajNVdqHZLLAqicRtUE4bfOJkpvRNv5wDSFbHjqowBMhvZ96qVylab12QK7MrF9gPiaYhP0gej6w4xFhkLsbFId2Q\/0","subscribe_time":1438232032,"remark":"","groupid":0}]}';
  
  var escMap = {
    '"': '\\"',       // \u0022
    '\\': '\\\\',     // \u005c
    '\b': '\\b',      // \u0008 
    '\f': '\\f',      // \u000c
    '\n': '\\n',      // \u000a
    '\r': '\\r',      // \u000d
    '\t': '\\t'       // \u0009
  };
  var escFunc = function (m) { 
    return escMap[m] || '\\u' + (m.charCodeAt(0) + 0x10000).toString(16).substr(1); 
  };
  var escRE = /[\u0000-\u001F\u005C]/g;
  it('should ok', function() {
    str = str.replace(escRE, escFunc);
    console.log(str);
    JSON.parse(str);
  });
});
