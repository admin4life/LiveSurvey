var source = new EventSource('/update-stream');
source.addEventListener('message', function(e) {
  console.log(e);
  $('ul').append('<li>' + e.data + ' (message id: ' + e.lastEventId + ')</li>');
}, false);
