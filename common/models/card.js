var loopback = require('loopback');
var async = require('async');

module.exports = function(Card) {

  Card.sync = function (filter, next) {
    var offset = filter && filter.offset || 0;
    var count = filter && filter.count || 50;
    Card.app.wechat.getCards(offset, count, function (err, result) {
      async.each(result.card_id_list, function (card_id, callback) {
        Card.app.wechat.getCard(card_id, function (err, result) {
          if(err) return callback(err);
          
          var card_type = result.card.card_type.toLowerCase()
          var entity = result.card[card_type];
          var c = entity.base_info;
          c.card_type = card_type;
          for(var key in entity) {
            if(key !== 'base_info') c[key] = entity[key];
          }
          Card.findOrCreate({
            where: {id: c.id}
          }, c, function (err, instance, isNew) {
            if(err) return callback(err);
            if(!isNew) instance.updateAttributes(c, callback);
            else callback();
          });
        });
      }, function (err) {
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
    console.log(options);
    var code = options.code;
    
    function updateConsumeInfo(card_id) {
      var context = loopback.getCurrentContext()
      var currentUser = context && context.get('currentUser');
      var updateData = {
        cacnelBy: currentUser
      };
      if(options.receipt) updateData.receipt = options.receipt;

      Card.app.models.cardEvent.updateAll({
        id: code
      }, updateData, function (err, result) {
        next(err, {card_id: card_id});
      });
    };
    
    Card.app.wechat.consumeCode(code, null, function (err, result) {
      if(err) {
        next(err);
      } else {
        updateConsumeInfo(result.card.card_id);
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
