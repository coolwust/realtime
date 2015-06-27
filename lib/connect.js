'use strict';

var r = require('rethinkdb');
var config = require('../config/db.js');

var connect;
module.exports = function () {
  return connect || (connect = r.connect(config));
}


