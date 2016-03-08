var lt = require('loopback-testing');
var assert = require('assert');
var app = require('../server/server.js'); 
var querystring = require('querystring')

lt.beforeEach.withApp(app);
lt.beforeEach.withUserModel('account');

var users = require('./fixtures/users');

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
    
});

describe('# WXMessage Card Event', function() {
  
  describe('## Get Card', function() {
    lt.describe.whenCalledRemotely('POST', '/api/wxmessages', {
      ToUserName: 'zyjshkez',
      FromUserName: 'oAtUNsxlV2L7LuV_ZmyIYseszAZ0',
      CreateTime: Math.round(Date.now()/1000),
      MsgType: 'event',
      Event: 'user_get_card',
      CardId: 'pAtUNs-HV0evhGTWbU3ohp99tW7k',
      IsGiveByFriend: 0,
      UserCardCode: "6977066979",
      OuterId: 0
    }, function () {
      it('should success', function(done) {
        // console.log(this.res.body);
        assert.equal(this.res.statusCode, 200);
        done()
      });
    });
  });
  
  describe.skip('## Donate Card', function() {
    lt.describe.whenCalledRemotely('POST', '/api/wxmessages', {
      ToUserName: 'zyjshkez',
      FromUserName: 'oAtUNs_WhBwy3QiftzLuk6aihKlU',
      FriendUserName: 'oAtUNsxlV2L7LuV_ZmyIYseszAZ0',
      CreateTime: Math.round(Date.now()/1000),
      MsgType: 'event',
      Event: 'user_get_card',
      CardId: 'pAtUNs-HV0evhGTWbU3ohp99tW7k',
      IsGiveByFriend: 1,
      UserCardCode: '006977066970',
      OldUserCardCode: '006977066979',
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
      UserCardCode: '6977066979',
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

describe('# WXMessage SCAN', function() {
  
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

describe('# WXMessage SEND', function() {
  this.timeout(0);

  lt.beforeEach.givenLoggedInUser(users.cashier);

  describe('## card message', function() {
    lt.describe.whenCalledRemotely('POST', '/api/wxmessages/send', {
      "touser":"oAtUNs_WhBwy3QiftzLuk6aihKlU", 
      "msgtype":"wxcard",
      "card":{
        "card_id":"pAtUNszgOkzyobBItkpo3aSSbSKM"
      }
    }, function () {
      it('should be ok', function(done) {
        console.log(this.res.body);
        done();
      });
      lt.it.shouldBeAllowed();
    });
  });
  
  describe('## template message', function() {
    lt.describe.whenCalledRemotely('POST', '/api/wxmessages/send', {
      "touser":"oAtUNs8jOg2PFOoofurBkJTfPOto", 
      "msgtype":"template",
      "templateId": "gp6CymJZj890Yzd-J7sLYzGgqnaBfZBwj479799aaxE",
      "url":"http://weixin.qq.com/download",
      "data":{
        "first": {
          "value":"恭喜您中奖！",
          "color":"#173177"
        },
        "program": {
          "value":"贺岁迎春天天刮刮乐！",
          "color":"#173177"
        },
        "result": {
          "value": "三等奖",
          "color":"#173177"
        },
        "remark": {
          "value": "请点击消息领取奖券",
          "color":"#173177"
        }
      }
    }, function () {
      it('should be ok', function(done) {
        console.log(this.res.body);
        done();
      });
    });
  });
});

describe('# WXMessage', function() {
  
  describe('## Consume By Mobile Helper', function() {
    
    lt.describe.whenCalledRemotely('POST', '/api/wxmessages', {
      "MsgType": "event",
      "Event": "user_consume_card",
      "CardId": "pAtUNszgOkzyobBItkpo3aSSbSKM",
      "ConsumeSource": "FROM_MOBILE_HELPER",
      "CreateTime": 1451891411,
      "FriendUserName": "oAtUNs_WhBwy3QiftzLuk6aihKlU",
      "FromUserName": "oAtUNs8jOg2PFOoofurBkJTfPOto",
      "IsGiveByFriend": 1,
      "LocationName": "",
      "OldUserCardCode": "992325005846",
      "OuterId": 0,
      "StaffOpenId": "oAtUNs_WhBwy3QiftzLuk6aihKlU",
      "UserCardCode": "953490754746"
    }, function () {
      it('should ok', function(done) {
        console.log(this.res.body);
        done()
      });
    });
    
  });
  
});