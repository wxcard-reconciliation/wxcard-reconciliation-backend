var lt = require('loopback-testing');
var assert = require('assert');
var app = require('../server/server.js'); 
var querystring = require('querystring')

lt.beforeEach.withApp(app);

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
  
  describe('## Subscribe Event', function() {
    lt.describe.whenCalledRemotely('POST', '/api/wxmessages', {
      ToUserName: 'zyjshkez',
      FromUserName: 'o2sNkuH9b_Q6E3ABpBKvHUUQiktI',
      CreateTime: '1438936030',
      MsgType: 'event',
      Event: 'subscribe'
    }, function () {
      it('should success', function(done) {
        console.log(this.res.body);
        assert.equal(this.res.statusCode, 200);
        done()
      });
    });
    
    lt.describe.whenCalledRemotely('POST', '/api/wxmessages', {
      ToUserName: 'zyjshkez',
      FromUserName: 'o2sNkuH9b_Q6E3ABpBKvHUUQiktI',
      CreateTime: Math.round(Date.now()/1000),
      MsgType: 'event',
      Event: 'unsubscribe'
    }, function () {
      it('should success unsubscribe', function(done) {
        console.log(this.res.body);
        done();
      });
    });
  });
});

