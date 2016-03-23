module.exports = function(Campaignclient) {

  Campaignclient.observe('before save', function (ctx, next) {
    if(ctx.isNewInstance && ctx.instance) {
      ctx.instance.created = new Date();
      Campaignclient.app.models.wxclient.fetchUser(ctx.instance.wxclientId, function (err, user) {
        ctx.instance.wxclient = user || {subscribe: 0, id: ctx.instance.wxclientId};
        next(err);
      });
    } else {
      next();
    }
  });

};
