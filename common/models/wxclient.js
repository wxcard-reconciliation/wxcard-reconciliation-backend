var async = require('async');

module.exports = function(Wxclient) {

  Wxclient.getUsers = function (openids, next) {
    var batchGetUsers = function (openids, callback) {
      Wxclient.app.wechat.batchGetUsers(openids, function (err, result) {
        if(err) {
          if(err.name === 'WeChatAPIJSONResponseFormatError') {
            result = JSON.parse(result.replace(/[\u0000-\u001F]/g, ''));
          } else {
            console.log('====', result);
            // return callback(err, result);
          }
        }
        
        async.each(result.user_info_list, function (wxuser, callback) {
          wxuser.id = wxuser.openid;
          delete wxuser.openid;
          Wxclient.upsert(wxuser, callback);
        }, callback);
      });
    }
    var groups = [];
    while(openids.length > 0) {
      groups.push(openids.splice(0, 100));
    }
    async.eachLimit(groups, 5, batchGetUsers, function (err) {
      if(next) next(err, groups);
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

  Wxclient.subscribe = function (msg, next) {
    Wxclient.app.wechat.getUser(msg.FromUserName, function (err, wxuser) {
      if(err) return next(err);
      
      wxuser.id = wxuser.openid;
      delete wxuser.openid;
      Wxclient.upsert(wxuser, next);
    });
  };
  
  Wxclient.unsubscribe = function (msg, next) {
    Wxclient.upsert({id: msg.FromUserName, subscribe: 0}, next);
  };
};
