'use strict';

var http = require('http');
var koa = require('koa');
var serve = require('koa-static');
var marko = require('marko');
var IO = require('socket.io');
var question = require('./lib/question.js');

var app = koa();
app.use(serve(__dirname + '/public'));
app.use(function* () {
  var data = {};
  this.body = marko.load(require.resolve('./views/index.marko')).stream(data);
  this.type = 'text/html';
});

var server = http.createServer(app.callback());
var io = new IO(server);
question.setup(io);
io.origins('*:*');
server.listen(3000);
