'use strict';

var koa = require('koa');
var http = require('http');
var IOClient = require('socket.io-client');
var IOServer = require('socket.io');
var question = require('../lib/question.js');
var co = require('co');
var expect = require('chai').expect;


describe('testing io connection', function () {
  var ioClient;
  before(function (done) {
    var app = koa();
    var server = http.createServer(app.callback());
    var ioServer = new IOServer(server);
    server.listen(3000);
    question.setup(ioServer);
    ioClient = new IOClient('http://localhost:3000');
    ioClient.on('connect', done);
    ioClient.on('error', done);
  });

  it('add question', function (done) {
    ioClient.once('add-question', function (id) {
      expect(id).to.be.a('string');
      done();
    });
    ioClient.once('error', done);
    ioClient.emit('add-question', { name: 'coolwust', question: 'how are you?' });
  });

  it('find question by id', function (done) {
    ioClient.emit('add-question', { name: 'coolwust', question: 'how are you?' });
    ioClient.once('add-question', function (id) {
      ioClient.emit('find-question-by-id', id);
    });
    ioClient.once('find-question-by-id', function (record) {
      expect(record.name).to.equal('coolwust');
      done();
    });
    ioClient.once('error', done);
  });

  it('update question', function (done) {
    ioClient.emit('add-question', { name: 'coolwust', question: 'how are you?' });
    ioClient.once('add-question', function (id) {
      ioClient.emit('find-question-by-id', id);
    });
    ioClient.once('find-question-by-id', function (record) {
      record.name = 'hotwust';
      ioClient.emit('update-question', record);
    });
    ioClient.once('update-question', function (record) {
      expect(record.name).to.equal('hotwust');
      done();
    });
    ioClient.once('error', done);
  });

  it('delete question', function (done) {
    ioClient.emit('add-question', { name: 'coolwust', question: 'how are you?' });
    ioClient.once('add-question', function (id) {
      ioClient.emit('delete-question', id);
    });
    ioClient.once('delete-question', function (id) {
      expect(id).to.be.a('string');
      done();
    });
  });

  it('change feed of questions', function (done) {
    var options = {
      event_name: 'recent-coolwust-questions',
      limit: 10,
      filter: { name: 'coolwust' }
    };
    ioClient.emit('question-change-feed', options);
    ioClient.emit('add-question', { name: 'coolwust', question: 'how are you?' });
    ioClient.once('recent-coolwust-questions', function (data) {
      expect(data.new_val.question).to.equal('how are you?');
      expect(data.old_val).to.equal(undefined);
      done();
    });
  });

  it('questions', function (done) {
    var options = {
      event_name: 'recent-questions',
      limit: 10
    };
    ioClient.emit('add-question', { name: 'coolwust', question: 'how are you?' });
    ioClient.once('add-question', function (data) {
      ioClient.emit('questions', options);
    });
    ioClient.once('recent-questions', function (record) {
      expect(record.name).to.equal('coolwust');
      done();
    });

  });


});
