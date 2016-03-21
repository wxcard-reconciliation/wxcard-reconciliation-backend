module.exports = function(Account) {
  
  Account.observe('before save', function (ctx, next) {
    if(ctx.isNewInstance && ctx.instance) {
      ctx.instance.created = new Date();
      ctx.instance.lastUpdated = new Date();
    }
    next();
  });
  
  Account.addConsumer  = function (options, next) {
    next = next || function () {};
    if(options.username) {
      Account.app.wechat.addConsumer(options.username, options.locationId, function () {
        next();
      });
    } else {
      next();
    }
  };
  
  Account.remoteMethod(
    'addConsumer',
    {
      accepts: {arg: 'options', type: 'object', http: {source: 'body'}},
      returns: {arg: 'data', type: 'object', root: true}
    }
  );
  
  Account.observe('after save', function (ctx, next) {
    if(ctx.isNewInstance && ctx.instance) {
      var username = ctx.instance.wxclient && ctx.instance.wxclient.username;
      var locationId = ctx.instance.poi && ctx.instance.poi.poi_id;
      Account.addConsumer({username: username, locationId: locationId});
    }
    next();
  });

};
