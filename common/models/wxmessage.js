module.exports = function(Wxmessage) {

  Wxmessage.event = {
    subscribe: 'wxclient',
    unsubscribe: 'wxclient',
    card_not_pass_check: 'card',
    card_pass_check: 'card',
    user_del_card: 'cardevent',
    user_consume_card: 'cardevent',
    user_get_card: 'cardevent'
  }
  
  Wxmessage.create = function (msg, next) {
    if(msg.ToUserName) delete msg.ToUserName;
    if(typeof msg.CreateTime == 'string') msg.CreateTime = parseInt(msg.CreateTime);
    
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
  
};
