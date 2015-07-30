var WechatAPI = require('wechat-api');
var api = new WechatAPI(process.env.WX_APPID, process.env.WX_APPSECRET);

var lt = require('loopback-testing');
var assert = require('assert');
var app = require('../server/server.js'); 
var querystring = require('querystring');
var request = require('request');

var loggedInUser = {email:"gbo2@example.com", password: "123456", id: 233};
var poiurl = 'http://apis.map.qq.com/lbscloud/v1/poi/search?';

describe.only('# Fetch POI from apis.map.qq.com', function() {
  this.timeout(10000)
  it('should success get poi of gas stations', function(done) {
    var qs = querystring.stringify({
      poi_table: 'gas_station',
      key: 'RGGBZ-CPSHD-QG54O-P53UE-3AIV5-HIFNS',
      orderby: 'distance(31.94414175,118.81311756)',
      boundary: 'nearby(31.94414175,118.81311756,500000)',
      page_size: 10,
      page_index: 1
    });
    request({url: poiurl+qs}, function (err, res, body) {
      console.log(body);
    });
  });
});

describe('# POI', function() {
  lt.beforeEach.withApp(app);
  lt.beforeEach.withUserModel('account');
  lt.beforeEach.givenLoggedInUser(loggedInUser);  
  
  describe('##Find', function() {
    var qs = querystring.stringify({filter: JSON.stringify({
      where: {"name": {like: "%江宁%"}},
      limit: 10,
      skip: 0
    })});
    lt.describe.whenCalledRemotely('GET', '/api/companies?'+qs, function () {
      it('should success get comanpayies', function() {
        console.log(this.res.body, this.res.body.length)
      });
    });
  });
  
  describe('## Sync from wechat', function() {
    this.timeout(10000)
    lt.describe.whenCalledRemotely('POST', '/api/pois', {
      begin: 0
    }, function () {
      it('should success sync', function() {
        console.log(this.res.body)
      });
    })
  });
}); 