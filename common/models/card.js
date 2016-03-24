var loopback = require('loopback');
var async = require('async');

module.exports = function(Card) {

  Card.fetchCard = function (cardId, next) {
    Card.app.wechat.getCard(cardId, function (err, result) {
      if(err) return next(err);
      
      var card_type = result.card.card_type.toLowerCase()
      var entity = result.card[card_type];
      var c = entity.base_info;
      c.card_type = card_type;
      for(var key in entity) {
        if(key !== 'base_info') c[key] = entity[key];
      }
      
      Card.upsert(c, next);
    });
  };
  
  Card.card_pass_check = function (msg, next) {
    Card.fetchCard(msg.CardId, next);
  };
  
  Card.card_not_pass_check = function (msg, next) {
    Card.fetchCard(msg.CardId, next);
  };

  Card.sync = function (filter, next) {
    var offset = filter && filter.offset || 0;
    var count = filter && filter.count || 50;
    Card.app.wechat.getCards(offset, count, function (err, result) {
      async.each(result.card_id_list, Card.fetchCard, function (err) {
        next(err);
      });
    })
  };
  
  Card.remoteMethod(
    'sync',
    {
      accepts: {arg: 'filter', type: 'object', http: { source: 'body' }},
      returns: {arg: 'data', type: 'object', root: true}
    }
  );
  
  Card.cancel = function (options, next) {

    var code = options.code;
    
    Card.app.wechat.consumeCode(code, null, function (err, result) {
      if(err) {
        next(err);
      } else {
        var context = loopback.getCurrentContext();
        var currentUser = context && context.get('currentUser');

        Card.app.models.Cardevent.updateCode({
          FromUserName: result.openid,
          CardId: result.card.card_id,
          UserCardCode: code,
          cancelBy: currentUser,
          cancelTime: Math.round(Date.now()/1000),
          rececipt: options.receipt,
          "status": 'consumed'
        }, next);
      }
    });
  };
  
  Card.remoteMethod(
    'cancel',
    {
      accepts: {arg: 'options', type: 'object', http: {source: 'body'}},
      returns: {arg: 'data', type: 'object', root: true}
    }
  );
  
  Card.check = function (options, next) {

    Card.app.wechat.getCode(options.code, function (err, result) {
      var msg = {UserCardCode: options.code};
      if(err) {
        switch(err.code) {
          case 40099: msg.status = 'consumed'; break;
          case 40127: msg.status = 'deleted'; break;
          default:return next(err);
        }
      } else {
        msg = {
          FromUserName: result.openid,
          CardId: result.card.card_id,
          UserCardCode: options.code,
          BeginTime: result.card.begin_time,
          EndTime: result.card.end_time
        }
      }
      Card.app.models.Cardevent.updateCode(msg, next);
    });
  };
  
  Card.remoteMethod(
    'check',
    {
      accepts: {arg: 'options', type: 'object', http: {source: 'body'}},
      returns: {arg: 'data', type: 'object', root: true}
    }
  );
  
  Card.qrcode = function (options, next) {
    var expire_seconds = options.expire_seconds || 60;
    if(options.expire_seconds) delete options.expire_seconds;

    var context = loopback.getCurrentContext();
    var currentUser = context && context.get('currentUser');
    var outId = parseInt(currentUser.poi.poi_id, 10);
    outId = Number.isNaN(outId)?0:outId;
    var card_list = options.multiple_card && options.multiple_card.card_list || [options.card];
    card_list.forEach(function (item) {
      item.outer_id = outId;
      item.is_unique_code = item.is_unique_code || true;
    })
    // console.log(JSON.stringify(options));
    Card.app.wechat.createCardQRCode(options, expire_seconds, next);
  };
  
  Card.remoteMethod(
    'qrcode',
    {
      accepts: {arg: 'options', type: 'object', http: {source: 'body'}},
      returns: {arg: 'data', type: 'object', root: true}
    }
  );
  
  Card.createCard = function (card, next) {
    Card.app.wechat.createCard(card, next);
  }

  Card.remoteMethod(
    'createCard',
    {
      accepts: {arg: 'card', type: 'object', http: {source: 'body'}},
      returns: {arg: 'data', type: 'object', root: true}
    }
  );
  
  Card.updateCard = function (card, next) {
    var type = card.card_type.toLowerCase();
    Card.app.wechat.updateCard(card.card_id, type, card[type], next);
  }

  Card.remoteMethod(
    'updateCard',
    {
      accepts: {arg: 'card', type: 'object', http: {source: 'body'}},
      returns: {arg: 'data', type: 'object', root: true}
    }
  );
};
