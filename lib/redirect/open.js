define(function() {

  return function() {
    
    return function(url) {
      var name = 'login';
      var opts = 'location=0,status=0,width=800,height=400';
    
      window.open(url, name, opts);
      // TODO: Set up timers, watch for close, etc.
    }
  }
});
