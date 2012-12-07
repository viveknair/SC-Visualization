/* Constants and data*/

var w = 1000,
    h = 1500,
    containerWidth = w - 200,
    containerHeight = h - 200;

var scaleWidth = w,
    scaleHeight = 30,
    numTicks = 40;

var startingYear = 1970;
var marginLeft = 100;
var marginTop = 30;
var interpolation = 'linear';

var data = [{"conservative_votes":54,"liberal_votes":60,"year":1946},{"conservative_votes":30,"liberal_votes":67,"year":1947},{"conservative_votes":47,"liberal_votes":60,"year":1948},{"conservative_votes":42,"liberal_votes":37,"year":1949},{"conservative_votes":45,"liberal_votes":36,"year":1950},{"conservative_votes":44,"liberal_votes":30,"year":1951},{"conservative_votes":50,"liberal_votes":45,"year":1952},{"conservative_votes":48,"liberal_votes":45,"year":1953},{"conservative_votes":26,"liberal_votes":68,"year":1954},{"conservative_votes":30,"liberal_votes":80,"year":1955},{"conservative_votes":38,"liberal_votes":81,"year":1956},{"conservative_votes":76,"liberal_votes":99,"year":1957},{"conservative_votes":51,"liberal_votes":99,"year":1958},{"conservative_votes":49,"liberal_votes":81,"year":1959},{"conservative_votes":62,"liberal_votes":78,"year":1960},{"conservative_votes":38,"liberal_votes":82,"year":1961},{"conservative_votes":40,"liberal_votes":126,"year":1962},{"conservative_votes":37,"liberal_votes":161,"year":1963},{"conservative_votes":45,"liberal_votes":95,"year":1964},{"conservative_votes":48,"liberal_votes":97,"year":1965},{"conservative_votes":56,"liberal_votes":110,"year":1966},{"conservative_votes":69,"liberal_votes":170,"year":1967},{"conservative_votes":41,"liberal_votes":120,"year":1968},{"conservative_votes":60,"liberal_votes":87,"year":1969},{"conservative_votes":85,"liberal_votes":76,"year":1970},{"conservative_votes":89,"liberal_votes":95,"year":1971},{"conservative_votes":103,"liberal_votes":87,"year":1972},{"conservative_votes":92,"liberal_votes":80,"year":1973},{"conservative_votes":76,"liberal_votes":88,"year":1974},{"conservative_votes":115,"liberal_votes":68,"year":1975},{"conservative_votes":128,"liberal_votes":68,"year":1976},{"conservative_votes":76,"liberal_votes":82,"year":1977},{"conservative_votes":97,"liberal_votes":74,"year":1978},{"conservative_votes":76,"liberal_votes":75,"year":1979},{"conservative_votes":81,"liberal_votes":69,"year":1980},{"conservative_votes":99,"liberal_votes":85,"year":1981},{"conservative_votes":94,"liberal_votes":83,"year":1982},{"conservative_votes":105,"liberal_votes":66,"year":1983},{"conservative_votes":84,"liberal_votes":76,"year":1984},{"conservative_votes":90,"liberal_votes":74,"year":1985},{"conservative_votes":85,"liberal_votes":81,"year":1986},{"conservative_votes":69,"liberal_votes":73,"year":1987},{"conservative_votes":87,"liberal_votes":70,"year":1988},{"conservative_votes":73,"liberal_votes":64,"year":1989},{"conservative_votes":65,"liberal_votes":60,"year":1990},{"conservative_votes":70,"liberal_votes":51,"year":1991},{"conservative_votes":57,"liberal_votes":49,"year":1992},{"conservative_votes":66,"liberal_votes":37,"year":1993},{"conservative_votes":44,"liberal_votes":28,"year":1994},{"conservative_votes":53,"liberal_votes":34,"year":1995},{"conservative_votes":60,"liberal_votes":34,"year":1996},{"conservative_votes":51,"liberal_votes":35,"year":1997},{"conservative_votes":55,"liberal_votes":32,"year":1998},{"conservative_votes":44,"liberal_votes":33,"year":1999},{"conservative_votes":36,"liberal_votes":41,"year":2000},{"conservative_votes":37,"liberal_votes":28,"year":2001},{"conservative_votes":39,"liberal_votes":33,"year":2002},{"conservative_votes":50,"liberal_votes":34,"year":2003},{"conservative_votes":33,"liberal_votes":38,"year":2004},{"conservative_votes":51,"liberal_votes":30,"year":2005},{"conservative_votes":41,"liberal_votes":22,"year":2006},{"conservative_votes":32,"liberal_votes":31,"year":2007},{"conservative_votes":58,"liberal_votes":35,"year":2008},{"conservative_votes":51,"liberal_votes":44,"year":2009},{"conservative_votes":50,"liberal_votes":42,"year":2010},{"conservative_votes":51,"liberal_votes":37,"year":2011}]

