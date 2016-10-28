var express = require('express'),
    pug = require('pug'),
    bodyParser = require('body-parser'),
    events = require('events');

var EventEmitter = events.EventEmitter;

var msger = new EventEmitter;
var voter = new EventEmitter;

var app = express();

var qs = [
  {id: 'one', head: "Question One", question: "This is a question about UFO's and aliens",
  opts: [
    {text: "Yes", votes: 0},
    {text: "No", votes: 0}
  ]},

]


app.set('view engine', 'pug');
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ extended: false}))
app.use(bodyParser.json())


// Routes

app.get('/', function(req, res){
  res.render('index');
});

app.get('/questions', function(req, res){
  res.json(qs);
})

var clients = 0;

app.get('/clients', function(req, res) {
  clients++;
  console.log(clients+" clients connected to stream");

  // let request last as long as possible
  req.socket.setTimeout(1200000);

  //send headers for event-stream connection
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive'
  });
  res.write('\n');

  function eventFunct(data){
    res.write("data: "+data+"\n\n");
  }

  msger.on("question", eventFunct);

  //End the clients connection
  req.on("close", function(){
    clients--;
    console.log(clients+" clients connected to stream");
    msger.removeListener("question", eventFunct)
  })

});

app.get('/admin', function(req,res){
  res.render('admin');
})

var votes;

app.get('/question/:event', function(req,res){
  msger.emit("question", req.params.event);
  var ind = qs.findIndex(a => a.id === req.params.event);
  votes = qs[ind].opts;

  res.writeHead(200, {'Content-Type': 'text/html'});

  res.end();
})

app.get('/adminEvent', function(req,res){
  req.socket.setTimeout(1200000);

  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive'
  })
  res.write('\n');

  voter.on("vote", function(data){
    var ind = votes.findIndex( a => a.text === data);
    votes[ind].votes ++;
    res.write("data: "+JSON.stringify(votes)+"\n\n");
  })

})
app.post('/vote', function(req, res){
  voter.emit("vote", req.body.text);
  res.send(true);
})

app.listen(8000);
console.log("Express server listening on port 8000");
