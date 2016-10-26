var express = require('express'),
    pug = require('pug'),
    bodyParser = require('body-parser'),
    events = require('events');

var EventEmitter = events.EventEmitter;

var msger = new EventEmitter;

var app = express();

// Configuration


app.set('view engine', 'pug');
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ extended: false}))
app.use(bodyParser.json())


// Routes

app.get('/', function(req, res){
  res.render('index');
});

app.get('/update-stream', function(req, res) {
  console.log("now req stream");
  // let request last as long as possible
  req.socket.setTimeout(1200000);

  msger.on("question", function(){
    console.log("Getting transmission on event");
  });

  req.on("close", function(){
    console.log("stream req close");
    msger.removeListener("question", function(){
      console.log("Removing Listener");
    })
  })

  //send headers for event-stream connection
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive'
  });
  res.write('\n');

  // When we receive a message from the redis connection
  // subscriber.on("message", function(channel, message) {
  //   var compile = pug.compileFile("views/"+message+".pug");
  //   var wb = "data: " + compile() + "\n\n";
  //   res.write(wb);
    // messageCount++; // Increment our message count
    // res.write('id: ' + messageCount + '\n');
    // res.write("data: " + message + '\n\n'); // Note the extra newline
  // });


  // The 'close' event is fired when a user closes their browser window.
  // In that situation we want to make sure our redis channel subscription
  // is properly shut down to prevent memory leaks...and incorrect subscriber
  // counts to the channel.
  // req.on("close", function() {
  //   subscriber.unsubscribe();
  //   subscriber.quit();
  // });
});

app.get('/admin', function(req,res){
  res.render('admin');
})

app.get('/events/:event', function(req,res){
  msger.emit("question", req.params.event);
  res.writeHead(200, {'Content-Type': 'text/html'});
  res.write(req.params.event + " Pushed to listeners");
  res.end();
})

app.listen(8000);
console.log("Express server listening on port 8000");
