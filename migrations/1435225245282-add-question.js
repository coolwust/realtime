'use strict'

var r = require('rethinkdb');
var config = require('../config/db.js');

exports.up = function(next) {
  r
    .connect(config)
    .then(function (conn) {
      return r.tableCreate('question').run(conn).then(function () {
        return conn;
      });
    })
    .then(function (conn) {
      return r.table('question').indexCreate('ctime').run(conn);
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
    .connect(config)
    .then(function (conn) {
      return r.tableDrop('question').run(conn);
    })
    .then(function () {
      next();
    })
    .catch(function (err) {
      next(err);
    });
};
