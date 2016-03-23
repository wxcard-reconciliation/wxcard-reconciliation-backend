module.exports = function(Campaignclient) {

  Campaignclient.observe('before save', function (ctx, next) {
    if(ctx.isNewInstance && ctx.instance) {
      ctx.instance.created = new Date();
    }
    next();
  });

};
