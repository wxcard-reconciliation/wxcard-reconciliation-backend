module.exports = function(Account) {
  
  Account.createConsumer  = function (ctx, next) {
    next = next || function () {};
    var username = ctx.instance.wxclient.username;
    var locationId = ctx.instance.poi && ctx.instance.poi.poi_id;
    if(username) {
      Account.app.wechat.addConsumer(username, locationId, function () {
        console.log(arguments);
        next();
      });
    } else {
      next();
    }
  };
  
  Account.observe('after save', function (ctx, next) {
    // console.log(ctx.instance);
    // console.log('supports isNewInstance?', ctx.isNewInstance !== undefined);
    if(ctx.isNewInstance && ctx.instance) {
      Account.createConsumer(ctx);
    }
    next();
  });

};
