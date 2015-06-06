module.exports = function(Account) {
  
  Account.observe('before save', function timeStamp(ctx, next) {
    var now = new Date()
    if(ctx.instance) {
      ctx.instance.lastUpdated = now
      if(!ctx.instance.id) {
        ctx.instance.created = now
        ctx.instance.status = 'active'
      }
    } else {
      ctx.data.lastUpdated = now
    }
    next()
  })
  
};
