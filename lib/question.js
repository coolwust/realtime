'use strict';

var r = require('rethinkdb');
var connect = require('./connect.js');
var co = require('co');

module.exports = {
  setup: setup
}

function setup(io) {
  io.of('/').on('connect', function (socket) {


    socket.on('add-question', function (record) {
      co(function* () {
        try {
          record = { name: record.name, question: record.question, ctime: Date(), mtime: Date() };
          var conn = yield connect();
          var info = yield r.table('question').insert(record).run(conn);
          var id = info.generated_keys[0];
          socket.emit('add-question', id);
        } catch (err) {
          socket.emit('error', err);
        }
      });
    });


    socket.on('find-question-by-id', function (id) {
      co(function* () {
        try {
          var conn = yield connect();
          var record = yield r.table('question').get(id).run(conn);
          socket.emit('find-question-by-id', record);
        } catch (err) {
          socket.emit('error', err);
        }
      });
    });


    socket.on('update-question', function (record) {
      co(function* () {
        try {
          record = { id: record.id, name: record.name, question: record.question, mtime: Date() };
          var conn = yield connect();
          var info = yield r.table('question').get(record.id).update(record, { returnChanges: true }).run(conn);
          socket.emit('update-question', info.changes[0].new_val);
        } catch (err) {
          socket.emit('error', err);
        }
      });
    });

    socket.on('delete-question', function (id) {
      co(function* () {
        try {
          var conn = yield connect();
          yield r.table('question').get(id).delete().run(conn);
          socket.emit('delete-question', id);
        } catch (err) {
          socket.emit('error', err);
        }
      });
    });

    socket.on('question-change-feed', function (options) {
      co(function* () {
        try {
          var limit = options.limit || 100;
          var filter = options.filter || {};
          var orderBy = options.order_by || { index: r.desc('ctime') };
          var conn = yield connect();
          var changes = yield r.table('question').orderBy(orderBy).filter(filter)
            .limit(limit).changes().run(conn);
          changes.on('data', function (record) {
            socket.emit(options.event_name, record);
          });
          socket.once('disconnet', function () {
            changes.close();
          });
        } catch (err) {
          socket.emit('error', err);
        }
      });
    });

    socket.on('questions', function (options) {
      co(function* () {
        try {
          var limit = options.limit || 100;
          var filter = options.filter || {};
          var orderBy = options.order_by || { index: r.desc('ctime') };
          var conn = yield connect();
          var records = yield r.table('question').orderBy(orderBy)
            .filter(filter) .limit(limit).run(conn);
          records.each(function (err, record) {
            socket.emit(options.event_name, record);
          });
        } catch (err) {
          socket.emit('error', err);
        }
      });
    });


  });
}
