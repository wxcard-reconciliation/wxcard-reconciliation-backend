module.exports = function(Campaignclient) {

  Campaignclient.observe('before save', function (ctx, next) {
    if(ctx.data) {
      ctx.data.updated = new Date();
      if(!ctx.data.created) ctx.data.created = ctx.data.updated;
      
      if(ctx.data.wxclient) return next();
      Campaignclient.app.models.wxclient.fetchUser(ctx.data.wxclientId, function (err, user) {
        if(err) return next(err);
        delete user.accesstoken;
        ctx.data.wxclient = user || {subscribe: 0, id: ctx.data.wxclientId};
        next();
      });
    } else {
      next();
    }
  });

};
