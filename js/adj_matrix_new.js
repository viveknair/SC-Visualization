window.adjMatrix = {

  initialize: function(){
var margin = {top: 0, right: 0, bottom: 10, left: 100},
    width =  550,
    height = 550;

var containerWidth = width - 100,
    containerHeight = height - 100;    

var x = d3.scale.ordinal().rangeBands([0, containerWidth]),
    y = d3.scale.ordinal().rangeBands([0, containerHeight]),
    //z = d3.scale.linear().domain([0, 4]).clamp(true),
    c = d3.scale.category10().domain(d3.range(100));

  window.colorFunction = d3.scale.linear()
  .domain([0, 50, 100])
  .range(["#DA0B2E", "#FFF", "#1782CF"]);

var svg = d3.select("#adjacencyMatrixChart").append("svg")
    .attr("width", width)
    .attr("height", height)
   .append("g")
    .attr('width', containerWidth)
    .attr('height', containerHeight)
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

window.redraw = function(decadeShowing){
  $("#order").val(decadeShowing);
  d3.select("#adjacencyMatrixChart").select("svg").remove();

  var svg = d3.select("#adjacencyMatrixChart").append("svg")
    .attr("width", width)
    .attr("height", height)
   .append("g")
    .attr('width', containerWidth)
    .attr('height', containerHeight)
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

d3.json("data/justices.json", function(justices) {
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
      .attr("x", x.rangeBand()/4 - 8)
      .attr("y", x.rangeBand() / 2 + 10)
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
          return '#DDD'; 
        })



        ;//.on("mouseover", mouseover)
        //.on("mouseout", mouseout);
  }




});

}

  d3.select("#order").on("change", function() {
    window.redraw(parseInt(this.value));
    //clearTimeout(timeout);
    //order(this.value);
  });
  },

  initializeAfterDom: function() {
    for (var i = 4; i < 12; i++){
      var links = "<option value="+(1900+i*10)+">"+(1900+i*10)+"'s</option>";
      $("#order").append(links);
    }
    $("#order").val(1970);

    for (var i = 10; i >= 0; i--){
      var block = "<li><span class='coloredBlock' style='background:"+window.colorFunction(i*10)+";'></span></li>";
      $("#coloredBlocks").append(block);
    }
    $(".toTimeline").on('click', function(){
      $(".sel").removeClass('selected');
      $(this).addClass('selected');
      $('#mainVisualizationContainer').fadeIn();
      $('#adjacencyMatrixContainer').hide();
      $('#triadVisualizationContainer').hide();
    });
    $(".toAdjMatrix").on('click', function(){
      $(".sel").removeClass('selected');
      $(this).addClass('selected');
      $('#mainVisualizationContainer').hide();
      $('#adjacencyMatrixContainer').fadeIn();
      $('#triadVisualizationContainer').hide();
    });
    $(".toTriads").on('click', function(){
      $(".sel").removeClass('selected');
      $(this).addClass('selected');
      $('#mainVisualizationContainer').hide();
      $('#adjacencyMatrixContainer').hide();
      $('#triadVisualizationContainer').fadeIn(); 
    })
    window.redraw(parseInt($("#order").val()));
  }

};


window.adjMatrix.initialize();
$(document).ready(function() {
  window.adjMatrix.initializeAfterDom();
  $('.x').find('text').each(function(){ $(this).text($(this).text().replace('-', ''))});
});
