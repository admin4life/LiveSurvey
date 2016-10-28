var source = new EventSource('/clients');
var element;

source.addEventListener('message', function(e) {
  console.log(e);
  element = $('#'+e.data);
  element.fadeIn('slow', function(){

  })
  //$('ul').append('<li>' + e.data + ' (message id: ' + e.lastEventId + ')</li>');
}, false);

var vm = {
  questions: ko.observableArray()
}

$('document').ready(function(){
  $.get('/questions', function(res){
    vm.questions(res);
    ko.applyBindings(vm);
  })
})

function vote(a,b){
  //element.fadeOut('fast');
  $.post("/vote", b, function(res){
    return true;
  })
  console.log(a,b);
}
