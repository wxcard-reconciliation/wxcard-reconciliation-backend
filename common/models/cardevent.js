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
        delete msg.id;
        instance.updateAttributes(msg, next);
      }
    });
  };
  
  Cardevent.saveCode = function (msg, next) {
    async.parallel([
      function attachWXUser(callback) {
        Cardevent.app.models.wxclient.findById(msg.FromUserName, function (err, result) {
          if(!err && !result) {
            Cardevent.app.models.wxclient.fetchUser(msg.FromUserName, callback);
          } else {
            callback(err, result);
          }
        });
      },
      function attachCard(callback) {
        Cardevent.app.models.card.findById(msg.CardId, function (err, result) {
          if(!err && !result) {
            Cardevent.app.models.card.fetchCard(msg.CardId, callback);
          } else {
            callback(err, result);
          }
        });
      }
    ], function (err, results) {
      msg.wxclient = results[0];
      msg.card = results[1];
      if(!msg.CreateTime || msg.CreateTime === '') {
        msg.CreateTime = Math.round(Date.now()/1000);
      }
      Cardevent.create(msg, next);
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
    ctx.query.order = ctx.query.order || ['CreateTime DESC'];
    ctx.query.where = ctx.query.where || {};
    if(ctx.query.where.id) {
      if(typeof ctx.query.where.id === 'number') {
        ctx.query.where.id = ctx.query.where.id.toString();
      }
    } else {
      var context = loopback.getCurrentContext();
      var currentUser = context && context.get('currentUser');
      if(currentUser && currentUser.poi) {
        // Before cancel code, coupon/company info need been query for check
        ctx.query.where.and = [
          {
            or:[
              {"cancelBy.poi.id": currentUser.poi.id },
              {"status": {neq: "consumed"} }
            ]
          }
        ];
      }
    }
    console.log('-----', JSON.stringify(ctx.query.where));
    next();
  });
  
};
