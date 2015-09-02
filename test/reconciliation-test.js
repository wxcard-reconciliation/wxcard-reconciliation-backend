var lt = require('loopback-testing');
var assert = require('assert');
var app = require('../server/server.js'); 
var querystring = require('querystring')

lt.beforeEach.withApp(app);
lt.beforeEach.withUserModel('account');

var users = require('./fixtures/users');

describe('# Reconciliation', function() {
  
  lt.beforeEach.givenLoggedInUser(users.cashier);

  describe('## Try reconciliating', function() {
    var now = Math.round(Date.now()/1000);
    lt.describe.whenCalledRemotely('POST', '/api/reconciliations/try', {
      BeginTime: now-86400,
      EndTime: now
    }, function () {
      it('should success', function() {
        console.log(this.res.body);
      });
    });
  });
});