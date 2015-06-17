module.exports = function(Company) {

  Company.observe('access', function limitToToken(ctx, next) {
    ctx.query.where = {token:process.env.BEEWX_TOKEN};
    next();
  });

};
