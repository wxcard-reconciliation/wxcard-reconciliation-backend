var loopback = require('loopback');

module.exports = function(Reconciliation) {
  
  Reconciliation.try = function (beginTime, endTime, next) {
    var context = loopback.getCurrentContext();
    var currentUser = context && context.get('currentUser');
    
    function aggregateCardEvents(beginTime, endTime, next) {
      var where = {cancelTime: {$gt: beginTime, $lte: endTime}};
      where.status = 'consumed';
      if(currentUser) {
        where['cancelBy.id'] = currentUser.id;
      }

      var Model = Reconciliation.app.models.Cardevent;
      var connector = Model.getDataSource().connector
      var collection = connector.collection(Model.modelName)
      console.log(JSON.stringify(where));
      console.log(new Date(beginTime*1000))
      console.log(new Date(endTime*1000));
      collection.aggregate([
        { $match: where },
        {
          $group: {
            _id: "$card.id",
            card: {"$first": "$card"},
            total_cost: {$sum: "$card.reduce_cost"},
            total_related_sale: {$sum: "$card.least_cost"},
            codes: {$push: "$_id"},
            count: {$sum: 1}
          }
        }
      ],function (err, results) {
        if(err) {
          next(err)
        } else {
          var result = {
            beginTime: beginTime,
            endTime: endTime,
            results: results
          };
          next(null, result);
        }
      });
    }
    
    endTime = endTime || Math.round(Date.now()/1000);
    if(!beginTime) {
      Reconciliation.findOne({
        order: "endTime DESC", 
        where:{"staff.id": currentUser.id}
      }, function (err, instance) {
        if(err) return next(err);
        if(instance) {
          beginTime = instance.endTime;
        } else {
          beginTime = endTime-86400;
        }
        aggregateCardEvents(beginTime, endTime, next);
      });
    } else {
      aggregateCardEvents(beginTime, endTime, next);
    }
    
  };

  Reconciliation.remoteMethod(
    'try',
    {
      accepts: [
        {arg:'beginTime', type: 'number'},
        {arg:'endTime', type: 'number'}
      ],
      returns: {arg: 'data', type: 'object', root: true},
      description: ["reconciliate code canceled by logined account"]
    }
  );
  
  Reconciliation.beforeRemote('create', function (ctx, modelInstance, next) {
    Reconciliation.findOne({
      order:['endTime DESC']
    },function (err, reconciliation) {
      if(reconciliation && reconciliation.endTime > ctx.req.body.beginTime) {
        err = new Error('BeginTime earlier last reconciliated time');
        err.status = 400;
      } else {
        var context = loopback.getCurrentContext();
        var currentUser = context && context.get('currentUser');
        ctx.req.body.staff = currentUser;
      }
      next(err);
    });
  });
  
  Reconciliation.observe('access', function limitToScope(ctx, next) {
    var context = loopback.getCurrentContext();
    var currentUser = context && context.get('currentUser');
    ctx.query.where = ctx.query.where || {};
    if(currentUser.poi) ctx.query.where["staff.poi.id"] = currentUser.poi.id;
    var now = Math.round(Date.now()/1000)
    ctx.query.where.or = ctx.query.where.or || [
      {beginTime: {gte:now-86400}},
      {endTime: {lte: now}}
    ];
    ctx.query.limit = ctx.query.limit || 10;
    ctx.query.order = ctx.query.order || ['beginTime ASC'];
    // console.log(ctx.query);
    next();
  })
};
