'use strict';

function RealTimeComponent() {
  //this.questions = [{ text: 'hehe', author: 'haha'}];
  this.questions = [];
  var socket = io('192.168.56.102:3000');
  socket.on('connect', function () {
    socket.emit('questions', options);
    var options = {
      event_name: 'recent-questions',
      limit: 5,
      filter: { author: 'hotwust' }
    };
    socket.emit('question-change-feed', options);
  });
  socket.on('recent-questions', function (question) {
    if (!question.old_val) {
      this.questions.push(question.new_val);
    } else if (!question.new_val) {
      this.questions.forEach(function (value, key) {
        if (value.id === question.old_val.id) {
        console.log(this.questions[key]);
          delete this.questions[key];
        }
      }.bind(this));
    } else {
      this.questions.forEach(function (value, key) {
        if (value.id === question.old_val.id) {
          this.questions[key] = question.new_val;
        }
      }.bind(this));
    }
  }.bind(this));
}

RealTimeComponent.annotations = [
  new angular.ComponentAnnotation({
    selector: 'realtime-app'
  }),
  new angular.ViewAnnotation({
    templateUrl: '../main.html',
    directives: [angular.NgFor]
  })
];

document.addEventListener('DOMContentLoaded', function () {
  angular.bootstrap(RealTimeComponent);
});
