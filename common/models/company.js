var async = require('async');

module.exports = function(Company) {

  Company.observe('access', function limitToToken(ctx, next) {
    ctx.query.where = ctx.query.where || {};
    ctx.query.where.token = process.env.BEEWX_TOKEN;
    next();
  });

  Company.sync = function (filter, next) {
    var begin = filter && filter.begin || 0;
    var limit = filter && filter.limit || 100000;
    Company.app.wechat.getPois(begin, limit, function (err, result) {
      async.each(result.business_list, function (item, callback) {
        var i = item.base_info;
        var c = {
          "name": i.business_name,
          shortname: i.branch_name,
          address: i.address,
          tel: i.telephone,
          city: i.city,
          province: i.province,
          longitude: i.longitude,
          latitude: i.latitude,
          intro: i.introduction,
          district: i.district,
          username: '',
          password: '',
          location_id: 0,
          cat_name: i.categories[0],
          token: process.env.BEEWX_TOKEN        
        }
        if(i.sid != '') c.id = i.sid;
        Company.findOrCreate({where: {
          "name": i.business_name, 
          shortname: i.branch_name}
        }, c, function (err, instance, isNew) {
          // console.log(arguments)
          if(err) return callback(err);
          if(!isNew) instance.updateAttributes(c, callback);
          else callback();
        });
      }, function (err) {
        next(err, result);
      });
    });
  };
  
  Company.remoteMethod(
    'sync',
    {
      accepts: {arg: 'filter', type: 'object', http: { source: 'form' }},
      returns: {arg: 'data', type: 'object', root: true}
    }
  );

};
