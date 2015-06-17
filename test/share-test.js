var lt = require('loopback-testing');
var assert = require('assert');
var app = require('../server/server.js'); 
var querystring = require('querystring')

describe('Share', function() {
  lt.beforeEach.withApp(app);
  
  describe('##Stat', function() {
    var filter = {
      limit: 25,
      skip: 0
    }
    var qs = querystring.stringify({filter: JSON.stringify(filter)})
    lt.describe.whenCalledRemotely('GET', '/api/shares/stat?'+qs, function () {
      it('should success stat', function() {
        console.log(this.res.body)
        // assert.equal(this.res.statusCode, 200);
      });
    });
  });
});