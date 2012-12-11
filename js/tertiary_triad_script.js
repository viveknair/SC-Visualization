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


var triadVisualization = {

  initialize: function() { 
    var w = 600;
    var h = 550;
    var containerWidth = w - 200;
    var containerHeight = h - 200;
    var startingYear = 1970;
    var marginLeft = 200;
    var marginRight = 100;
    var marginTop = 100;
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
    
    //======> End Test Data 
    
    var stateContainer = {
      arrayCaseNames: [],
      currentCaseName: null,
      capturedJSON: null
    };
    
    // Custom sexy colors that were hand-picked 
    // (just like Italian grapes!)
    var color_options = [
      '#1f77b4', '#aec7e8', '#ff7f0e', 
      '#ffbb78', '#2ca02c', '#98df8a', 
      '#d62728', '#ff9896', '#9467bd',     
      '#c5b0d5', '#c49c94', '#e377c2', 
      '#f7b6d2', '#7f7f7f', '#c7c7c7', 
      '#17becf', '#9edae5'
    ]
 


    searchAnimation();
    nextCaseAnimation();

    color_options = color_options.reverse()
    function justiceNameMapper(datum) { return datum.name }
    var justiceNames = data.map( justiceNameMapper );
    
    var custom_color = d3.scale.ordinal()
      .domain(justiceNames)
      .range(color_options)
    
    var justiceCircles;
    
    var caseX = w / 2;
    var caseY = h / 2 - circleRadius;
    var considerationCase = {}; // [ { caseName: "WADE v. HUNTER, WARDEN", y: 0} ]
    
    function
    isUpperCase(char) 
    {
      return char == char.toUpperCase() && char.search(/^[a-z0-9]+$/i) != -1;
    }
    
    function
    constructAppropriateName(raw_data) 
    {
      for( var i = 0; i < data.length; i ++) {
        var constructedString = "";
        var dataStringLength = data[i].name.length;
        for( var j = 0; j < dataStringLength; j ++) {
          var currentChar = data[i].name.charAt(j);
          var nextChar = data[i].name.charAt(j + 1);
          constructedString += currentChar;
          if ( isUpperCase(currentChar) && isUpperCase(nextChar) ) {
            constructedString += '. '; 
          }
        }
        data[i].name = constructedString;
      } 
    }
    
    
    function
    calculateRDelta( first, second)
    {
      var dxi = first.x - second.x;
      var dyi = first.y - second.y;
      return Math.sqrt( dxi * dxi + dyi * dyi );
    }
    
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
    
          if ( data[i].leaning != data[j].leaning 
               && data[i].direction == data[j].direction )  {
            console.log("Unstable (positive) relationship");
            triadRelation.stable = 2;
          } 
    
          if (data[i].leaning == data[j].leaning 
               && data[i].direction != data[j].direction) {
            console.log("Unstable (negative) relationship");
            triadRelation.stable = 3;
          }   
          
          var dri = calculateRDelta(data[i], data[j]);
    
          triadRelation.path =  'M ' + data[i].x + ' ' + data[i].y + ' A ' 
                              + dri + ' , ' + dri + " 0 0,0 " + data[j].x 
                              + ' , ' + data[j].y;
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
      switch(d.stable) {
        case 1:
          return '0,2 1 ';
        case 2:
          return '';
        default:
          return '5,10'
      }
    }
    
    function
    setCaseName(considerationCase)
    {
      if (considerationCase.caseName) {
        $('#case_main_header').html(considerationCase.caseName);  
        $('#main_header').html("Justice Stability");
      }
    }
    
    // Start visualization =======>
    
    var svg = d3.select("#triadVisualizationChart")
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
      .attr({
        d: arc
      })
      .style({
        stroke: 'white'
      }); 
    
    var justiceArcEl = justiceArc.node();
    var justiceArcLength = justiceArcEl.getTotalLength();
    
    
    // End visualization =======>
    
    function
    initializeTriadViz() 
    {
      justiceArc.style({  opacity: 0.5 });
    
      setCaseName(considerationCase);
        
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
    
      justiceShadowCircles = justiceGrouping
        .selectAll('circle.white_justiceCircle')
        .data(data)
    
      justiceShadowCircles
        .transition()
        .duration(1000)
        .attr({
        transform: function(d,i) {
          // Setting the data location
          return 'translate(' + (d.x) + ',' + (d.y) + ')';
        }
      })
    
      justiceShadowCircles.enter().append('svg:circle')
        .attr({
          r: circleRadius,
          fill: 'white',
          class: 'white_justiceCircle',
          id: function(d,i) {
            return 'white_justiceCircle-' + i; 
          },
          transform: function(d,i) {
            // Setting the data location
            return 'translate(' + (d.x) + ',' + (d.y) + ')';
          }
        })
    
      // Deleting old nodes
      var exitShadowCircles = justiceShadowCircles.exit()
        .transition()
        .duration(1000)
        .style({
          opacity: 0.0
        });
    
      exitShadowCircles.remove();
    
      justiceCircles = justiceGrouping
        .selectAll('circle.justiceCircle')
        .data(data)
    
      // Updating the existing circles
      justiceCircles
        .transition()
        .duration(1000)
        .attr({
          transform: function(d,i) {
            // Setting the data location
            return 'translate(' + (d.x) + ',' + (d.y) + ')';
          }
        })
    
      justiceCircles.enter().append('svg:circle')
        .attr({
          r: circleRadius,
          fill: function(d,i) {
            return (d.leaning == 1) ? '#CC1133' : '#4682b4';
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
          clearPathText();
          triadPaths  
            .transition()
            .duration(300)
            .style('opacity', function(d,i) {
              return ( (d.tindex == ci || d.sindex == ci) && d.stable != 1) ? 0.3 : 0.03; 
            });
    
          updateBatchPathText(triadPaths, ci);
          brightPathText();
        })
        .on('mouseout', function(cd,ci) {
          triadPaths
            .transition()
            .duration(300)
            .style('opacity', 0.1);
    
        });
    
      // Deleting old nodes
      var exitCircles = justiceCircles.exit()
        .transition()
        .duration(1000)
        .style({ opacity: 0.0 })
    
      exitCircles.remove()
    
      var justiceTexts = justiceGrouping
        .selectAll('text.shadowJusticeName')
        .data(data)
    
      justiceTexts
        .text(function(d) { return d.name;  });
    
      justiceTexts
       .enter().append('svg:text')
        .text(function(d,i) { return d.name  })
        .attr({
          class: 'shadowJusticeName shadow',
          id: function(d,i) {
            return 'shadowJusticeName-' + i; 
          },
          transform: function(d,i) {
            // Setting the data location
            var text = d3.select(this);
            var textBoundingBox = text.node().getBBox(); 
            return 'translate(' + (d.x + textBoundingBox.width / 4) + ',' + (d.y) + ')';
          }
        })
    
      justiceTexts.exit().remove();
    
      var justiceShadowTexts = justiceGrouping
        .selectAll('text.primaryJusticeName')
        .data(data)
    
      justiceShadowTexts
        .text(function(d) { return d.name;  });
    
      justiceShadowTexts
       .enter().append('svg:text')
        .text(function(d,i) { return d.name  })
        .attr({
          fill: '#232323',
          class: 'primaryJusticeName',
          id: function(d,i) {
            return 'primaryJusticeName-' + i; 
          },
          transform: function(d,i) {
            // Setting the data location
            var text = d3.select(this);
            var textBoundingBox = text.node().getBBox(); 
            return 'translate(' + (d.x + textBoundingBox.width / 4) + ',' + (d.y) + ')';
          }
        })
    
      justiceShadowTexts.exit().remove();
    
    }
    
    function
    opaquePathText() 
    {
      d3.select('#explanation_text').style('opacity', 0.5);
    }
    
    function
    brightPathText()
    {
      d3.select('#explanation_text').style('opacity', 1.0);
    }
    
    
    function clearPathText()
    {
      $('#explanation_text').html('');
    }
    
    function 
    updatePathText(triadRelation) 
    {
      var firstJusticeName = data[triadRelation.sindex].name;
      var secondJusticeName = data[triadRelation.tindex].name;
    
      var leaningClassFirst = (data[triadRelation.sindex].leaning == 1) ? 'red_individual_justice' : 'blue_individual_justice'; 
      var leaningClassSecond = (data[triadRelation.tindex].leaning == 1) ? 'red_individual_justice' : 'blue_individual_justice'; 
      var constructedString = "<h3> <span class = '" + leaningClassFirst  + "' > Justice " + firstJusticeName + "</span> and <span class = '" + leaningClassSecond + "'> Justice " + secondJusticeName + "</span> have a(n): </h3> <h1 class = 'stability_result'>"; 
      if (triadRelation.stable == 1) {
        constructedString += "<span class = 'stable'>stable</span>"
      } else if (triadRelation.stable == 2) {
        constructedString += "<span class = 'unstable_p'>unstable (positive)</span>"
      } else {
        constructedString += "<span class = 'unstable_n'>unstable (negative)</span>"
      }
      constructedString += " relationship</h1>"
    
      $('#explanation_text').append(constructedString);
    }
    
    function
    updateBatchPathText(triadPaths, ci)
    {
      var leaningClassFirst = (data[ci].leaning == 1) ? 'red_individual_justice' : 'blue_individual_justice'; 
      var constructedString = "<h3> <span class = '" + leaningClassFirst  +  "' > Justice " + data[ci].name + " has a(n): </h3><ul class = 'justice_listing'></ul>" ; 
      $('#explanation_text').append(constructedString);
      var listElements = [];
      triadPaths.each(function(d,i) {
        var listElement = {}
        var otherIndex = null;
        if (ci == d.sindex || ci == d.tindex) {
          otherIndex = (ci == d.sindex) ? d.tindex : d.sindex;   
        }
    
        if (otherIndex != null) {
          var stability = "stable ";
          if (d.stable == 2) {
            stability = "unstable (positive) ";
          } else if (d.stable == 3) {
            stability = "unstable (negative) ";
          }
    
          var otherIndexClass = (data[otherIndex].leaning == 1) ? 'red_individual_justice' : 'blue_individual_justice'; 
          var tempString = "<li>" 
                              + stability + "relationship with <span class = '" 
                              + otherIndexClass + "'>" + data[otherIndex].name 
                              + "</span>" 
                            + "</li>";
    
          listElement.stable = d.stable;
          listElement.sindex = d.sindex;
          listElement.tindex = d.tindex;
          listElement.listString = tempString;
    
          listElements.push(listElement);    
        }
    
      })
    
      d3.select('.justice_listing')
        .selectAll('li.justiceListing')
        .data(listElements)
       .enter().append('li')
        .attr('class', function(d,i) {
          var totalClass = 'justiceListing ';
          switch(d.stable) {
            case 1:
              return totalClass += 'stable';
            case 2:
              return totalClass += 'unstable_p';
            default:
              return totalClass += 'unstable_p';
          }
          return totalClass;
        })
        .html(function(d,i) {
          return d.listString;
        })
        .on('mouseover', function(cd,ci) {
          triadPaths
            .transition()
            .duration(300)
            .style('opacity', function(d,i) {
              if ( (cd.sindex == d.sindex && cd.tindex == d.tindex) ||
                   (cd.tindex == d.sindex && cd.sindex == d.tindex) ) {
                return 1.0;
              } else {
                return 0.0;
              }
            })
    
        })
        .on('mouseout', function() {
          triadPaths
            .transition()
            .duration(300)
            .style('opacity', 0.1)
        });  
    }
    
    function
    nextCaseAnimation() {
      $('#nextCase').click(function() {
        var json = stateContainer.capturedJSON;
        var indexInto = $.inArray(stateContainer.currentCaseName, stateContainer.arrayCaseNames);
        console.log("The indexInto is " + indexInto + " and the current case name is " + stateContainer.currentCaseName);
        var arrayLength = stateContainer.arrayCaseNames.length;
        if (indexInto != -1 && indexInto + 1 < arrayLength - 1)  {
          considerationCaseName = stateContainer.arrayCaseNames[indexInto + 1]; 
        } else {
          considerationCaseName = stateContainer.currentCaseName;
        }
        parseTermJson(considerationCaseName, json, false);
      });
    
      $('#previousCase').click(function() {
        var json = stateContainer.capturedJSON;
        var indexInto = $.inArray(stateContainer.currentCaseName, stateContainer.arrayCaseNames);
        console.log("The indexInto is " + indexInto + " and the current case name is " + stateContainer.currentCaseName);
        var arrayLength = stateContainer.arrayCaseNames.length;
        if (indexInto != -1 && indexInto - 1 >= 0)  {
          considerationCaseName = stateContainer.arrayCaseNames[indexInto - 1]; 
        } else {
          considerationCaseName = stateContainer.currentCaseName;
        }
        parseTermJson(considerationCaseName, json, false);
      });
    }
    
    function
    searchAnimation()
    {
      var searchTermField = $('#searchTermField');
      searchTermField.keyup(function() {
        $("#x").fadeIn();
        if ($.trim(searchTermField.val()) == "") {
            $("#x").fadeOut();
        }
      });
    
      $("#x").click(function() {
        searchTermField.val("");
        $(this).hide();
      });
    
      $('#submit').click(function(e) {
        e.preventDefault();
        var searchTerm = searchTermField.val(); 
        $('#explanation_text').html("");
    
        d3.json("data/wade.json", function(json) {
          var considerationCaseName = json[0].caseName;
          parseTermJson(considerationCaseName, json, true);
        })
      });
    }
    
    function
    parseTermJson(considerationCaseName, json, shouldReset)
    {
      data = []; 
    
      considerationCase = { caseName: considerationCaseName }; 
    
      // ====> State Container population
      stateContainer.capturedJSON = json;
      if (shouldReset) {
        stateContainer.arrayCaseNames  = [considerationCaseName];
      }
      stateContainer.currentCaseName = considerationCaseName;
      // ====> End State Container population
    
      console.log( stateContainer.arrayCaseNames  );
    
      if (json.length > 0) {
        for (var k = 0; k < json.length; k ++) {
          if (json[k].caseName != stateContainer.currentCaseName) {
      
            if ( $.inArray(json[k].caseName, stateContainer.arrayCaseNames) == -1 && shouldReset) {
              stateContainer.arrayCaseNames.push(json[k].caseName);
            }
    
            continue;
          }
    
          var formattedInformation = {};
          formattedInformation.name = json[k].justiceName;
          formattedInformation.direction = json[k].direction; 
      
          // Definitely will be changed
          var random = Math.floor((Math.random() * 10) + 1);
          formattedInformation.leaning = (random > 5) ? 1 : 2;
          
          data.push(formattedInformation); 
        }
      }
    
      constructAppropriateName(data);
      initializeTriadViz();
    }
    
    function
    triadPathsCalculate(triadPaths, justiceGrouping)
    {
      triadPaths
        .style({
          stroke: function(d,i) { return stabilityColor(d); },
        })
        .transition()
       .duration(300)
        .attr({
          d: function(d,i) { return d.path; } 
        })
     
      triadPaths.enter().append('svg:path')
        .attr({
          fill: 'none',
          class: 'triadPath',
          id: function(d,i) { return 'triadPath-' + i; },
          opacity: 0.1,
          d: function(d,i) { return d.path; } 
        })
        .style({
          stroke: '#AAA',
          "stroke-width": "6",
          "stroke-dasharray": function(d, i) {
            return stabilityColor(d);
          }
        })
        .on('mouseover', function(cd,ci) {
          brightPathText();
          clearPathText();
          triadPaths
            .transition()
            .duration(300)
            .style('opacity', function(d,i) {
              return (i == ci) ? 1.0 : 0.1;
            });
    
          justiceCircles
            .style('opacity', function(d,i) {
              return (cd.sindex != i && cd.tindex != i) ? 0.1 : 1.0;
            })
        
          updatePathText(cd);
        })
        .on('mouseout', function() {
          // Figure out a way to make the chief noticeable
          justiceCircles
            .style('opacity', 1.0)
    
          triadPaths
            .transition()
            .duration(300)
            .style('opacity', 0.1);
        })
    }
  }
}
  
    
$(document).ready(function() {
  window.triadVisualization.initialize();
});
