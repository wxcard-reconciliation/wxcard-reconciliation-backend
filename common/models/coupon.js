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
};
