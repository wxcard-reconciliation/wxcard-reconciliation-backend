module.exports = function(Account) {
  
  Account.observe('before save', function (ctx, next) {
    if(ctx.isNewInstance && ctx.instance) {
      ctx.instance.created = new Date();
      ctx.instance.lastUpdated = new Date();
    }
    next();
  });
  
  Account.createConsumer  = function (ctx, next) {
    next = next || function () {};
    var username = ctx.instance.wxclient && ctx.instance.wxclient.username;
    var locationId = ctx.instance.poi && ctx.instance.poi.poi_id;
    if(username) {
      Account.app.wechat.addConsumer(username, locationId, function () {
        next();
      });
    } else {
      next();
    }
  };
  
  Account.observe('after save', function (ctx, next) {
    if(ctx.isNewInstance && ctx.instance) {
      Account.createConsumer(ctx);
    }
    next();
  });

};
