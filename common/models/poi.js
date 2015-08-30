module.exports = function(Poi) {

  Poi.fetchPois = function (count, next) {
    Poi.app.wechat.getPois(count, 50, function (err, result) {
      if(err) console.log('Fetch Pois error:',err);
      result.business_list.forEach(function (item) {
        var base_info = item.base_info;
        if(base_info.sid) {
          base_info.id = base_info.sid;
          delete base_info.sid;
        }
        Poi.upsert(base_info);
      });
      if(result.total_count > count+result.business_list.length) {
        Poi.emit('GET_POIS', count+result.business_list.length, next);
      } else {
        next(err, result.total_count);
      }
    });
  };
  
  Poi.on('GET_POIS', Poi.fetchPois);
  
  Poi.sync = function (options, next) {
    
    Poi.count(function (err, count) {
      if(err) return next(err);
      Poi.fetchPois(count, next);
    });
    
  };

  Poi.remoteMethod(
    'sync',
    {
      accepts: {arg: 'options', type: 'object', http: { source: 'body' }},
      returns: {arg: 'data', type: 'object', root: true}
    }
  );
};
