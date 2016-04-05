module.exports = function(Campaignclient) {

  Campaignclient.observe('before save', function (ctx, next) {
    if(ctx.instance) {
      ctx.instance.created = new Date();
      Campaignclient.app.models.wxclient.fetchUser(ctx.instance.wxclientId, function (err, user) {
        if(err) return next(err);
        delete user.accesstoken;
        ctx.instance.wxclient = user || {subscribe: 0, id: ctx.instance.wxclientId};
        next();
      });
    } else {
      next();
    }
  });

  Campaignclient.statcity = function (filter, next) {
    var where = filter.where || {};
    var Model = Campaignclient;
    var connector = Model.getDataSource().connector
    var collection = connector.collection(Model.modelName)
    // console.log(JSON.stringify(where));
    var cities = ['南京', '苏州', '常州', '宿迁', '镇江', '淮安', '南通', '无锡', '盐城', '徐州', '泰州', '连云港', '扬州'];
    var project = {city: {$ifNull:["$wxclient.city", ""]}, openid: {$ifNull:["$wxclient.id", ""]}};
    var group = {_id: {
      $cond: [
        { $gt: [ { $size: { $setIntersection: [ ["$city"], cities ] } }, 0 ]},
        "$city",
        "其他",
      ]
    }, clients: {$addToSet: "$openid"}, count: {$sum: 1}};
    where.created = {$gte: new Date(1458744758831)};
    // console.log(project);
    collection.aggregate([
      { $match: where },
      { $project: project },
      { $group: group },
      { $sort: {count: -1}},
      { $project: {_id: 1, clientCount: {$size: "$clients"}, count:1}},
      { $skip: filter.skip || 0},
      { $limit: filter.limit || 10}
    ], next);    
  }
  
  Campaignclient.remoteMethod(
    'statcity',
    {
      accepts: {arg: 'filter', type: 'object', http: { source: 'query' }},
      returns: {arg: 'data', type: 'array', root: true},
      http: {path: '/statcity', verb: 'GET'},
      description: ["statistic campaign client of city"]
    }
  );
  
};
