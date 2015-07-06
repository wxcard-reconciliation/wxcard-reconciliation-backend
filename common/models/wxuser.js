module.exports = function(Wxuser) {

  Wxuser.observe('access', function limitToToken(ctx, next) {
    ctx.query.where = ctx.query.where || {};
    ctx.query.where.token = process.env.BEEWX_TOKEN;
    next();
  });
};
