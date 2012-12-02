/* Author:

*/
var w = 1000
var h = 1200;
var containerWidth = w - 200;
var containerHeight = h - 200;

var startingYear = 1970;

var x = d3.scale.linear().domain([-10, 10]).range([0, containerWidth]),
    y = d3.scale.linear().domain([startingYear,startingYear + 10]).range([0, containerHeight]);

data = [[{x: 0}, {x:0}, {x:1}, {x: 5},{x: 7}, {x: -4},{x:-2}, {x:1}, {x: 3},{x: 5}, {x: -2}],
			[{x: -5}, {x:-5}, {x:-2}, {x: -3},{x: -1}, {x: -1},{x:2}, {x:1}, {x: 2},{x: 5}, {x: 6}]];

var line = d3.svg.line()
    .x(function(d) { return x(d.x); })
    .y(function(d,i) { return y(startingYear + i); })
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
	.attr("class", "paths_container")
	.on("mouseover", function(){ console.log("Ha")});

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
	.attr("transform", "translate(0, 30)")
	.call(xAxis);

svg.append("svg:g")
	.attr("class", "y axis")
	.attr("transform", "translate(50, 40)")
	.call(yAxis);






