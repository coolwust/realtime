function create(__helpers) {
  var str = __helpers.s,
      empty = __helpers.e,
      notEmpty = __helpers.ne;

  return function render(data, out) {
    out.w('<!doctype html> <html><head><title>Question App</title><script src="https://cdn.socket.io/socket.io-1.3.5.js"></script><script src="https://code.angularjs.org/2.0.0-alpha.28/angular2.sfx.dev.js"></script><script src="js/main.js"></script></head><body><realtime-app></realtime-app></body></html>');
  };
}
(module.exports = require("marko").c(__filename)).c(create);