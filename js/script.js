/* Author:

*/

var containerWidth = 400;
var containerHeight = 800;

var x = d3.scale.linear().domain([-10, 10]).range([0, containerWidth]),
    y = d3.scale.linear().domain([0,10]).range([0, containerHeight]);

data = [[{x: 0}, {x:0}, {x:1}, {x: 5},{x: 7}, {x: -4},{x:-2}, {x:1}, {x: 3},{x: 5}, {x: -2}],
			[{x: -5}, {x:-5}, {x:-2}, {x: -3},{x: -1}, {x: -1},{x:2}, {x:1}, {x: 2},{x: 5}, {x: 6}]];

var line = d3.svg.line()
    .x(function(d) { return x(d.x); })
    .y(function(d,i) { return y(i); })
    .interpolate("cardinal")
    .tension(.75);

svg = d3.select("#chart")
  .append("svg")
  .attr('width', containerWidth)
  .attr('height', containerHeight);

pathsContainer = svg.append('g')
	.attr('width', containerWidth)
	.attr('height', containerHeight)
	.attr("class", "paths_container")
	.on("mouseover", function(){ console.log("Ha")});

pathsContainer.selectAll("path").data(data).enter().append("svg:path")
	.attr("d", function(d,i){ console.log(line(d)); return line(d); })
	.attr("class", "justice_path")
	.style("stroke-width", 5)
  .style("stroke", "steelblue")
  .style("fill", "none")
  	.on("mouseover", function(){ d3.select(this).attr('stroke', 'red')});







