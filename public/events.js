var source = new EventSource('/update-stream');
source.addEventListener('message', function(e) {
  console.log(e);
  $('.content').fadeOut('fast', function(){
    $('.content').html(e.data);
    $('.content').fadeIn('fast');
  });
  //$('ul').append('<li>' + e.data + ' (message id: ' + e.lastEventId + ')</li>');
}, false);
