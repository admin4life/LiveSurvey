var socket = io();

var vm = {
  questions: ko.observableArray()
}

$('document').ready(function(){
  $.get('/questions', function(res){
    vm.questions(res);
    ko.applyBindings(vm);
  })
})

socket.on('show-question', question => {
  $('#'+question).fadeIn('slow');
});

function vote(a,b){
  socket.emit('vote', b.text);
}
