var vm = {
  questions: ko.observableArray()
}

var socket = io.connect();

$('document').ready(function(){
  $.get('/questions', function(res){
    vm.questions(res);
    ko.applyBindings(vm);
  })
})

var el;

socket.on('show-question', question => {
  el = $('#'+question);
  el.fadeIn('slow');
});

function vote(a,b){
  socket.emit('vote', b.text);
  el.fadeOut('fast');
}
