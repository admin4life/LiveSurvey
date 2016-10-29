var express = require('express'),
    app = express(),
    http = require('http').Server(app),
    io = require('socket.io')(http),
    pug = require('pug'),
    bodyParser = require('body-parser'),
    events = require('events');

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

//SocketIO

app.get('/', function(req, res){
  res.render('index');
});

app.get('/questions', function(req, res){
  res.json(qs);
})

app.get('/admin', function(req, res){
  res.render('admin');
});


// Socket IO communication
var clients = 0
var votes = [];
io.on('connection', function(socket){
  clients++;
  console.log(clients+' Clients connected');

  //show question to clients
  socket.on('send-question', question => {
    io.emit('show-question', question);
    var ind = qs.findIndex(a => a.id === question);
    votes = qs[ind].opts;
  })

  //get vote from clients
  socket.on('vote', vote => {
    var ind = votes.findIndex( a => a.text === vote);
    votes[ind].votes ++;
    io.emit('chart-vote', votes)
  });

  //disconnect
  socket.on('disconnect', function(){
    clients--;
    console.log("Disconnect client, clients: "+clients);
  });
});


http.listen(3000, function(){
  console.log("Server Up on 3000");
});


///////
