var WechatAPI = require('wechat-api');

module.exports = function(app) {
  /*
   * The `app` object provides access to a variety of LoopBack resources such as
   * models (e.g. `app.models.YourModelName`) or data sources (e.g.
   * `app.datasources.YourDataSource`). See
   * http://docs.strongloop.com/display/public/LB/Working+with+LoopBack+objects
   * for more info.
   */
  var appid = process.env.WX_APPID;
  var appsecret = process.env.WX_APPSECRET;
  app.wechat = new WechatAPI(appid, appsecret, function (next) {
    app.models.wxaccesstoken.findOne({where: {appid: appid}}, function (err, token) {
      if(!err && token) {
        next(null, {accessToken: token.accesstoken, expireTime: token.time*1000});
      } else {
        next(err);
      }
    });
  }, function (token, next) {
    var expireTime = Math.round(token.expireTime/1000);
    app.models.wxaccesstoken.findOrCreate({where: {appid: appid}}, {
      appid: appid,
      accesstoken: token.accessToken,
      time: expireTime
    }, function (err, instance) {
      if(err) return next(err);
      if(instance) {
        instance.updateAttributes({
          accesstoken: token.accessToken,
          time: expireTime
        }, next);
      }
      else next();
    });
  });
  
  app.wechat.registerTicketHandle(function getTicketToken(type, next) {
    app.models.wxaccesstoken.findOne({where: {appid: appid}}, function (err, token) {
      if(!err && token) {
        next(null, {ticket: token[type+'_ticket'], expireTime: token[type+'_time']*1000});
      } else {
        next(err);
      }
    });
  }, function saveTicketToken(type, token, next) {
    var expireTime = Math.round(token.expireTime/1000);
    var data = {appid: appid};
    data[type+'_ticket'] = token.ticket;
    data[type+'_time'] = expireTime;
    app.models.wxaccesstoken.findOrCreate({where: {appid: appid}}, data, function (err, instance) {
      if(err) return next(err);
      if(instance) {
        instance.updateAttributes(data, next);
      }
      else next();
    });
  })
};
