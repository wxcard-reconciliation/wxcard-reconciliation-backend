module.exports = function(Share) {

  Share.stat = function (filter, next) {
    filter = filter || {}
    filter.limit = filter.limit || 10
    filter.skip = filter.skip || 0
    
    var sql = "SELECT *, count(id) as count FROM tp_share WHERE token='"+process.env.BEEWX_TOKEN+"' "
    sql += "group by url ORDER BY id desc "
    sql += "LIMIT "+filter.skip+","+filter.limit+";"
    Share.getDataSource().connector.query(sql, next)
  };
  
  Share.remoteMethod(
    'stat',
    {
      accepts: {arg: 'filter', type: 'object', http: { source: 'query' }},
      returns: {arg: 'data', type: 'array', root: true},
      http: {path: '/stat', verb: 'GET'}
    }
  )
  
};
