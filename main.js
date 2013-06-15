define(['exports', 'module',
        './lib/request',
        './lib/redirect'],
function(exports, module, Request, redirect) {
  
  function Admission() {
    this._providers = {};
    this._redirect = redirect.href().bind(this);
    this._req = undefined;
    
    // TODO: Make the completion mechanism configurable (expose, postMessage, etc.)
    // TODO: Support a polling check on the opened window URL so the complete() call
    //       isn't necessary
    expose(this);
  }
  
  Admission.prototype.login = function(name, cb) {
    var provider = this._providers[name];
    if (!provider) throw new Error('No identity provider registered with name: ' + name);
    
    this._req = new Request(provider, cb);
    // TODO: Listen for `done` events and invalidate this._req;
    
    this._req.start();
  }
  
  Admission.prototype.complete = function() {
    if (window.opener && window.opener.__entranceComplete) {
      window.opener.__entranceComplete(window.location)
    }
  }
  
  Admission.prototype.use = function(name, provider) {
    if (!provider) {
      provider = name;
      name = provider.name;
    }
    if (!name) throw new Error('Identity providers must have a name.');
  
    provider.redirect = this._redirect;
    
    this._providers[name] = provider;
    return this;
  };
  
  Admission.prototype.redirect = function(how) {
    if (typeof how == 'string') {
      switch (how) {
      case 'href':
      case 'location':
        this._redirect = redirect.href().bind(this);
        break;
      case 'open':
      case 'popup':
        this._redirect = redirect.open().bind(this);
      }
    }
    return this;
  }
  
  
  function expose(ent) {
    window.__entranceComplete = function(location) {
      if (ent._req) {
        ent._req.finish(location);
      }
    }
  }
  
  
  exports = module.exports = new Admission();
  exports.Admission = Admission;
});
