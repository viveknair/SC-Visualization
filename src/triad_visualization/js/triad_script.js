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
  { name: "Monkey", leaning: 1, vote: 1 },
  { name: "Brains", leaning: 0, vote: 0 },
  { name: "Contro", leaning: 1, vote: 0 },
  { name: "Smang",  leaning: 0, vote: 1  },
  { name: "Sauce",  leaning: 1, vote: 1  },
]

function 
initializeTriadViz(caseName) 
{

  // Search the caseName via the API and set it as the data variable
  var svg = d3.select("#chart")
    .append("svg:svg")
    .attr('width', w)
    .attr('height', h);

  var paths = constructTriadPaths(svg, data, null);
  drawTriadPaths(svg, paths[0]);

  var case_group = svg.append('svg:g')
    .attr('transform', function() {
      return 'translate(' + (w - marginRight) + ',' + h / 2 + ')';
    });

  var case_circle = case_group.append('svg:circle')
    .attr('class',  function() { return 'case-' + caseName; })
    .attr('r', function() { return circleRadius; })
    .attr('fill', 'steelblue');

  var total_justice_group = svg.append('svg:g')
    .attr('transform', function() {
      return 'translate(' + marginLeft + ',' + distanceJudges + ')';
    });

  var justice_group = total_justice_group
    .selectAll('g')
    .data(data)
    .enter().append('svg:g')
    .attr('transform', function(d,i) {
      var indDist = (h - 2 * marginTop) / data.length;
      return 'translate(' + 0 + ',' + (marginTop + indDist * i) + ')';
    });

  var justice_circles = justice_group
    .append('svg:circle')
    .attr('r', function(d,i) { return circleRadius; })
    .attr('fill', 'steelblue')
    .attr('class', function(d,i) {    
      return 'circle-' + i;
    })
    .on('mouseover', function(d,i) {
      d3.selectAll('circle')
        .each(function() {
          current_circle = d3.select(this);
       
          class_current_circle = current_circle.attr('class'); 
          if (class_current_circle != 'circle-' + i && class_current_circle != 'case-' + caseName) {
            current_circle
              .transition()
              .duration(300)
              .style('opacity', 0.75); 
          }
        })
    })
    .on('mouseout', function(d,i) {
      d3.selectAll('circle')
        .each(function() {
          current_circle = d3.select(this);
          current_circle
            .transition()
            .duration(300)
            .style('opacity', 1.0); 
        })
    })
    .on('click', function(d,i) {
      // Re-color the paths to match the relationships to that single node.
      var paths = constructTriadPaths(svg, data, [i, 1]);
      drawTriadPaths(svg, paths[0]); 
      drawArrowPaths(svg, paths[1]); 
    });

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
drawArrowPaths(svg, paths)
{
   console.log(paths);
   var path_selector = svg.selectAll('path.justice_individual_relation')
    .data(paths)

   path_selector
     .transition()
     .duration(300)
     .attr('d', function(d,i) { return d; })
     .attr('fill', 'none')
     .attr('stroke', '#555')
     .attr('stroke-width', '1.5px'); 
   
  // Instantiating the new ones
  path_selector
   .enter()
    .append('svg:path')
    .attr('class', 'justice_individual_relation')
    .attr('d', function(d,i) { return d; })
    .attr('fill', 'none')
    .attr('stroke', '#555')
    .attr('stroke-width', '1.5px'); 
}

function
drawTriadPaths(svg, paths) 
{
  var path_selector = svg.selectAll('path.justice_case_relation')
    .data(paths)

  // Updating the elements
  path_selector
   .transition()
   .duration(300)
   .attr('fill', function(d, i) {
     if (d.stable[0] == 0) {
       return 'white';
     } else if (d.stable[1] == 0) {
       return 'turquoise'; 
     } else {
       return 'red';
     }
    })
    .attr('stroke', 'black');
   
  // Instantiating the new ones
  path_selector
   .enter()
    .append('svg:path')
    .attr('class', 'justice_case_relation')
    .attr('d', function(d,i) { return d.raw_path; })
    .attr('fill', function(d, i) {
      if (d.stable[0] == 0) {
        return 'white';
      } else if (d.stable[1] == 0) {
        return 'turquoise'; 
      } else {
        return 'red';
      }
    })
    .attr('stroke', 'black');
}

function
constructNodeArrow(svg, consideration, current) 
{

   var indDist = (h - 2 * marginTop) / data.length;
   var consideration_dev = marginTop + circleRadius + indDist * consideration;
   var current_dev = marginTop + circleRadius + indDist * current;

   var dx = 0, dy = consideration_dev - current_dev,
       dr = Math.sqrt(dx * dx + dy * dy);

   dr = (consideration_dev < current_dev) ? dr * -1 : dr;

   var pathQuery = "M " + marginLeft + " , " + consideration_dev +  " A " + dr + " , " + dr + " 0 0,1 " + marginLeft + "," + current_dev;

   return pathQuery;
}

function 
constructTriadPaths(svg, data, particular) 
{
  var indDist = (h - 2 * marginTop) / data.length;
  var paths = [];
  var arrow_paths = [];

  for (var i = 0; i < data.length; i ++) {

    if (particular && particular[0] != i) { 
      arrow_paths.push( constructNodeArrow(svg, particular[0], i) );
    }

    if (i == 0) continue;
    var x = [marginLeft, marginTop + distanceJudges + indDist * i];
    var y = [marginLeft, marginTop + distanceJudges + indDist * (i - 1)];
    var z = [w - marginRight, h / 2];

    // Assumption of regular stability
    var stable = [0, 0];
    consideration_value = (particular != null && particular[0] != i) ? particular[0]  : i-1;
 
    if (data[i].leaning == data[consideration_value].leaning) {
      if (data[i].vote != data[consideration_value].vote) {
        // Negative instability
        stable = [1, 1];
      } 
    } else {
       if (data[i].vote == data[consideration_value].vote) {
        // Positive instability
        stable = [1, 0];
      }  
    }


    paths.push({ 
      stable : stable, 
      raw_path : 'M ' + x[0] + ' ' + x[1] + ' L ' + y[0] + ' ' + y[1] + ' L ' + z[0] + ' ' + z[1] + ' z' 
    });
  }

  return [paths, arrow_paths];
}

$(document).ready(initializeTriadViz("test"));
