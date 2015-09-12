var lt = require('loopback-testing');
var assert = require('assert');
var app = require('../server/server.js'); 
var querystring = require('querystring')

lt.beforeEach.withApp(app);
lt.beforeEach.withUserModel('account');

var users = require('./fixtures/users');

describe('# Reconciliation By User2', function() {
  
  lt.beforeEach.givenLoggedInUser(users.cashier);

  var reconciliation = {}
  var now = Math.round(Date.now()/1000);

  describe('## Try && Create', function() {
    
    lt.describe.whenCalledRemotely('POST', '/api/reconciliations/try',{
      beginTime: now-86400*4,
      endTime: now-86400*1
    }, function () {
      it('should success', function(done) {
        reconciliation = this.res.body;
        done();
      });
    });
    
    lt.describe.whenCalledRemotely('POST', '/api/reconciliations', function () {
      return reconciliation;
    }, function () {
      it('should success', function(done) {
        console.log(this.res.body);
        done();
      });
    });
  });
  
  describe('## Find', function() {
    var filter = {
      order: ['beginTime ASC'],
      where:{
        // or:[
        //   {beginTime: {gt:now-86400*2}}
        // ]
      },
      limit: 10,
      skip: 0
    }
    var qs = querystring.stringify({filter: JSON.stringify(filter)})
    lt.describe.whenCalledByUser(users.cashier, 'GET', '/api/reconciliations?'+qs, function () {
      it('should success', function(done) {
        console.log(this.res.body);
        done();
      });
    })
  });
});

describe('# Reconciliation By Administrator', function() {

  lt.beforeEach.givenLoggedInUser(users.administrator);

  describe('## Find', function() {
    var filter = {
      order: ['beginTime ASC'],
      where:{
        // or:[
        //   {beginTime: {gt:now-86400*2}}
        // ]
      },
      limit: 10,
      skip: 0
    }
    var qs = querystring.stringify({filter: JSON.stringify(filter)})
    lt.describe.whenCalledByUser(users.cashier, 'GET', '/api/reconciliations?'+qs, function () {
      it('should success', function(done) {
        console.log(this.res.body);
        done();
      });
    })
  });
});