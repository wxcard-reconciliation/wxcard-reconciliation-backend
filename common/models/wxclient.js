var async = require('async');

module.exports = function(Wxclient) {

  Wxclient.getUsers = function (openids, next) {
    var getUser = function (openid, callback) {
      console.log('openid', openid);
      Wxclient.app.wechat.getUser(openid, function (err, result) {
        if(err) console.log('====',err, result);
        if(err) return callback(err);

        result.id = result.openid;
        delete result.openid;
        Wxclient.upsert(result, callback);
      });
    }
    async.eachLimit(openids, 10, getUser, function (err) {
      if(next) next(err, openids);
    });
  }
  
  Wxclient.on('GET_USERS', Wxclient.getUsers);
  
  Wxclient.sync = function (filter, next) {

    var openids = [];
    
    function getFollowers(err, result) {
      if(err) return next(err);
      
      if(result.next_openid === '') {
        Wxclient.emit('GET_USERS', openids, next);
        // next(err, openids);
      } else {
        if(result.count > 0) {
          openids = openids.concat(result.data.openid);
        }
        Wxclient.app.wechat.getFollowers(result.next_openid, getFollowers);
      }
    };
    
    async.waterfall([
      function (callback) {
        Wxclient.findOne({order: 'subscribe_time DESC'}, callback);
      },
      function (client, callback) {
        var openid = client && client.id || null;
        if(openid) {
          Wxclient.app.wechat.getFollowers(openid, callback);
        } else {
          Wxclient.app.wechat.getFollowers(callback);
        }
      }
    ], getFollowers);
  };
  
  Wxclient.remoteMethod(
    'sync',
    {
      accepts: {arg: 'filter', type: 'object', http: { source: 'body' }},
      returns: {arg: 'data', type: 'object', root: true}
    }
  );

};
