module.exports = function(Cardevent) {

  Cardevent.updateStatus = function (code, status, next) {
    Cardevent.updateAll({
      UserCardCode: code
    }, {status: status}, function (err, info) {
      // console.log('====',arguments);
      if(next) next(err, '');
    });
  };
  
  Cardevent.user_get_card = function (msg, next) {
    msg.status = 'got';
    if(msg.IsGiveByFriend) {
      Cardevent.updateStatus(msg.OldUserCardCode, 'donated');
    }

    Cardevent.findOrCreate({
      where:{UserCardCode: msg.UserCardCode}
    }, msg, function (err, instance, isNew) {
      // console.log('----', arguments);
      next(err, '')
    });
  };
  
  Cardevent.user_consume_card = function (msg, next) {
    Cardevent.updateStatus(msg.UserCardCode, 'consumed', next);
  };
  
  Cardevent.user_del_card = function (msg, next) {
    Cardevent.updateStatus(msg.UserCardCode, 'deleted', next);
  };
};
