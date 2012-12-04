var w = 1000
var h = 700;
var containerWidth = w - 200;
var containerHeight = h - 200;
var startingYear = 1970;
var marginLeft = 200;
var marginRight = 100;
var marginTop = 100;
var distanceJudges = 30;
var circleRadius = 20;

// The entire response that is sent through is 
// the case information and judge array
// Something along the lines of this:
//  -> {
//       case : { Case Information}
//       justices : [
//         { Justice 1 },
//         { Justice 2 },
//         { Justice 3 } 
//       ]
//     }


// Each data element has justice information
//  -> name, political leaning, vote decision
//  -> leaning is either 0 or 1 (conservative or liberal)
//  -> vote is either 0 or 1 (conservative or liberal)

var data = [
  {name: "Monkey", leaning: 1, vote: 1},
  {name: "Brains", leaning: 0, vote: 0},
  {name: "Contro", leaning: 1, vote: 0},
  {name: "Smang", leaning: 0, vote: 1},
  {name: "Sauce", leaning: 1, vote: 1},
]

function 
initializeTriadViz(caseName) 
{

  // Search the caseName via the API and set it as the data variable

  var svg = d3.select("#chart")
    .append("svg:svg")
    .attr('width', w)
    .attr('height', h);

  var paths = constructTriadPaths(svg, data);

  console.log("paths");
  console.log(paths);

  for (var i = 0; i < paths.length; i ++) {
    svg.selectAll('path')
      .data(paths)
     .enter()
      .append('svg:path')
      .attr('d', function(d,i) { return d; })
      .attr('fill', 'white')
      .attr('stroke', 'black');
  }

  var case_group = svg.append('svg:g')
    .attr('transform', function() {
      return 'translate(' + (w - marginRight) + ',' + h / 2 + ')';
    })

  var case_circle = case_group.append('svg:circle')
    .attr('r', function() { return circleRadius; })
    .attr('fill', 'steelblue')

  var total_justice_group = svg.append('svg:g')
    .attr('transform', function() {
      return 'translate(' + marginLeft + ',' + distanceJudges + ')';
    })

  var justice_group = total_justice_group
    .selectAll('g')
    .data(data)
    .enter().append('svg:g')
    .attr('transform', function(d,i) {
      var indDist = (h - 2 * marginTop) / data.length;
      return 'translate(' + 0 + ',' + (marginTop + indDist * i) + ')'
    })

  var justice_circles = justice_group
    .append('svg:circle')
    .attr('r', function(d,i) { return circleRadius; })
    .attr('fill', 'steelblue')

  var justices_names_shadow = justice_group
    .append('svg:text')
    .attr('transform', function(d,i) {
      return 'translate(' + (-2 * circleRadius) + ',' + 0 + ')';
    })
    .attr('class', 'shadow')
    .text(function(d,i) {
      return d.name; 
    }); 

  var justice_names = justice_group
    .append('svg:text')
    .attr('transform', function(d,i) {
      return 'translate(' + (-2 * circleRadius) + ',' + 0 + ')';
    })
    .text(function(d,i) {
      return d.name; 
    }); 

}

function 
constructTriadPaths(svg, data) 
{
  var indDist = (h - 2 * marginTop) / data.length;
  var paths = [];

  for (var i = 0; i < data.length; i ++) {
    if (i == 0) continue;
    var x = [marginLeft, marginTop + distanceJudges + indDist * i];
    var y = [marginLeft, marginTop + distanceJudges + indDist * (i - 1)];
    var z = [w - marginRight, h / 2];

    paths.push('M ' + x[0] + ' ' + x[1] + ' L ' + y[0] + ' ' + y[1] + ' L ' + z[0] + ' ' + z[1] + ' z');
  }

  return paths;
}

$(document).ready(initializeTriadViz("test"));
