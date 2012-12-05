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

var w = 600
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

var justiceCircles;

var caseX = w / 2;
var caseY = h / 2 - circleRadius;
var considerationCase = [ { caseName: "WADE v. HUNTER, WARDEN",  x: caseBuffer, y: 0} ]

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
      
      var dxi = data[i].x - data[j].x;
      var dyi = data[i].y - data[j].y;
      var dri = Math.sqrt( dxi * dxi + dyi * dyi );

      var dxj = data[j].x - considerationCase[0].x;
      var dyj = data[j].y - considerationCase[0].y;
      var drj = Math.sqrt( dxj * dxj + dyj * dyj );

      var dxz = data[i].x - considerationCase[0].x;
      var dyz = data[i].y - considerationCase[0].y;
      var drz = Math.sqrt( dxz * dxz + dyz * dyz );

       // triadRelation.path =  'M ' + data[i].x + ' ' + data[i].y + ' A ' + dri + ' , ' + dri + " 0 0,0 " + data[j].x + ' , ' + data[j].y + ' A ' + drj + ' , ' + drj + " 1 0,0 " + considerationCase[0].x + ' , ' + considerationCase[0].y + ' z '; 

      triadRelation.path =  'M ' + data[i].x + ' ' + data[i].y + ' A ' + dri + ' , ' + dri + " 0 0,0 " + data[j].x + ' , ' + data[j].y + ' A ' + drj + ' , ' + drj + " 1 0,0 " + considerationCase[0].x + ' , ' + considerationCase[0].y + ' z '; 

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

  justiceCircles = justiceGrouping
    .selectAll('circle.justiceCircle')
    .data(data)

  justiceCircles.enter().append('svg:circle')
    .attr({
      r: circleRadius,
      fill: function(d,i) {
        return (d.chief == 1) ? 'steelblue' : '#AAA';
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
          return (d.tindex == ci || d.sindex == ci) ? 1.0 : 0.0; 
        });
    })
    .on('mouseout', function(cd,ci) {
       triadPaths.style('opacity', 1.0);
     });

  var justiceTexts = justiceGrouping
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

  var justiceShadowTexts = justiceGrouping
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
clearPathText() 
{
  $('#explanation_text').html("");
}

function 
updatePathText(triadRelation) 
{
  var firstJusticeName = data[triadRelation.sindex].name;
  var secondJusticeName = data[triadRelation.tindex].name;
  
  var constructedString = "<p> Justice " + firstJusticeName + " and Justice " + secondJusticeName + " have a "; 
  if (triadRelation.stable == 1) {
    constructedString += "stable"
  } else if (triadRelation.stable == 2) {
    constructedString += "unstable (positive)"
  } else {
    constructedString += "unstable (negative)"
  }
  constructedString += " relationship</p>"

  $('#explanation_text').append(constructedString);
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
      opacity: 0.2,
      stroke: 'black',
      d: function(d,i) {
        return d.path;
      } 
    })
    .on('mouseover', function(cd,ci) {
      triadPaths
        .transition()
        .duration(300)
        .style('opacity', function(d,i) {
          return (i == ci) ? 1.0 : 0.05;
        });
    
      justiceCircles
        .attr('fill', function(d,i) {
          var resultingColor = (i != cd.sindex && i != cd.tindex) ? '#AAA' : 'black';
          if (resultingColor != 'black') {
            resultingColor = (d.chief == 1) ? 'steelblue' : '#AAA';
          }

          return resultingColor;
        });

      updatePathText(cd);
      $('#explanation_text')  
    })
    .on('mouseout', function() {

      justiceCircles
        .attr('fill', function(d,i) {
          return (d.chief == 1) ? 'steelblue' : 'black';
        })

      clearPathText();
      triadPaths
        .transition()
        .duration(300)
        .style('opacity', 0.2);
    })
}

$(document).ready(initializeTriadViz("test"));
