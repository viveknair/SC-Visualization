/* Constants and data*/

var w = 1000,
    h = 1200,
    containerWidth = w - 200,
    containerHeight = h - 200;

var scaleWidth = w,
    scaleHeight = 30,
    numTicks = 10;

var startingYear = 1970;
var marginLeft = 100;
var marginTop = 30;


var liberalData = [{numCases: 10, year: 1970}, {numCases:8, year: 1971}, {numCases:5, year: 1972}, {numCases: 3, year: 1973},{numCases: 7, year: 1974}, {numCases: 4, year: 1975},{numCases:2, year: 1976}, {numCases:9, year: 1977}, {numCases: 3, year: 1978},{numCases: 5, year: 1979}, {numCases: 2, year: 1980}];
var conservativeData = [{numCases: 4, year: 1970}, {numCases:4, year: 1971}, {numCases:9, year: 1972}, {numCases: 3, year: 1973},{numCases: 9, year: 1974}, {numCases: 4, year: 1975},{numCases:2, year: 1976}, {numCases:8, year: 1977}, {numCases: 8, year: 1978},{numCases: 5, year: 1979}, {numCases: 10, year: 1980}];

var getYear = function(d){
  return d.year;
}

var getCases = function(d){
  return d.numCases;
}

var maxCases = d3.max([d3.max(liberalData, getCases), d3.max(conservativeData, getCases)]);
var minYear = d3.min([d3.min(liberalData, getYear), d3.min(conservativeData, getYear)]);
var maxYear = d3.max([d3.max(liberalData, getYear), d3.max(conservativeData, getYear)]);
/* Create scales and area layouts */
var x = d3.scale.linear().domain([-20, 20]).range([0, containerWidth]),
    y = d3.scale.linear().domain([startingYear,startingYear + 10]).range([0, containerHeight]);

var liberalArea = d3.svg.area()
                          .x(function(d){ return y(d.year)})
                          .y1(x(0))
                          .y0(function(d){ return x(d.numCases)})
                          .interpolate('basis');

var conservativeArea = d3.svg.area()
                          .x(function(d){ return y(d.year)})
                          .y1(x(0))
                          .y0(function(d){ return x(-d.numCases)})
                          .interpolate('basis');

var xAxis = d3.svg.axis().scale(x).orient("top").ticks(10).tickFormat(d3.format(".0")),
		yAxis = d3.svg.axis().scale(y).orient("left").ticks(10).tickFormat(d3.format(".0f"));

/* Start rendering svg */

svg = d3.select("#chart")
  .append("svg")
  .attr('width', w)
  .attr('height', h);

topScale = d3.select("#fixed-scale")
            .append("svg")
            .attr('width', scaleWidth)
            .attr('height', scaleHeight);

pathsContainer = svg.append('g')
	.attr('width', containerWidth)
	.attr('height', containerHeight)
	.attr('transform', 'translate(' + marginLeft + ',0)')
	.attr("class", "paths_container gradient");

//Add axes and grid lines 
pathsContainer.selectAll("line.x")
  .data(x.ticks(numTicks))
  .enter().append("line")
  .attr("transform", "translate(0," + marginTop + ")")
  .attr("class", "x")
  .attr("x1", x)
  .attr("x2", x)
  .attr("y1", 0)
  .attr("y2", containerHeight);

pathsContainer.selectAll("line.y")
  .data(y.ticks(numTicks))
  .enter().append("line")
  .attr("transform", "translate(0," + marginTop + ")")
  .attr("class", "y")
  .attr("x1", 0)
  .attr("x2", containerWidth)
  .attr("y1", y)
  .attr("y2", y);

topScale.append("svg:g")
	.attr("class", "x axis")
	.attr("transform", "translate(" + [marginLeft, marginTop] + ")")
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
