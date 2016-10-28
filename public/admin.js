var source = new EventSource('/adminEvent');
source.addEventListener('message', function(e) {
  console.log(e);
  var data = JSON.parse(e.data);
  console.log(data);
  updateChart(did, data)
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

function sendQuestion(a){
  $.get('/question/'+a.id, function(res){
    console.log(a);
    addChart(a.id);
  })
}

var did, height, y;
function addChart(id){
  did = id;
  var opts = ["Yes", "No"];
  var width = 300;
  height = 230;
  var svg = d3.select("#"+id).append('svg')
    .attr("width", width)
    .attr("height", height)
    .style('margin-top', "20px")
    .style('padding', "20px");

    margin = {top: 20, right: 20, bottom: 30, left:40},
      width = width - margin.left - margin.right,
      height = height - margin.top - margin.bottom;

  var x = d3.scaleBand().rangeRound([0, width]).padding(0.1);
  y = d3.scaleLinear().rangeRound([height,0]);

  var g = svg.append('g')
    .attr("transfrom", "translate(" + margin.left + "," + margin.top + ")");

  x.domain(opts);
  y.domain([0,25]);

  g.append('g')
    .attr("class", "xaxis")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x));

  g.append('g')
    .attr("class", "yaxis")
    .call(d3.axisLeft(y).ticks(10))

  g.selectAll(".bar")
    .data(opts)
    .enter()
    .append("rect")
    .attr("class", "bar")
    .attr("x", function(d){ return x(d); })
    .attr("y", function(d){ return 0; })
    .attr("width", x.bandwidth())
    .attr("height", function(d){ return 0; })

}

function updateChart(id,data){
  var svg = d3.select("#"+id+" svg");

  svg.selectAll('.bar')
    .data(data)
    .attr("y", function(d){ return y(d.votes)})
    .attr("height", function(d){ return height - y(d.votes); });
}
