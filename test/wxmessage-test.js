var lt = require('loopback-testing');
var assert = require('assert');
var app = require('../server/server.js'); 
var querystring = require('querystring')

lt.beforeEach.withApp(app);

describe('# WXMessage Card', function() {

  describe('## Card Pass Check', function() {
    lt.describe.whenCalledRemotely('POST', '/api/wxmessages', {
      ToUserName: 'zyjshkez',
      FromUserName: 'oAtUNsxlV2L7LuV_ZmyIYseszAZ0',
      CreateTime: Math.round(Date.now()/1000),
      MsgType: 'event',
      Event: 'card_pass_check',
      CardId: 'pAtUNs-HV0evhGTWbU3ohp99tW7k'
    }, function () {
      it('should success', function(done) {
        assert.equal(this.res.statusCode, 200);
        done()
      });
    });
    
    lt.describe.whenCalledRemotely('POST', '/api/wxmessages', {
      ToUserName: 'zyjshkez',
      FromUserName: 'oAtUNsxlV2L7LuV_ZmyIYseszAZ0',
      CreateTime: Math.round(Date.now()/1000),
      MsgType: 'event',
      Event: 'card_not_pass_check',
      CardId: 'pAtUNs-HV0evhGTWbU3ohp99tW7k'
    }, function () {
      it('should success', function(done) {
        assert.equal(this.res.statusCode, 200);
        done()
      });
    });
  });
    
  describe('## Get Card', function() {
    lt.describe.whenCalledRemotely('POST', '/api/wxmessages', {
      ToUserName: 'zyjshkez',
      FromUserName: 'oAtUNsxlV2L7LuV_ZmyIYseszAZ0',
      CreateTime: Math.round(Date.now()/1000),
      MsgType: 'event',
      Event: 'user_get_card',
      CardId: 'pAtUNs-HV0evhGTWbU3ohp99tW7k',
      IsGiveByFriend: 0,
      UserCardCode: 123456789012,
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
      FromUserName: 'oAtUNs_WhBwy3QiftzLuk6aihKlU',
      FriendUserName: 'oAtUNsxlV2L7LuV_ZmyIYseszAZ0',
      CreateTime: Math.round(Date.now()/1000),
      MsgType: 'event',
      Event: 'user_get_card',
      CardId: 'pAtUNs-HV0evhGTWbU3ohp99tW7k',
      IsGiveByFriend: 1,
      UserCardCode: '210987654321',
      OldUserCardCode: '123456789012',
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
      FromUserName: 'oAtUNs_WhBwy3QiftzLuk6aihKlU',
      CreateTime: Math.round(Date.now()/1000),
      MsgType: 'event',
      Event: 'user_consume_card',
      CardId: 'pAtUNs-HV0evhGTWbU3ohp99tW7k',
      UserCardCode: '210987654321',
      ConsumeSource: 'FROM_API'
    }, function () {
      it('should success', function(done) {
        assert.equal(this.res.statusCode, 200);
        done()
      });
    });
  });
  
});

describe('# WXMessage', function() {
  
  describe('## Delete Card', function() {
    var code = '451234567890';
    lt.describe.whenCalledRemotely('POST', '/api/wxmessages', {
      ToUserName: 'zyjshkez',
      FromUserName: 'oAtUNs_WhBwy3QiftzLuk6aihKlU',
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
      FromUserName: 'oAtUNs_WhBwy3QiftzLuk6aihKlU',
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
      "ToUserName": "zyjshkez",
      "FromUserName": "oAtUNs_WhBwy3QiftzLuk6aihKlU",
      "CreateTime": "1438936030",
      "MsgType": "event",
      "Event": "subscribe"
    }, function () {
      it('should success', function(done) {
        console.log(this.res.body);
        assert.equal(this.res.statusCode, 200);
        done()
      });
    });
    
    lt.describe.whenCalledRemotely('POST', '/api/wxmessages', {
      ToUserName: 'zyjshkez',
      FromUserName: 'oAtUNs_WhBwy3QiftzLuk6aihKlU',
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

describe.only('# WXMessage SCAN', function() {
  
  describe('## when subscribed', function() {
    lt.describe.whenCalledRemotely('POST', '/api/wxmessages', {
      "ToUserName": "zyjshkez",
      "FromUserName": "oAtUNs_WhBwy3QiftzLuk6aihKlU",
      "CreateTime": Math.round(Date.now()/1000),
      "MsgType": "event",
      "Event": "SCAN",
      "EventKey": "poi_223941789",
      "Ticket": "gQG67zoAAAAAAAAAASxodHRwOi8vd2VpeGluLnFxLmNvbS9xL1NFUHFzclBsaV9QeUtzVmZBbXNlAAIEXqTxVQMEAAAAAA=="
    }, function () {
      lt.it.shouldBeAllowed();
    });
  });
  
  describe('## when unsubscribed', function() {
    lt.describe.whenCalledRemotely('POST', '/api/wxmessages', {
      "ToUserName": "zyjshkez",
      "FromUserName": "oAtUNs_WhBwy3QiftzLuk6aihKlU",
      "CreateTime": Math.round(Date.now()/1000),
      "MsgType": "event",
      "Event": "subscribe",
      "EventKey": "qrscene_poi_223941789",
      "Ticket": "gQG67zoAAAAAAAAAASxodHRwOi8vd2VpeGluLnFxLmNvbS9xL1NFUHFzclBsaV9QeUtzVmZBbXNlAAIEXqTxVQMEAAAAAA=="
    }, function () {
      lt.it.shouldBeAllowed();
    });
  });
});

