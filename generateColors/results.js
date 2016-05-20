//lets assume we have userResponses like this.
var userResponses = [];
// userResponses.push([1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28]);
userResponses.push([1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28]);
userResponses.push([1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28]);
// userResponses.push([5,14,4,18,9,24,12,26,27,16,25,11,22,6,21,28,13,23,7,3,19,8,10,15,2,1,17,20]);
// userResponses.push([5,14,4,18,9,24,12,26,27,16,25,11,22,6,21,28,13,23,7,3,19,8,10,15,2,1,17,20]);
userResponses.push([5,14,4,18,9,24,12,26,27,16,25,11,22,6,21,28,13,23,7,3,19,8,10,15,2,1,17,20]);
userResponses.push([5,14,4,18,9,24,12,26,27,16,25,11,22,6,21,28,13,23,7,3,19,8,10,15,2,1,17,20]);
// userResponses.push([15,21,4,11,27,16,18,14,3,23,22,20,9,24,26,6,8,13,25,7,1,19,17,2,28,10,5,12]);
// userResponses.push([19,6,21,22,20,2,10,4,8,13,11,18,1,24,9,7,17,5,16,12,15,14,27,28,25,26,23,3]);

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

  var errorBars = colors.append('rect')
                         .attr('x', function(d){ return x(d.index); })
                         .attr('y', function(d){ return height - y(d.error); } )
                         .attr('width', function(d){ return x(d.index+1)-x(d.index);})
                         .attr('height', function(d){ return y(d.error); })
                         .attr('fill', '#fff')
                         .attr('opacity', 0.7);


  var score = 1 - results.reduce(function(prev,curr){ 
    prev += curr.error;
    return prev;
  }, 0) / Math.floor((N-2)*(N-2)/2) / 4;
  $('#score').html(Math.round(score*10000)/100);
  

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