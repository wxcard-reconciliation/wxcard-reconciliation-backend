module.exports = function(Reconciliation) {
  
  Reconciliation.try = function (options, next) {
    var filter = {
      where: {
        CancelTime: {between: [options.BeginTime, options.EndTime]},
        "status": 'consumed'
      },
      order: ['CancelTime DESC']
    };
    Reconciliation.app.models.cardevent.find(filter, function (err, results) {
      
    });
  };
  
  Reconciliation.remoteMethod(
    'try',
    {
      accepts: {arg: 'options', type: 'object', http: {source: 'body'}},
      returns: {arg: 'data', type: 'object', root: true}
    }
  );
};
