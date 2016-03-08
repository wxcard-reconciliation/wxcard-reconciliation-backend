module.exports = function(Wxaccesstoken) {

  Wxaccesstoken.getJsConfig = function (param, next) {
    Wxaccesstoken.app.wechat.getJsConfig(param, next);
  };
  
  Wxaccesstoken.remoteMethod(
    'getJsConfig',
    {
      accepts: {arg: 'param', type: 'object', http: { source: 'query' }},
      returns: {arg: 'data', type: 'object', root: true},
      http: {path: '/getjsconfig', verb: 'GET'},
      description: ["Get Wechat JSSDK API ticket"]
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
