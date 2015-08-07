var loopback = require('loopback');

module.exports = function(CouponRecord) {
  
  CouponRecord.observe('access', function limitToScope(ctx, next) {
    ctx.query.order = ctx.query.order || ['use_time DESC'];
    ctx.query.where = ctx.query.where || {};
    ctx.query.where.token = process.env.BEEWX_TOKEN;
    var context = loopback.getCurrentContext();
    var currentUser = context && context.get('currentUser');
    if(currentUser.companyId > 0) {
      // Before cancel code, coupon/company info need been query for check
      ctx.query.where.and = [
        {
          or:[
            {company_id: currentUser.companyId },
            {company_id: 0 }
          ]
        }
      ];
    }
    // console.log('-----', JSON.stringify(ctx.query.where))
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
  
  CouponRecord.receiptUrl = function (receipt, next) {
    CouponRecord.app.oss.getSignedUrl('getObject', {
      Bucket: 'petrojs-receipt',
      Key: receipt,
      Expires: 60
    }, next);
  };
  CouponRecord.remoteMethod(
    'receiptUrl',
    {
      accepts: {arg: 'receipt', type: 'string'},
      returns: {arg: 'url', type: 'string'},
      http: {path: '/receiptUrl', verb: 'GET'}
    }
  );
};
