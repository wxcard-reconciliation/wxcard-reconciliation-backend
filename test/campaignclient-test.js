var lt = require('loopback-testing');
var assert = require('assert');
var app = require('../server/server.js'); 
var querystring = require('querystring')

lt.beforeEach.withApp(app);

var users = require('./fixtures/users');

describe('Campaign Client', function() {
  
  lt.beforeEach.withUserModel('account');
  lt.beforeEach.givenLoggedInUser(users.cashier);
  
  describe.only('Statistic', function() {
    var filter = {
      where:{
        
      },
      limit: 140,
      skip: 0
    }
    var qs = querystring.stringify({filter: JSON.stringify(filter)})
    lt.describe.whenCalledRemotely('GET', '/api/campaignclients/statcity?'+qs, function () {
      it('should success', function(done) {
        console.log(this.res.body);
        done();
      });
    });
  });
});