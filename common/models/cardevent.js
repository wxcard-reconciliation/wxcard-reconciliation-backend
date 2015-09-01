var loopback = require('loopback');
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
  
  Cardevent.observe('access', function limitToScope(ctx, next) {
    ctx.query.order = ctx.query.order || ['use_time DESC'];
    ctx.query.where = ctx.query.where || {};
    if(ctx.query.where.id) ctx.query.where.id = ctx.query.where.id.toString();
    var context = loopback.getCurrentContext();
    var currentUser = context && context.get('currentUser');
    if(currentUser && currentUser.poi) {
      // Before cancel code, coupon/company info need been query for check
      ctx.query.where.and = [
        {
          or:[
            {"cancelBy.poi.id": currentUser.poi.id },
            {"status": "got" }
          ]
        }
      ];
    }
    // console.log('-----', JSON.stringify(ctx.query.where))
    next();
  });
  
};
