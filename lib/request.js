define(function() {

  function Request(provider, cb) {
    this._provider = provider;
    this._cb = cb;
  }
  
  Request.prototype.start = function() {
    var self = this;
    this._provider.login(function(err, user, creds) {
      self._cb && self._cb(err, user, creds);
    });
  }
  
  Request.prototype.finish = function(location) {
    var self = this;
    this._provider.validate(location, function(err, user, creds) {
      self._cb && self._cb(err, user, creds);
    });
  }
  
  return Request;
});
