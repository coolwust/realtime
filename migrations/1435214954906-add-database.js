'use strict'
var r = require('rethinkdb');
var config = require('../config/db.js');

exports.up = function(next) {
  r
    .connect({ host: config.host, port: config.port })
    .then(function (conn) {
      return r.dbCreate(config.db).run(conn);
    })
    .then(function () {
      next();
    })
    .catch(function (err) {
      next(err);
    });
};

exports.down = function(next) {
  r
    .connect({ host: config.host, port: config.port })
    .then(function (conn) {
      return r.dbDrop(config.db).run(conn);
    })
    .then(function () {
      next();
    })
    .catch(function (err) {
      next(err);
    });
};
