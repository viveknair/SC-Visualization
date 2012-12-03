/* Author:

*/

/* Constants */

var w = 1000
var h = 1200;
var containerWidth = w - 200;
var containerHeight = h - 200;
var startingYear = 1970;
var marginLeft = 60;


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

var xAxis = d3.svg.axis().scale(x).orient("top");
var yAxis = d3.svg.axis().scale(y).orient("left");

svg = d3.select("#chart")
  .append("svg")
  .attr('width', w)
  .attr('height', h);

pathsContainer = svg.append('g')
	.attr('width', containerWidth)
	.attr('height', containerHeight)
	.attr('transform', 'translate(' + marginLeft + ',0)')
	.attr("class", "paths_container");

pathsContainer.selectAll("path").data(data).enter().append("svg:path")
	.attr("d", function(d,i){ console.log(line(d)); return line(d); })
	.attr("class", "justice_path")
	.attr("transform", "translate(0,40)")
	.style("stroke-width", 5)
  .style("stroke", "steelblue")
  .style("fill", "none")
  	.on("mouseover", function(){ d3.select(this).attr('stroke', 'red')});

svg.append("svg:g")
	.attr("class", "x axis")
	.attr("transform", "translate(" + marginLeft + ", 30)")
	.call(xAxis);

svg.append("svg:g")
	.attr("class", "y axis")
	.attr("transform", "translate(50, 40)")
	.call(yAxis);






