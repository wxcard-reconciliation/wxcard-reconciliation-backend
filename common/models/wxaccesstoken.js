module.exports = function(Wxaccesstoken) {

  Wxaccesstoken.getOAuthAccessToken = function (code, next) {
    Wxaccesstoken.app.oauth.getAccessToken(code, function (err, accessToken) {
      next(err, accessToken.data);
    });
  };
  
  Wxaccesstoken.remoteMethod(
    'getOAuthAccessToken',
    {
      accepts: {arg: 'code', type: 'string', http: { source: 'query' }},
      returns: {arg: 'data', type: 'object', root: true},
      http: {path: '/getoauthaccesstoken', verb: 'GET'},
      description: ["Get Wechat OAuth access token"]
    }
  );
  
  Wxaccesstoken.getUserByCode = function (code, next) {
    var that = Wxaccesstoken.app.oauth;
    that.getAccessToken(code, function (err, result) {
      if (err) {
        return next(err);
      }
      that.getUser({openid: result.data.openid, lang: 'zh_CN'}, next);
    });
  };
  
  Wxaccesstoken.remoteMethod(
    'getUserByCode',
    {
      accepts: {arg: 'code', type: 'string', http: { source: 'query' }},
      returns: {arg: 'data', type: 'object', root: true},
      http: {path: '/getuserbycode', verb: 'GET'},
      description: ["Get Wechat OAuth user by code"]
    }
  );  
  
  Wxaccesstoken.getJsConfig = function (param, next) {
    Wxaccesstoken.app.wechat.getJsConfig(param, next);
  };
  
  Wxaccesstoken.remoteMethod(
    'getJsConfig',
    {
      accepts: {arg: 'param', type: 'object', http: { source: 'query' }},
      returns: {arg: 'data', type: 'object', root: true},
      http: {path: '/getjsconfig', verb: 'GET'},
      description: ["Get Wechat JSSDK API config"]
    }
  );
  
  Wxaccesstoken.getCardExt = function (param, next) {
    Wxaccesstoken.app.wechat.getCardExt(param, next);
  };
  
  Wxaccesstoken.remoteMethod(
    'getCardExt',
    {
      accepts: {arg: 'param', type: 'object', http: { source: 'query' }},
      returns: {arg: 'data', type: 'object', root: true},
      http: {path: '/getcardext', verb: 'GET'},
      description: ["Get Wechat JSSDK CARD extension ticket"]
    }
  );

};
