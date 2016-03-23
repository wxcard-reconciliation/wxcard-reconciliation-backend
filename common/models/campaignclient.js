module.exports = function(Campaignclient) {

  Campaignclient.observe('before save', function (ctx, next) {
    if(ctx.instance) {
      ctx.instance.created = new Date();
      Campaignclient.app.models.wxclient.fetchUser(ctx.instance.wxclientId, function (err, user) {
        if(err) return next(err);
        delete user.accesstoken;
        ctx.instance.wxclient = user || {subscribe: 0, id: ctx.instance.wxclientId};
        next();
      });
    } else {
      next();
    }
  });

};
