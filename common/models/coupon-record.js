module.exports = function(CouponRecord) {
  
  CouponRecord.afterRemote('**', function (ctx, instance, next) {
    if(ctx.result && ctx.req.method === 'GET'
    && ctx.req.query && ctx.req.query.filter) {
      
      var filter = JSON.parse(ctx.req.query.filter);
      if(!filter.includeWechatuser) return next();
      
      if(Array.isArray(ctx.result)) {
        var count = 0;
        var len = ctx.result.length;
        ctx.result.forEach(function (result) {
          CouponRecord.app.wechat.getUser(result.wecha_id, function (err, user) {
            result.wechatuser = user || {};
            if(++count === len) next();
          });
        });
      } else {
        CouponRecord.app.wechat.getUser(result.wecha_id, function (err, user) {
          result.wechatuser = user;
          next();
        });
      }
    } else {
      next();
    }
  });
};
