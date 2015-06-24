var loopback = require('loopback');

module.exports = function(CouponRecord) {
  
  CouponRecord.observe('access', function limitToScope(ctx, next) {
    var context = loopback.getCurrentContext()
    var currentUser = context && context.get('currentUser');
    if(currentUser.companyId) {
      ctx.query.where = {company_id:currentUser.companyId};
    }
    next();
  });
  
  // CouponRecord.afterRemote('**', function (ctx, instance, next) {
  //   if(ctx.result && ctx.req.method === 'GET'
  //   && ctx.req.query && ctx.req.query.filter) {
  //
  //     var filter = JSON.parse(ctx.req.query.filter);
  //     if(!filter.includeWechatuser) return next();
  //
  //     if(Array.isArray(ctx.result)) {
  //       var count = 0;
  //       var len = ctx.result.length;
  //       ctx.result.forEach(function (result) {
  //         CouponRecord.app.wechat.getUser(result.wecha_id, function (err, user) {
  //           result.wechatuser = user || {};
  //           if(++count === len) next();
  //         });
  //       });
  //     } else {
  //       CouponRecord.app.wechat.getUser(result.wecha_id, function (err, user) {
  //         result.wechatuser = user;
  //         next();
  //       });
  //     }
  //   } else {
  //     next();
  //   }
  // });
  
  CouponRecord.countUser = function (filter, next) {
    CouponRecord.getDataSource().connector.query('SELECT count(distinct wecha_id) FROM tp_member_card_coupon_record;', function (err, result) {
      if(err) {
        next(err);
      } else {
        next(err, { count:result[0]['count(distinct wecha_id)'] });
      }
    })
  };
  
  CouponRecord.remoteMethod(
    'countUser',
    {
      accepts: {arg: 'filter', type: 'object', http: { source: 'form' }},
      returns: {arg: 'data', type: 'object', root: true},
      http: {path: '/countUser', verb: 'GET'}
    }
  );
};