var liberalData = [{numCases: 10, year: 1970}, {numCases:8, year: 1971}, {numCases:5, year: 1972}, {numCases: 3, year: 1973},{numCases: 7, year: 1974}, {numCases: 4, year: 1975},{numCases:2, year: 1976}, {numCases:9, year: 1977}, {numCases: 3, year: 1978},{numCases: 5, year: 1979}, {numCases: 2, year: 1980}];
var conservativeData = [{numCases: 4, year: 1970}, {numCases:4, year: 1971}, {numCases:9, year: 1972}, {numCases: 3, year: 1973},{numCases: 9, year: 1974}, {numCases: 4, year: 1975},{numCases:2, year: 1976}, {numCases:8, year: 1977}, {numCases: 8, year: 1978},{numCases: 5, year: 1979}, {numCases: 10, year: 1980}];

var getYear = function(d){
  return d.year;
}

var getCases = function(d){
  return d3.max([d.conservative_votes, d.liberal_votes]);
}

var maxCases = d3.max(data, getCases);
var minYear = d3.min(data, getYear);
var maxYear = d3.max(data, getYear);

/* Create scales and area layouts */
var x = d3.scale.linear().domain([-maxCases, maxCases]).range([0, containerWidth]),
    y = d3.scale.linear().domain([minYear, maxYear]).range([0, containerHeight]);

var liberalArea = d3.svg.area()
                          .x(function(d){ return y(d.year)})
                          .y1(x(0))
                          .y0(function(d){ return x(d.liberal_votes)})
                          .interpolate(interpolation);

var conservativeArea = d3.svg.area()
                          .x(function(d){ return y(d.year)})
                          .y1(x(0))
                          .y0(function(d){ return x(-d.conservative_votes)})
                          .interpolate(interpolation);

var xAxis = d3.svg.axis().scale(x).orient("top").ticks(10).tickFormat(d3.format(".0")),
		yAxis = d3.svg.axis().scale(y).orient("left").ticks(numTicks).tickFormat(d3.format(".0f"));

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


// Add actual data
pathsContainer.append('path').datum(data)
                .attr('class', 'cases liberal')
                .attr('d', function(d){ return liberalArea(d)})
                .attr('transform', 'rotate(90) translate(' + [marginTop, -containerWidth] +')');

pathsContainer.append('path').datum(data)
                .attr('class', 'cases conservative')
                .attr('d', function(d){ return conservativeArea(d)})
                .attr('transform', 'rotate(90) translate(' + [marginTop, -containerWidth] +')');

//Adding hoverable decades

pathsContainer.selectAll("rect")
  .data(y.ticks(numTicks))
  .enter().append("rect")
  .attr('class', 'decadeSelector')
  .attr("transform", "translate(0," + marginTop + ")")
  .attr("x", 0)
  .attr("width", containerWidth)
  .attr("y", function(d,i){ if(i === 0 || i === numTicks) { return y(d) } else return y(d) - (containerHeight/numTicks)/2})
  .attr("height", function(d,i){ if(i === 0 || i === numTicks) { return containerHeight/numTicks/2; } else return containerHeight/numTicks;})  
  .on('click', function(d){
    console.log("Clicked data point: " + d);
  });
