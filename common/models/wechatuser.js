module.exports = function(Wechatuser) {

  Wechatuser.find = function (filter, next) {
    filter = filter || {}
    var limit = filter.limit || 10
    filter.skip = filter.skip || 0
    Wechatuser.app.wechat.getFollowers(function (err, result) {
      if(err) return next(err)
      var count = 0;
      var base = limit*filter.skip;
      limit = Math.min(limit, result.data.openid.length-base);
      result.data.users = [];
      for (var i = base; i < base+limit; i++) {
        Wechatuser.app.wechat.getUser(result.data.openid[i], function (err, user) {
          result.data.users.push(user || {})
          if(++count === limit) {
            delete result.data.openid;
            next(null, result);
          }
        });
      }
    })
  }
  
  Wechatuser.remoteMethod(
    'find',
    {
      accepts: {arg: 'filter', type: 'object', http: { source: 'form' }},
      returns: {arg: 'data', type: 'object', root: true},
      http: {path: '/', verb: 'GET'}
    }
  )
};
