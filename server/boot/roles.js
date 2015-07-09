var loopback = require('loopback');

module.exports = function(app) {
  var Role = app.models.Role;
  Role.registerResolver('administrator', function(role, context, cb) {
    function reject(err) {
      if(err) {
        return cb(err);
      }
      cb(null, false);
    }
    if (context.modelName !== 'account') {
      // the target model is not account
      return reject();
    }
    var userId = context.accessToken.userId;
    if (!userId) {
      return reject(); // do not allow anonymous users
    }
    
    var ctx = loopback.getCurrentContext()
    var currentUser = ctx && ctx.get('currentUser');    
    cb(null, currentUser.job && currentUser.job.match('管理员'))
  });
};