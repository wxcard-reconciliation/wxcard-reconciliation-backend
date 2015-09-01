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
          rececipt: options.receipt,
          CreateTime: Math.round(Date.now()/1000),
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
};
