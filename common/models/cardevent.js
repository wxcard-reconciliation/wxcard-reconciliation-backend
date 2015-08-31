var async = require('async');

module.exports = function(Cardevent) {

  Cardevent.updateCode = function (msg, next) {
    msg.id = msg.UserCardCode.toString();
    delete msg.UserCardCode;

    Cardevent.findById(msg.id, function (err, instance) {
      if(err) return next(err);
      if(!instance) {
        Cardevent.saveCode(msg, next);
      } else {
        instance.updateAttributes(msg, next);
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
    msg.id = msg.UserCardCode.toString();
    delete msg.UserCardCode;
    
    if(msg.IsGiveByFriend) {
      msg.OldUserCardCode = msg.OldUserCardCode.toString();
      Cardevent.updateCode({
        UserCardCode: msg.OldUserCardCode,
        'status':'donated'
      });
    }

    Cardevent.saveCode(msg, next);
  };
  
  Cardevent.user_consume_card = function (msg, next) {
    msg.status = 'consumed';
    Cardevent.updateCode(msg, next);
  };
  
  Cardevent.user_del_card = function (msg, next) {
    msg.status = 'deleted';
    Cardevent.updateCode(msg, next);
  };
};
