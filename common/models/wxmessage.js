module.exports = function(Wxmessage) {

  Wxmessage.event = {
    subscribe: 'wxclient',
    unsubscribe: 'wxclient',
    SCAN: 'wxmessage',
    card_not_pass_check: 'card',
    card_pass_check: 'card',
    user_del_card: 'cardevent',
    user_consume_card: 'cardevent',
    user_get_card: 'cardevent'
  }
  
  Wxmessage.create = function (msg, next) {
    if(msg.ToUserName) delete msg.ToUserName;
    
    if(msg.MsgType === 'event') {
      var handler = this.app.models[this.event[msg.Event]][msg.Event] || function () {
        next(null, "");
      };
      delete msg.MsgType;
      delete msg.Event;
      handler(msg, next);
    } else {
      next(null, "");
    }
  }
  
  Wxmessage.remoteMethod(
    'create',
    {
      accepts: {arg: 'msg', type: 'object', http: { source: 'body' }},
      returns: {arg: 'data', type: 'string', root: true},
      http: {path: '/', verb: 'POST'}
    }
  );
  
  Wxmessage.SCAN = function (msg, next) {
    console.log('SCAN Event:',msg);
    var found = ''
    if((found = msg.EventKey.match(/^poi_/i))
    || (found = msg.EventKey.match(/^qrscene_poi_/i))) {
      Wxmessage.app.models.checkin.create({
        poi_id: msg.EventKey.substr(found[0].length),
        client_id: msg.FromUserName,
        CreateTime: msg.CreateTime
      }, next);
    } else {
      next();
    }
  };
};
