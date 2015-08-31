var async = require('async');

module.exports = function(Cardevent) {

  Cardevent.updateCode = function (code, data, next) {
    Cardevent.findById(code, function (err, instance) {
      if(err) return next(err);
      if(!instance) {
        data.id = code;
        data.CreateTime = Math.round(Date.now()/1000);
        Cardevent.saveCode(data, next);
      } else {
        instance.updateAttributes(data, next);
      }
    });
  };
  
  Cardevent.saveCode = function (msg, next) {
    async.parallel([
      function attachWXUser(callback) {
        Cardevent.app.models.wxclient.findById(msg.FromUserName, callback);
      },
      function attachCard(callback) {
        Cardevent.app.models.card.findById(msg.CardId, callback);
      }
    ], function (err, results) {
      msg.wxclient = results[0];
      msg.card = results[1];
      Cardevent.upsert(msg, next);
    });
  }
    
  Cardevent.user_get_card = function (msg, next) {
    msg.status = 'got';
    msg.id = msg.UserCardCode;
    delete msg.UserCardCode;
    
    if(msg.IsGiveByFriend) {
      Cardevent.updateCode(msg.OldUserCardCode, {'status':'donated'});
    }

    Cardevent.saveCode(msg, next);
  };
  
  Cardevent.user_consume_card = function (msg, next) {
    Cardevent.updateCode(msg.UserCardCode, {'status':'consumed'}, next);
  };
  
  Cardevent.user_del_card = function (msg, next) {
    Cardevent.updateCode(msg.UserCardCode, {'status':'deleted'}, next);
  };
};
