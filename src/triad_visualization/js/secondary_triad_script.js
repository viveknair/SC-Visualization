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

var w = 1000
var h = 550;
var containerWidth = w - 200;
var containerHeight = h - 200;
var startingYear = 1970;
var marginLeft = 200;
var marginRight = 100;
var marginTop = 100;
var caseBuffer = 250;
var distanceJudges = 30;
var circleRadius = 20;

//======> Start Test Data
var data = [
  { chief: 0, leaning: 1, direction: 1, name: "FFrankfurter" },
  { chief: 1, leaning: 0, direction: 1, name: "FMVinson" },
  { chief: 0, leaning: 1, direction: 2, name: "FMurphy" },
  { chief: 0, leaning: 0, direction: 1, name: "HHBurton" },
  { chief: 0, leaning: 1, direction: 1, name: "HLBlack" },
  { chief: 0, leaning: 0, direction: 1, name: "RHJackson" },
  { chief: 0, leaning: 0, direction: 1, name: "SFReed" },
  { chief: 0, leaning: 1, direction: 1, name: "WBRutledge" },
  { chief: 0, leaning: 1, direction: 2, name: "WODouglas" }
]

var caseX = w / 2;
var caseY = h / 2 - circleRadius;
var considerationCase = [ { x: caseBuffer, y: 0} ]

//======> End Test Data 

function
constructTriadData(data) 
{
  // Stable --> 1
  // Unstable (positive) --> 2
  // Unstable (negative) --> 3

  triadResultData = [];
  for (var i = 0; i < data.length; i ++) {
    for (var j = i + 1; j < data.length; j ++) {
      triadRelation = { sindex: i, tindex: j, stable: 1, path: ''};

      if (data[i].leaning != data[j].leaning && data[i].vote == data[j].vote)  {
        triadRelation.stable = 2;
      } else if (data[i].leaning == data[j].leaning && data[i].vote != data[j].vote) {
        triadRelation.stable = 3;
      }   
      
      triadRelation.path =  'M ' + data[i].x + ' ' + data[i].y + ' L ' + data[j].x + ' ' + data[j].y + ' L ' + considerationCase[0].x + ' ' + considerationCase[0].y + ' z';

      triadResultData.push( triadRelation );
    }
  }

  return triadResultData;    
}

//======>  Start Arc Information
var justice_innerRadius = Math.min(containerWidth, containerHeight) * (2 / 3);
var justice_outerRadius = Math.min(containerWidth, containerHeight) * (2 / 3); 

var justice_startAngle = 0;
var justice_endAngle = -Math.PI;
//======> End Arc Information

var arc = d3.svg.arc()
  .startAngle(justice_startAngle)
  .endAngle(justice_endAngle)
  .innerRadius(justice_innerRadius)
  .outerRadius(justice_outerRadius);

function
stabilityColor(d) {
  if (d.stable == 1) {
    return 'white';
  } else if (d.stable == 2) {
    return 'turquoise';
  } else {
    return 'red';
  }
}

