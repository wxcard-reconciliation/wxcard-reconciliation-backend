var lt = require('loopback-testing');
var assert = require('assert');
var app = require('../server/server.js'); 
var querystring = require('querystring')

lt.beforeEach.withApp(app);
lt.beforeEach.withUserModel('account');

var users = require('./fixtures/users');
var campaigns = require('./fixtures/campaigns')

describe('Campaign', function() {
  
  lt.beforeEach.givenLoggedInUser(users.cashier);
  
  describe('# Create', function() {
    lt.describe.whenCalledRemotely('POST', '/api/campaigns', campaigns[0], function () {
      it('should success', function(done) {
        console.log(this.res.body)
        done();
      });
    });
  });
  
  describe('# Find with pois', function() {
    var qs = querystring.stringify({filter: JSON.stringify({
      include: ['pois']
    })});
    lt.describe.whenCalledRemotely('GET', '/api/campaigns?'+qs, function () {
      it('should ok', function(done) {
        console.log(this.res.body)
        done();
      });
    });
  });
  
});

describe('# Client', function() {
  lt.describe.whenCalledRemotely('PUT', '/api/campaignclients', {
    campaignId: '56ee52c08f264bc6741baf02',
    wxclientId: 'oAtUNs_WhBwy3QiftzLuk6aihKlU'
    // wxclientId: 'oAtUNs---j6-4mULzspdC17qO81U'
  }, function () {
    it('should success', function(done) {
      console.log(this.res.body);
      setTimeout(done, 1000);
    });
  });
});
