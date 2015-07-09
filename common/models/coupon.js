module.exports = function(Coupon) {

  Coupon.cancel = function (code, next) {
    Coupon.app.wechat.consumeCode(code, null, function (err, result) {
      if(err) {
        next(err);
      } else {
        next(err, result.card);
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
      if(result.errcode !== 0) next(result);

      var wechat = Coupon.app.wechat;
      var url = wechat.showQRCodeURL(result.ticket);
      var desc = '请点击下面链接打开二维码以后，扫描或者长按二维码领取卡卷。';
      wechat.sendText(coupon.openid, desc+url, next);
    });
  };

  Coupon.remoteMethod(
    'delivery',
    {
      accepts: {arg: 'coupon', type: 'object', http: {source: 'body'}},
      returns: {arg: 'data', type: 'object', root: true}
    }
  );
  
};
