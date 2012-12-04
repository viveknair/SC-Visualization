/* Author:

*/

/* Constants */

var w = 1000
var h = 1200;
var containerWidth = w - 200;
var containerHeight = h - 200;
var startingYear = 1970;
var marginLeft = 100;
var marginTop = 30;


var x = d3.scale.linear().domain([-10, 10]).range([0, containerWidth]),
    y = d3.scale.linear().domain([startingYear,startingYear + 10]).range([0, containerHeight]);

data = [[{x: 0, year: 1970}, {x:0, year: 1971}, {x:1, year: 1972}, {x: 5, year: 1973},{x: 7, year: 1974}, {x: -4, year: 1975},{x:-2, year: 1976}, {x:1, year: 1977}, {x: 3, year: 1978},{x: 5, year: 1979}, {x: -2, year: 1980}],
			[{x: -5, year: 1970}, {x:-5, year: 1971}, {x:-2, year: 1972}, {x: -3, year: 1973},{x: -1, year: 1974}, {x: -1, year: 1975},{x:2, year: 1976}, {x:1, year: 1977}, {x: 2, year: 1978},{x: 5, year: 1979}, {x: 6, year: 1980}],
			[{x: -4, year: 1975},{x:-6, year: 1976}, {x:-10, year: 1977}, {x: -5, year: 1978},{x: -5, year: 1979}, {x: -6, year: 1980}]];

var line = d3.svg.line()
    .x(function(d) { return x(d.x); })
    .y(function(d,i) { return y(d.year); })
    .interpolate("cardinal")
    .tension(.75);

var xAxis = d3.svg.axis().scale(x).orient("top").ticks(10),
		yAxis = d3.svg.axis().scale(y).orient("left").ticks(10).tickFormat(d3.format(".0f"));

svg = d3.select("#chart")
  .append("svg")
  .attr('width', w)
  .attr('height', h);

pathsContainer = svg.append('g')
	.attr('width', containerWidth)
	.attr('height', containerHeight)
	.attr('transform', 'translate(' + marginLeft + ',0)')
	.attr("class", "paths_container");

pathsContainer.selectAll("line.x")
  .data(x.ticks(10))
  .enter().append("line")
  .attr("transform", "translate(0," + marginTop + ")")
  .attr("class", "x")
  .attr("x1", x)
  .attr("x2", x)
  .attr("y1", 0)
  .attr("y2", containerHeight)
  .style("stroke", "#ccc");

pathsContainer.selectAll("line.y")
  .data(y.ticks(10))
  .enter().append("line")
  .attr("transform", "translate(0," + marginTop + ")")
  .attr("class", "y")
  .attr("x1", 0)
  .attr("x2", containerWidth)
  .attr("y1", y)
  .attr("y2", y)
  .style("stroke", "#ccc");

pathsContainer.append("svg:g")
	.attr("class", "x axis")
	.attr("transform", "translate(0," + marginTop + ")")
	.call(xAxis);

pathsContainer.append("svg:g")
	.attr("class", "y axis")
	.attr("transform", "translate(0," + marginTop + ")")
	.call(yAxis);

pathsContainer.selectAll("path.justice_path").data(data).enter().append("svg:path")
	.attr("d", function(d,i){ return line(d); })
	.attr("class", "justice_path")
	.attr("transform", "translate(0," + marginTop + ")")
	.style("stroke-width", 5)
  .style("stroke", "steelblue")
  .style("fill", "none")
  	.on("mouseover", function(){ d3.select(this).attr('stroke', 'red')});







