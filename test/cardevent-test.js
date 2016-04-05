var lt = require('loopback-testing');
var assert = require('assert');
var app = require('../server/server.js'); 
var querystring = require('querystring')

lt.beforeEach.withApp(app);

var users = require('./fixtures/users');

describe('# Cardevent By Cashier', function() {

  lt.beforeEach.withUserModel('account');
  lt.beforeEach.givenLoggedInUser(users.cashier);
  
  describe('## Find', function() {
    var filter = {
      // order: ['CreateTime DESC'],
      where:{
        id: {inq: ['891399341333']}
      },
      limit: 10,
      skip: 0
    }
    var qs = querystring.stringify({filter: JSON.stringify(filter)})
    lt.describe.whenCalledRemotely('GET', '/api/cardevents?'+qs, function () {
      it('should success', function(done) {
        console.log(this.res.body);
        done();
      });
    });
  });
  
  describe('## Statistic City', function() {
    var filter = {
      where:{
        CardId: {$in: [
          'pAtUNsyggXkmG15LTyoEPDGZWPrA',
          'pAtUNs941xXpR6s6FwV22ygbnZFk',
          'pAtUNswA_P0V5tDJKeKv0P7EqF5I',
          'pAtUNs1sa1uyTOpAgvflCDBT67wc',
          'pAtUNs33uwFIOrbw6BVy23yYBLZo',
          'pAtUNs9RpArHsBJNsMIOkKOcvxbo',
          'pAtUNs7xMlcsH77tFiZYJEPz-gH4',
          'pAtUNs7zY1vW_JDYW6jln-hWWYc0',
          'pAtUNsxoq4aEMV2shSjBMKeRHgsA'
        ]}
      },
      limit: 30,
      skip: 0
    }
    var qs = querystring.stringify({filter: JSON.stringify(filter)})
    lt.describe.whenCalledRemotely('GET', '/api/cardevents/statcity?'+qs, function () {
      it('should success', function(done) {
        console.log(this.res.body);
        done();
      });
    });
  });
  
  describe('## Statistic Branch', function() {
    var filter = {
      where:{
        CardId: {$in: [
          'pAtUNsyggXkmG15LTyoEPDGZWPrA',
          'pAtUNs941xXpR6s6FwV22ygbnZFk',
          'pAtUNswA_P0V5tDJKeKv0P7EqF5I',
          'pAtUNs1sa1uyTOpAgvflCDBT67wc',
          'pAtUNs33uwFIOrbw6BVy23yYBLZo',
          'pAtUNs9RpArHsBJNsMIOkKOcvxbo',
          'pAtUNs7xMlcsH77tFiZYJEPz-gH4',
          'pAtUNs7zY1vW_JDYW6jln-hWWYc0',
          'pAtUNsxoq4aEMV2shSjBMKeRHgsA'
        ]}
      },
      limit: 50,
      skip: 0
    }
    var qs = querystring.stringify({filter: JSON.stringify(filter)})
    lt.describe.whenCalledRemotely('GET', '/api/cardevents/statpoi?'+qs, function () {
      it('should success', function(done) {
        console.log(this.res.body);
        done();
      });
    });
  });
});