function
initializeTriadViz(caseName) 
{

  var svg = d3.select("#chart")
    .append("svg:svg")
    .attr('width', w)
    .attr('height', h);

  var justiceGrouping = svg.append('svg:g')
    .attr('class', 'justiceGrouping')
    .attr('transform', function() {
      return 'translate(' + (w / 2) + ',' + (h / 2) + ')';
    });

  var justiceArc = justiceGrouping
    .append('svg:path')
    .attr('d', arc)
    .style('stroke', 'black'); 

  var justiceArcEl = justiceArc.node();
  var justiceArcLength = justiceArcEl.getTotalLength();
  var pixelDivision = justiceArcLength / (data.length - 1);

  for (var i = 0; i < data.length; i ++) {
    var currentJusticePoint = justiceArcEl.getPointAtLength(pixelDivision * i / 2);
    data[i].x = currentJusticePoint.x;
    data[i].y = currentJusticePoint.y;
  }

  var triadData = constructTriadData(data);
  var triadPaths = justiceGrouping
    .selectAll('path.triadPath')
    .data(triadData)

  triadPathsCalculate(triadPaths, justiceGrouping);

  // Coalesce into the other justice ones?
  var caseCircle = justiceGrouping
    .selectAll('circle.caseCircle')
    .data(considerationCase)
   .enter()
    .append('svg:circle')
    .attr({
      r: circleRadius,
      fill: 'black',
      class: 'caseCircle',
      transform: function(d,i) {
        return 'translate(' + d.x + ',' + d.y + ')';
      }
    })

  var justiceCircles = justiceGrouping
    .selectAll('circle.justiceCircle')
    .data(data)
   .enter().append('svg:circle')
    .attr({
      r: circleRadius,
      fill: function(d,i) {
        return (d.chief == 1) ? 'steelblue' : 'black';
      },
      class: 'justiceCircle',
      id: function(d,i) {
        return 'justiceCircle-' + i; 
      },
      transform: function(d,i) {
        // Setting the data location
        return 'translate(' + (d.x) + ',' + (d.y) + ')';
      }
    })
    .style({
      stroke: 'black'
    })
    .on('mouseover', function(cd,ci) {
      triadPaths  
        .style('opacity', function(d,i) {
          if (d.tindex == ci || d.sindex == ci) {
            return 1.0;
          } else {
            return 0; 
          }
        });
    })
    .on('mouseout', function(cd,ci) {
       triadPaths.style('opacity', 1.0);
     });

  var justiceCircles = justiceGrouping
    .selectAll('text.shadowJusticeName')
    .data(data)
   .enter().append('svg:text')
    .attr({
      class: 'shadowJusticeName shadow',
      id: function(d,i) {
        return 'shadowJusticeName-' + i; 
      },
      transform: function(d,i) {
        // Setting the data location
        return 'translate(' + (d.x) + ',' + (d.y) + ')';
      }
    })
    .text(function(d,i) { return d.name  })

  var justiceCircles = justiceGrouping
    .selectAll('text.primaryJusticeName')
    .data(data)
   .enter().append('svg:text')
    .attr({
      fill: '#232323',
      class: 'primaryJusticeName',
      id: function(d,i) {
        return 'primaryJusticeName-' + i; 
      },
      transform: function(d,i) {
        // Setting the data location
        return 'translate(' + (d.x) + ',' + (d.y) + ')';
      }
    })
    .text(function(d,i) { return d.name  })

}

function
triadPathsCalculate(triadPaths, justiceGrouping)
{
  triadPaths.enter().append('svg:path')
    .attr({
      fill: function(d,i) { return stabilityColor(d); },
      class: 'triadPath',
      id: function(d,i) {
        return 'triadPath-' + i;
      },
      stroke: 'black',
      d: function(d,i) {
        return d.path;
      } 
    })
    .on('mouseover', function(cd,ci) {
      justiceGrouping
        .selectAll('path.triadPath')
        .each( function() {
          var current = d3.select(this);
          if (current.attr('id') != 'triadPath-' + ci) {
            current.style('opacity', 0.05);
          }
        })
    })
    .on('mouseout', function(cd,ci) {
      justiceGrouping
        .selectAll('path.triadPath')
        .each( function() {
          var current = d3.select(this);
          current.style('opacity', 1.0);
         })
    })
    .on('click', function(cd,ci) {
       var mainElement = d3.select(this);
  
       justiceGrouping
        .selectAll('path.triadPath')
        .each(function() {
          var currentElement = d3.select(this);
          if ( currentElement.attr('fill') == mainElement.attr('fill') ) {
            currentElement.style('opacity', 1.0);
          } else {
            currentElement.style('opacity', 0.05);
          }
        })
     })
}

$(document).ready(initializeTriadViz("test"));
