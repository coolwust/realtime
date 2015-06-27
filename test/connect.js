'use strict';

var expect = require('chai').expect;
var co = require('co');
var r = require('rethinkdb');

describe('testing connection', function () {
  it('connect to database', function (done) {
    var connect = require('../lib/connect.js');
    co(function* () {
      var conn = yield connect();
      var info = yield r.tableCreate('test').run(conn);
      expect(info.config_changes[0].new_val).to.be.an('object');
      var info = yield r.tableDrop('test').run(conn);
      expect(info.config_changes[0].new_val).to.be.a('null');
    }).then(done, done);
  });
});
