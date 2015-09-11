module.exports = function(Model, options) {
  // Model is the model class
  // options is an object containing the config properties from model definition
  Model.defineProperty('created', {type: Date, default: Math.round(Date.now()/1000)});
  Model.defineProperty('modified', {type: Date, default: Math.round(Date.now()/1000)});
}