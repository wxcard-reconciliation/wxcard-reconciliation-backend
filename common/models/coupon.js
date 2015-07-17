var loopback = require('loopback');
var async = require('async');

module.exports = function(Coupon) {

  Coupon.cancel = function (code, next) {
    
    function updateCompanyId(card_id) {
      var context = loopback.getCurrentContext()
      var currentUser = context && context.get('currentUser');

      // console.log(code, card_id, currentUser.companyId)
      Coupon.app.models.couponRecord.updateAll({
        cancel_code: code, 
        card_id: card_id
      }, {
        company_id: currentUser.companyId
      }, next);
    };
    
    Coupon.app.wechat.consumeCode(code, null, function (err, result) {
      if(err) {
        next(err);
      } else {
        updateCompanyId(result.card.card_id);
        // next(err, result.card);
      }
    });
  };
  
  Coupon.remoteMethod(
    'cancel',
    {
      accepts: {arg: 'code', type: 'string'},
      returns: {arg: 'data', type: 'object', root: true}
    }
  );
  
  Coupon.delivery = function (coupon, next) {
    Coupon.app.wechat.createQRCode({
      card_id: coupon.card_id,
      // openid: coupon.openid,
      is_unique_code: true,
      out_id: 1
    }, function (err, result) {
      if(err) return next(err);
      if(result.errcode !== 0) return next(result);

      var wechat = Coupon.app.wechat;
      var url = wechat.showQRCodeURL(result.ticket);
      wechat.shorturl(url, function (err, result) {
        var desc = '请点击下面链接打开二维码以后，扫描或者长按二维码领取卡卷。';
        wechat.sendText(coupon.openid, desc+result.short_url, next);
      });
    });
  };

  Coupon.remoteMethod(
    'delivery',
    {
      accepts: {arg: 'coupon', type: 'object', http: {source: 'body'}},
      returns: {arg: 'data', type: 'object', root: true}
    }
  );
  
  Coupon.sync = function (filter, next) {
    var offset = filter && filter.offset || 0;
    var count = filter && filter.count || 100;
    Coupon.app.wechat.getCards(offset, count, function (err, result) {
      async.each(result.card_id_list, function (card_id, callback) {
        Coupon.app.wechat.getCard(card_id, function (err, result) {
          // console.log(result.card)
          var types = ['GROUPON', 'DISCOUNT', 'GIFT', 'CASH', 'GENERAL_COUPON', 'MEMBER_CARD', 'SCENIC_TICKET', 'MOVIE_TICKET', 'BOARDING_PASS', 'MEETING_TICKET', 'BUS_TICKET'];
          var card_type = result.card.card_type;
          var card = result.card[card_type.toLowerCase()];
          var i = card.base_info
          var c = {
            id: i.id,
            brand_name: i.brand_name,
            color: i.color,
            create_time: i.create_time,
            info: i.notice,
            integral: 0,
            is_weixin: 1,
            is_check: 0,
            logourl: i.logo_url,
            people: 0,
            title: i.title,
            total: i.sku.quantity,
            type: types.indexOf(card_type),
            company_id: 0,
            pic: '',
            group: 0,
            attr: '0',
            price: 0,
            gift_name: '',
            least_cost: 0,
            reduce_cost: 0,
            statdate: 0,
            enddate: 0,
            token: process.env.BEEWX_TOKEN
          }
          if(i.date_info.type === 'DATE_TYPE_FIX_TIME_RANGE') {
            c.enddate = i.date_info.end_timestamp;
            c.statdate = i.date_info.begin_timestamp;
          }
          if(i.status === 'CARD_STATUS_VERIFY_OK'
          || i.status === 'CARD_STATUS_USER_DISPATCH') {
            c.is_check = 1;
          }
          c.is_delete = i.status === 'CARD_STATUS_USER_DELETE' ? 1:0;
          if(card_type === 'GIFT') c.gift_name = card.gift || '';
          if(card_type === 'CASH') {
            c.least_cost = card.least_cost || 0;
            c.reduce_cost = card.reduce_cost || 0;
          }
          Coupon.findOrCreate({
            where: { id: c.id}
          }, c, function (err, instance, isNew) {
            // console.log(arguments)
            if(err) return callback(err);
            if(!isNew) instance.updateAttributes(c, callback);
            else callback();
          });
        });
      }, function (err) {
        next(err, result);
      });
    })
  };
  
  Coupon.remoteMethod(
    'sync',
    {
      accepts: {arg: 'filter', type: 'object', http: { source: 'form' }},
      returns: {arg: 'data', type: 'object', root: true}
    }
  );
};
