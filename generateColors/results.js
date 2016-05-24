//lets assume we have userResponses like this.
var userResponses = [];
// userResponses.push([1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28]);
// userResponses.push([1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28]);
// userResponses.push([1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28]);
// userResponses.push([1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28]);
// userResponses.push([1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28]);
// userResponses.push([5,14,4,18,9,24,12,26,27,16,25,11,22,6,21,28,13,23,7,3,19,8,10,15,2,1,17,20]);
// userResponses.push([5,14,4,18,9,24,12,26,27,16,25,11,22,6,21,28,13,23,7,3,19,8,10,15,2,1,17,20]);
// userResponses.push([5,14,4,18,9,24,12,26,27,16,25,11,22,6,21,28,13,23,7,3,19,8,10,15,2,1,17,20]);
// userResponses.push([5,14,4,18,9,24,12,26,27,16,25,11,22,6,21,28,13,23,7,3,19,8,10,15,2,1,17,20]);
// userResponses.push([15,21,4,11,27,16,18,14,3,23,22,20,9,24,26,6,8,13,25,7,1,19,17,2,28,10,5,12]);
userResponses.push([28,6,21,22,20,2,10,4,8,13,11,18,1,24,9,7,17,5,16,12,15,14,27,19,25,26,23,3]);
userResponses.push([19,6,21,22,20,2,10,4,8,13,11,18,1,24,9,7,17,5,16,12,15,14,27,28,25,26,23,3]);
userResponses.push([19,6,21,22,20,2,10,4,8,13,11,18,1,24,9,7,17,5,16,12,15,14,27,28,25,26,23,3]);
userResponses.push([19,6,21,22,20,2,10,4,8,13,11,18,1,24,9,7,17,5,16,12,15,14,27,28,25,26,23,3]);



//lets assume the all users' score is like this.
userScores = d3.range(1000)
               .map(d3.random.bates(10))
               .map(function(item){ return item*100;});


$(document).on('ready page:load', function () {
  var N = 30;
  var setN = 4;
  colorSets = [];
  
  for (var i = 0; i < setN; i++) {
    colorSets.push(makeColorSet(N, 40.26, 2*Math.PI/setN*i, 2*Math.PI/setN*(i+1), 74.03));
  };

  
  var results = colorSets.reduce(function(prev, colorSet, setIndex){    
    
    prev = prev.concat(colorSet.map(function(color, index, array){
      return { 
          "error" : (index === 0 || index === array.length-1) ? 0 : Math.abs(color.index - userResponses[setIndex][index-1]),
          "color" : color.color,
          "index" : index + setIndex*N
        };     
    }));
    return prev;
  },[]);

  
  var score = 1 - results.reduce(function(prev,curr){ 
    prev += curr.error;
    return prev;
  }, 0) / Math.floor((N-2)*(N-2)/2) / 4;
  score = Math.round(score*1000)/10;
  $('.score').html(score);

  drawSpectrum();
  drawHistogram(score);
  drawingWrongAnswers();

  function drawingWrongAnswers(){
    var maxError = N-3;
    var size = d3.scale.linear()
      .rangeRound([20, 50])
      .domain([0, maxError]);

    for (var i = 0; i < results.length; i++) {
      if( results[i].error !== 0 ){
        var patch = $('<div style="width: ' + size(results[i].error) + 'px; height: '+ size(results[i].error) +'px;" class="wrong-color-patch"></div>')
          .append('<div style="width:100%; height:100%; background-color:'+results[i].color.rgb()+';"></div>');
        $('#wrong-colors').append(patch);
      }
    };
    
  }

  
  function drawHistogram(score){
    // A formatter for counts.
    var formatCount = d3.format(",.0f");

    var margin = {top: 10, right: 30, bottom: 30, left: 30},
        width = 500 - margin.left - margin.right,
        height = 150 - margin.top - margin.bottom;

    var x = d3.scale.linear()
        .domain([0, 100])
        .range([0, width]);

    // Generate a histogram using twenty uniformly-spaced bins.
    var data = d3.layout.histogram()
        .bins(x.ticks(20))
        (userScores);

    var y = d3.scale.linear()
        .domain([0, d3.max(data, function(d) { return d.y; })])
        .range([height, 0]);

    var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom");

    var svg = d3.select("#ranking").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
      .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var line = d3.svg.line()
        .x(function(d){ return x(d.x+d.dx/2); })
        .y(function(d){ return y(d.y); })
        .interpolate('basis');

    svg.append('path')
          .attr("d", line(data))
          .attr("stroke", "black")
          .attr("stroke-width", 2)
          .attr("fill", "none");

    svg.append('line')
        .attr("x1", x(score))
        .attr("x2", x(score))
        .attr("y1", 0)
        .attr("y1", height)
        .attr("stroke","red")
        .attr("stroke-width", 2)
        .attr("fill", "none");
    svg.append('text')
       .attr("x", x(score) + 10)
       .attr("y", 20)
       .attr("text-anchor", "start")
       .attr("fill","red")
       .text("You")
    
    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);
  }
  function drawSpectrum(){
      
    var margin = {"top": 30, "bottom": 20, "left": 15, "right": 15};
    var width = 760, height= 100;
    var svg = d3.select("#spectrum").append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
    .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var x = d3.scale.linear()
      .rangeRound([0, width])
      .domain([0,N*setN-1]);
      

    var y = d3.scale.linear()
      .rangeRound([0, height])
      .domain([0, N]);


    var colors = svg.selectAll('.color')
                    .data(results)
                    .enter()
                  .append('g')
                    .attr('class','color');

    var colorPatches = colors.append('rect')
                           .attr('x', function(d){ return x(d.index); })
                           .attr('y', 0 )
                           .attr('width', function(d){ return x(d.index+1)-x(d.index);})
                           .attr('height', height )
                           .attr('fill', function(d){ return d.color.rgb(); });

    // var errorBars = colors.append('rect')
    //                        .attr('x', function(d){ return x(d.index); })
    //                        .attr('y', function(d){ return height - y(d.error); } )
    //                        .attr('width', function(d){ return x(d.index+1)-x(d.index);})
    //                        .attr('height', function(d){ return y(d.error); })
    //                        .attr('fill', '#fff')
    //                        .attr('opacity', 0.7);

    var line = d3.svg.line()
        .x(function(d){ return (x(d.index+1)+x(d.index))/2; })
        .y(function(d){ return height - y(d.error); })
        .interpolate('basis');

    svg.append('path')
          .attr("d", line(results))
          .attr("stroke", "white")
          .attr("stroke-width", 2)
          .attr("fill", "none");
  }

  function makeColorSet(N, r, startAngle, endAngle, L){
    var newLabColors = [];
    for (var i = 0; i < N; i++) {
      var a = r * Math.cos( (endAngle-startAngle) * (i/N) + startAngle);
      var b = r * Math.sin( (endAngle-startAngle) * (i/N) + startAngle);
      var labColor = d3.lab(L,a,b);
      newLabColors.push({"index":i, "color":labColor});
    }  
    return newLabColors;
  }

});
