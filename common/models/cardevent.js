var async = require('async');

module.exports = function(Cardevent) {

  Cardevent.updateStatus = function (code, status, next) {
    Cardevent.updateAll({
      id: code
    }, {status: status}, function (err, info) {
      if(next) next(err, '');
    });
  };
  
  Cardevent.user_get_card = function (msg, next) {
    msg.status = 'got';
    if(msg.IsGiveByFriend) {
      Cardevent.updateStatus(msg.OldUserCardCode, 'donated');
    }

    async.parallel([
      function attachWXUser(callback) {
        Cardevent.app.models.wxuser.findById(msg.FromUserName, callback);
      },
      function attachCard(callback) {
        Cardevent.app.models.card.findById(msg.CardId, callback);
      }
    ], function (err, results) {
      msg.wxuser = results[0];
      msg.card = results[1];
      msg.id = msg.UserCardCode;
      delete msg.UserCardCode;
      Cardevent.upsert(msg, function (err, instance) {
        console.log('----', arguments);
        next(err, '')
      })
      // Cardevent.findOrCreate({
      //   where:{UserCardCode: msg.UserCardCode}
      // }, msg, function (err, instance, isNew) {
      //   console.log('----', arguments);
      //   next(err, '')
      // });
    });
  };
  
  Cardevent.user_consume_card = function (msg, next) {
    Cardevent.updateStatus(msg.UserCardCode, 'consumed', next);
  };
  
  Cardevent.user_del_card = function (msg, next) {
    Cardevent.updateStatus(msg.UserCardCode, 'deleted', next);
  };
};
