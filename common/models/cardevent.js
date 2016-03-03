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
  
  function format_code(code) {
    return code.length < 12 ? format_code('0'+code) : code;
  }
  
  Cardevent.user_get_card = function (msg, next) {
    msg.status = 'got';
    msg.id = format_code(msg.UserCardCode.toString());
    delete msg.UserCardCode;
    // console.log(msg);
    
    if(msg.IsGiveByFriend) {
      msg.OldUserCardCode = msg.OldUserCardCode.toString();
      Cardevent.updateCode({
        UserCardCode: msg.OldUserCardCode,
        'status':'donated'
      });
    }

    Cardevent.saveCode(msg, next);
  };
  
  Cardevent.cancelBy = function (msg, next) {
    if(msg.ConsumeSource === 'FROM_MOBILE_HELPER') {
      Cardevent.app.models.Account.findOne({
        where: {"wxclient.id": msg.StaffOpenId}
      }, function (err, instance) {
        if(err) {
          console.log(err);
        } else {
          msg.cancelBy = instance;
        }
        next(null, msg);
      });
    } else {
      next(null, msg);
    }
  };
  
  Cardevent.user_consume_card = function (msg, next) {
    msg.UserCardCode = format_code(msg.UserCardCode.toString());
    msg.status = 'consumed';
    msg.cancelTime = msg.CreateTime;
    
    Cardevent.cancelBy(msg, function (err, msg) {
      Cardevent.updateCode(msg, next);
    });
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
    // console.log('-----', JSON.stringify(ctx.query.where));
    next();
  });
  
  Cardevent.statcity = function (filter, next) {
    var where = filter.where || {};
    var Model = Cardevent;
    var connector = Model.getDataSource().connector
    var collection = connector.collection(Model.modelName)
    // console.log(JSON.stringify(where));
    var project = {city: {$ifNull:["$wxclient.city", ""]}};
    var group = {_id: "$city", count: {$sum: 1}};
    for (var i = 0; i < where.CardId.$in.length; i++) {
      var isCard = {$eq: [where.CardId.$in[i], "$card.id"]};
      var consumed = "consumed_card"+i
      project[consumed] = {$cond: [{$and: [isCard, {$eq: ["$status", "consumed"]}]}, 1, 0]};
      group[consumed] = {$sum: "$"+consumed};
      var donated = "donated_card"+i
      project[donated] = {$cond: [{$and: [isCard, {$eq: ["$status", "donated"]}]}, 1, 0]};
      group[donated] = {$sum: "$"+donated};
      var count = "count_card"+i
      project[count] = {$cond: [isCard, 1, 0]};
      group[count] = {$sum: "$"+count};
    }
    // console.log(project);
    collection.aggregate([
      { $match: where },
      { $project: project },
      { $group: group },
      { $sort: {count: -1}},
      { $skip: filter.skip || 0},
      { $limit: filter.limit || 10}
    ], next);    
  }
  
  Cardevent.remoteMethod(
    'statcity',
    {
      accepts: {arg: 'filter', type: 'object', http: { source: 'query' }},
      returns: {arg: 'data', type: 'array', root: true},
      http: {path: '/statcity', verb: 'GET'},
      description: ["statistic card event such as got/consumed of city"]
    }
  );
  
  
  Cardevent.statpoi = function (filter, next) {
    var where = filter.where || {};
    var Model = Cardevent;
    var connector = Model.getDataSource().connector
    var collection = connector.collection(Model.modelName)
    var project = {branch_name: "$cancelBy.poi.branch_name", city: "$cancelBy.poi.city"};
    var group = {_id: {"name": "$branch_name", city: "$city"}, count: {$sum: 1}};
    for (var i = 0; i < where.CardId.$in.length; i++) {
      var isCard = {$eq: [where.CardId.$in[i], "$card.id"]};
      var count = "count_card"+i
      project[count] = {$cond: [isCard, 1, 0]};
      group[count] = {$sum: "$"+count};
    }
    // console.log(project);
    where.status = 'consumed';
    // console.log(JSON.stringify(where));
    collection.aggregate([
      { $match: where },
      { $project: project },
      { $group: group },
      { $sort: {count: -1}},
      { $skip: filter.skip || 0},
      { $limit: filter.limit || 50}
    ], next); 
  }
  
  Cardevent.remoteMethod(
    'statpoi',
    {
      accepts: {arg: 'filter', type: 'object', http: { source: 'query' }},
      returns: {arg: 'data', type: 'array', root: true},
      http: {path: '/statpoi', verb: 'GET'},
      description: ["statistic card event consumed of poi"]
    }
  );
  
};
