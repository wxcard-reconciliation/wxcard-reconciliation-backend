var WechatAPI = require('wechat-api');

module.exports = function(app) {
  /*
   * The `app` object provides access to a variety of LoopBack resources such as
   * models (e.g. `app.models.YourModelName`) or data sources (e.g.
   * `app.datasources.YourDataSource`). See
   * http://docs.strongloop.com/display/public/LB/Working+with+LoopBack+objects
   * for more info.
   */
  app.wechat = new WechatAPI(process.env.WX_APPID, process.env.WX_APPSECRET, function (next) {
    app.models.wxaccesstoken.findOne({where: {appid: process.env.WX_APPID}}, function (err, token) {
      if(!err && token) {
        next(null, {accessToken: token.accesstoken, expireTime: token.time*1000});
      } else {
        next(err);
      }
    });
  }, function (token, next) {
    var expireTime = Math.round(token.expireTime/1000)
    app.models.wxaccesstoken.findOrCreate({where: {appid: process.env.WX_APPID}}, {
      appid: process.env.WX_APPID,
      accesstoken: token.accessToken,
      time: expireTime
    }, function (err, instance) {
      if(err) return next(err);
      instance.updateAttributes({
        accesstoken: token.accessToken,
        time: expireTime
      }, next)
    })
  });
};
