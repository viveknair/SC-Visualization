var margin = {top: 0, right: 0, bottom: 10, left: 100},
    width = 1000,
    height = 900;

var containerWidth = width - 300,
    containerHeight = height - 300;    

var x = d3.scale.ordinal().rangeBands([0, containerWidth]),
    y = d3.scale.ordinal().rangeBands([0, containerHeight]),
    //z = d3.scale.linear().domain([0, 4]).clamp(true),
    c = d3.scale.category10().domain(d3.range(100));

var colorFunction = d3.scale.linear()
  .domain([0, 50, 100])
  .range(["blue", "#FFF", "red"]);

var svg = d3.select("#chart").append("svg")
    .attr("width", width)
    .attr("height", height)
   .append("g")
    .attr('width', containerWidth)
    .attr('height', containerHeight)
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

function redraw(decadeShowing){
  d3.select("#chart").select("svg").remove();

  var svg = d3.select("#chart").append("svg")
    .attr("width", width)
    .attr("height", height)
   .append("g")
    .attr('width', containerWidth)
    .attr('height', containerHeight)
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

d3.json("justices.json", function(justices) {
  justices = justices.filter(function(justice){ return (justice.year-decadeShowing <= 9 && justice.year-decadeShowing >= 0); });

  var matrix = [],
  n = justices.length;

  var allJudges = [];

  var arrayOfJudgesNames = [];

  justices.forEach(function (justice) {
    aJustice = allJudges[justice.justiceName];
    if (!aJustice){
      aJustice = (allJudges[justice.justiceName] = []);
      arrayOfJudgesNames.push(justice.justiceName);
      //alert("New One"+justice.justiceName);
    }

    aJustice[justice.year] = {justiceName:justice.justiceName, year:justice.year, liberalVotes:justice.liberal_votes, conservativeVotes:justice.conservative_votes};
  });

  //alert(allJudges["AFortas"][1965].conservativeVotes);
  //alert(allJudges[arrayOfJudgesNames[0]]);
  //alert(Object.keys(allJudges).length);

  arrayOfJudgesNames.sort();
  judgesToUse = [];

  arrayOfJudgesNames.forEach(function (thatJudge) {
    //alert(allJudges[thatJudge]);
    judgesToUse.push(allJudges[thatJudge]);
  }); 

  //alert(judgesToUse[0][1965].conservativeVotes);



  /*function justiceNameMapper(datum) { return datum.justiceName; }
  var justiceNames = justices.map( justiceNameMapper );

  alert(justiceNames);*/








  /*justices.forEach(function(justice, i) {
    justice.index = i;
    justice.count = 0;
    matrix[i] = d3.range(n).map(function(j) { return {x:j, y:i}; });
  });*/



  var orders = {
    name: d3.range(n).sort(function(a, b) { return d3.ascending(justices[a].justiceName, justices[b].justiceName); })
    //count: d3.range(n).sort(function(a, b) { return justices[b].count - justices[a].count; }),
    //group: d3.range(n).sort(function(a, b) { return justices[b].group - justices[a].group; })
  };

  // The default sort order.
  x.domain(d3.range(10));
  y.domain(arrayOfJudgesNames);


  //alert(orders.name);



  svg.append("rect")
      .attr("class", "background")
      .attr("width", containerWidth)
      .attr("height", containerHeight);


  var row = svg.selectAll(".row")
      .data(judgesToUse)
   .enter().append("g")
      .attr("class", "row")
      .attr("transform", function(d, i) { return "translate(0," + y(i) + ")"; })
      .each(processRow);//  row);

  row.append("line")
    .attr("x2", width);

  row.append("text")
    .attr("x", -6)
    .attr("y", y.rangeBand() / 2)
    .attr("dy", ".32em")
    .attr("text-anchor", "end")
    .text(function(d, i) { return arrayOfJudgesNames[i]; });



  var column = svg.selectAll(".column")
      .data(d3.range(10))
    .enter().append("g")
      .attr("class", "column")
      .attr("transform", function(d, i) { return "translate(" + x(i) + ","+(containerHeight-20)+")"; });

  column.append("line")
      .attr("transform", function(d, i) { return "translate(0,"+(-containerHeight)+")rotate(-90)"; })
      .attr("x1", -width);

  column.append("text")
      .attr("x", x.rangeBand()/4)
      .attr("y", x.rangeBand() / 2)
      .attr("dy", ".32em")
      .attr("text-anchor", "start")
      .text(function(d, i) { return decadeShowing+i; });





  function processRow(row) {
    //alert(row[1965].justiceName);

    var newRow = [];
    for (var i = 0; i < 10; i++){
      var val = row[decadeShowing+i] || (row[decadeShowing+i] = []);
      newRow.push(val);
    }
    row = newRow;


    var transition = function(justiceName, year, calcValue) {
      if (!justiceName || !year)
        return;
      return function() {
        var sel = '#'+justiceName+year;
        d3.select(sel).style("fill", calcValue);
      };
    };

    var cell = d3.select(this).selectAll(".cell")
        .data(row)
      .enter().append("rect")
        .attr("class", "cell")
        .attr("id", function(d) {  if (d.justiceName && d.year) return d.justiceName+d.year; } )
        .attr("x", function(d, i) { return x(i); })
        .attr("width", x.rangeBand())
        .attr("height", y.rangeBand())
        //.style("fill-opacity", function(d) { return z(d.z); })
        .style("fill", function(d) {
          if (d.justiceName){
            var calcValue = colorFunction(d.liberalVotes / (d.liberalVotes+d.conservativeVotes) * 100);
            setTimeout(transition(d.justiceName,d.year,calcValue), ((d.year-decadeShowing)*30+Math.random() * 50));
          }
          return '#FFF'; 
        })



        ;//.on("mouseover", mouseover)
        //.on("mouseout", mouseout);
  }



  /* ************************** */

//Inspired By: http://trends.truliablog.com/vis/tru247/
function flipTiles() {

  var oldSide = d3.select('#tiles').attr('class'),
    newSide = '';
  
  if (oldSide == 'front') {
    newSide = 'back';
  } else {
    newSide = 'front';
  }
  
  var flipper = function(h, d, side) {
    return function() {
      var sel = '#d' + d + 'h' + h + ' .tile',
        rotateY = 'rotateY(180deg)';
      
      if (side === 'back') {
        rotateY = 'rotateY(0deg)';  
      }
      if (browser.browser === 'Safari' || browser.browser === 'Chrome') {
        d3.select(sel).style('-webkit-transform', rotateY);
      } else {
        d3.select(sel).select('.' + oldSide).classed('hidden', true);
        d3.select(sel).select('.' + newSide).classed('hidden', false);
      }
        
    };
  };
  
  for (var h = 0; h < hours.length; h++) {
    for (var d = 0; d < days.length; d++) {
      var side = d3.select('#tiles').attr('class');
      setTimeout(flipper(h, d, side), (h * 20) + (d * 20) + (Math.random() * 100));
    }
  }
  d3.select('#tiles').attr('class', newSide);
}


/* ************************** */



});

}

d3.select("#order").on("change", function() {
  redraw(parseInt(this.value));
  //clearTimeout(timeout);
  //order(this.value);
});

$(document).ready(function() {

  for (var i = 4; i < 12; i++){
    var links = "<option value="+(1900+i*10)+">"+(1900+i*10)+"'s</option>";
    $("#order").append(links);
  }
  $("#order").val(1970);

  for (var i = 10; i >= 0; i--){
    var block = "<li><span class='coloredBlock' style='background:"+colorFunction(i*10)+";'></span></li>";
    $("#coloredBlocks").append(block);
  }

  redraw(parseInt($("#order").val()));
});

