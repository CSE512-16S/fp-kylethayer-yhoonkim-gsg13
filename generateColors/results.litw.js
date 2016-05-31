function results() {
    LE.recordProgression("results");

    LE.showSlide("results");
    var html = 
        '<div id="score-medal">' +
        '  <h2 style="text-align: center;"><?php echo _("Your color vision score is ..."); ?></h2>' +
        '  <div class="achievement">' +
        '    <div class="medal-container">' +
        '        <div class="medal">' +
        '            <div class="ring">' +
        '                <div class="inner">' +
        '                    <strong id="score" class="text score">???</strong>' +
        '                </div>' +
        '            </div>' +
        '        </div>' +
        '        <div class="ribbon">' +
        '            <div class="l"></div>' +
        '            <div class="r"></div>' +
        '        </div>' +
        '    </div>' +
        '    <h1 class="ribbon">' +
        '       <strong class="ribbon-content"><?php echo _("Good job!"); ?></strong>' +
        '    </h1>' +
        '</div>' +
        "<h3 id='score'>" +
        "</h3>" +
        "<p id='score-compare'>" +
        "</p>" +
        "<p>" +
        "  Your score indicates how close your tiles were to where they should go if they are sorted with 100% accuracy" +
        "</p>" +
        "<h2>" +
        "  <?php echo _('Color Perception on the Spectrum'); ?>" +
        "</h2>" +
        "<p>" +
        "  Which colors could you discriminate well or poorly? " +
        "  On the spectrum below you will see a chart showing how well you were at discriminating different colors." +
        "</p>" +
        "<p>" +
        "  Where the line is <strong>higher</strong>, you placed colors closer to their correct position. " +
        "</p>" +
        "<p>" +
        "  Where the line is <strong>lower</strong>, you placed colors further away from their correct position." +
        "</p>" +
        " <div id='spectrum'> </div>" + 
        "<table id='resultsShareTable'><tr><td><p id='resultsShareText'><?php echo _('Share your results!'); ?></p></td><td id='resultsShare' class='sharingButtons'></td></tr></table>" +
        "<div id='resultsFooter'></div>"
    $("#results").html(html);
    
    share.makeButtons(".sharingButtons");
    
    $("#resultsPageCommentsBtn").on("click", function() {
        var comments = $("#resultsPageComments").val();
        $.ajax({
             type: "POST",
             url: "include/resultsPageComments.php",
             data: {
                     participantId: LE.getParticipantId(),
                        comments: comments
                   }
        }).done(function() {
            $("#resultsPageComments").val("<?php echo _('Thanks for the feedback!'); ?>").css("color", "#AAAAAA").prop("disabled", true);
        });
        $(this).prop("disabled", true);
    });

    LE.showFooter(["<?php echo _('How good is your implicit memory?'); ?>",
                     "<?php echo _('What is your thinking style?'); ?>"], "resultsFooter");
    
    LE.hideNextButton();
    
    //var numberOfColorSets = 6;
    //var colorsPerSet = labRing.length
    
    var N = colorsPerSet // 15 (note in the actual set there are 17: two are the fixed start/end)
      var setN = numberOfColorSets // 6
    
    userResponses = expData.sortTileOrders;
    
    
    //various fake datasets
    //var userResponses = [];
    
    /* // perfect data
    userResponses.push([1,2,3,4,5,6,7,8,9,10,11,12,13,14,15]);
    userResponses.push([1,2,3,4,5,6,7,8,9,10,11,12,13,14,15]);
    userResponses.push([1,2,3,4,5,6,7,8,9,10,11,12,13,14,15]);
    userResponses.push([1,2,3,4,5,6,7,8,9,10,11,12,13,14,15]);
    userResponses.push([1,2,3,4,5,6,7,8,9,10,11,12,13,14,15]);
    userResponses.push([1,2,3,4,5,6,7,8,9,10,11,12,13,14,15]);
    */

    // specific mistakes data
    userResponses.push([2,1,3,4,5,6,7,8,9,10,11,12,13,14,15]);
    userResponses.push([1,2,3,4,5,6,7,9,8,10,11,12,13,14,15]);
    userResponses.push([8,2,3,4,5,6,7,1,9,10,11,12,13,14,15]);
    userResponses.push([15,2,3,4,5,6,7,8,9,10,11,12,13,14,1]);
    userResponses.push([1,2,3,4,5,6,7,8,9,10,11,12,13,14,15]);
    userResponses.push([1,2,3,4,5,6,7,8,9,10,11,12,13,14,15]);
    
    
    /* // reversed data
    userResponses.push([15,14,13,12,11,10,9,8,7,6,5,4,3,2,1]);
    userResponses.push([15,14,13,12,11,10,9,8,7,6,5,4,3,2,1]);
    userResponses.push([15,14,13,12,11,10,9,8,7,6,5,4,3,2,1]);
    userResponses.push([15,14,13,12,11,10,9,8,7,6,5,4,3,2,1]);
    userResponses.push([15,14,13,12,11,10,9,8,7,6,5,4,3,2,1]);
    userResponses.push([15,14,13,12,11,10,9,8,7,6,5,4,3,2,1]);
    */
    
        
    /* //Good data
    userResponses.push([1,2,4,3,5,6,7,9,8,10,11,12,13,15,14]);
    userResponses.push([1,2,3,4,5,6,7,8,9,10,11,12,14,13,15]);
    userResponses.push([1,5,3,4,2,6,7,12,9,11,10,8,13,15,14]);
    userResponses.push([1,2,4,3,5,6,7,9,8,10,11,12,13,15,14]);
    userResponses.push([1,2,4,3,5,6,7,9,8,10,11,12,13,15,14]);
    userResponses.push([1,2,3,4,5,6,7,8,9,10,11,12,13,14,15]);
    */
    
    
    
    /*//Random data
    userResponses.push([12, 8, 5, 6, 13, 4, 1, 2, 15, 7, 10, 3, 11, 14, 9]);
    userResponses.push([13, 1, 11, 14, 9, 2, 3, 12, 5, 7, 4, 8, 10, 15, 6]);
    userResponses.push([4, 2, 6, 3, 10, 5, 8, 12, 9, 15, 14, 7, 1, 13, 11]);
    userResponses.push([11, 4, 1, 15, 14, 9, 6, 2, 7, 8, 13, 10, 3, 5, 12]);
    userResponses.push([9, 14, 4, 8, 11, 1, 10, 6, 2, 15, 12, 13, 5, 3, 7]);
    userResponses.push([8, 15, 6, 5, 10, 7, 11, 3, 1, 13, 2, 9, 12, 14, 4]);
    */
    
    
    var colorSets = expData.resultsColorSets;
    
    var results = colorSets.reduce(function(prev, colorSet, setIndex){
        var splicedColorSet = colorSet.slice(1, colorSet.length - 1);
        prev = prev.concat(splicedColorSet.map(function(color, index, array){
          return { 
              "error" : Math.abs(index - userResponses[setIndex][index] + 1),
              "maxError": Math.max(index - 0, N - 1 - index),
              "color" : color,
              "index" : index + setIndex*N
            };     
        }));
        return prev;
    },[]);




  var margin = {"top": 20, "bottom": 20, "left": 0, "right": 40};
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
    .domain([0, 1]);


  var colors = svg.selectAll('.color')
                  .data(results)
                  .enter()
                .append('g')
                  .attr('class','color');

  var colorPatches = colors.append('rect')
                         .attr('x', function(d){ return x(d.index); })
                         .attr('y', 0 )
                         .attr('width', function(d){ return x(d.index+1)-x(d.index) + .5;})
                         .attr('height', height )
                         .attr('fill', function(d){ return d.color.rgb(); });

  var line = d3.svg.line()
      .x(function(d){ return (x(d.index+1)+x(d.index))/2; })
      .y(function(d){ return y(d.error / d.maxError) + 2; })
      .interpolate('basis');
      
  var line2 = d3.svg.line()
      .x(function(d){ return (x(d.index+1)+x(d.index))/2; })
      .y(function(d){ return y(d.error / d.maxError)+ 3.5; })
      .interpolate('basis');

  svg.append('path')
        .attr("d", line(results))
        .attr("stroke", "black")
        .attr("stroke-width", 2)
        .attr("fill", "none");
        
  svg.append('path')
        .attr("d", line2(results))
        .attr("stroke", "white")
        .attr("stroke-width", 2)
        .attr("fill", "none");
        
        
  svg.append('text')
          .attr("x", width - 130)
          .attr("y", 15 - margin.top)
          .text("Tile in correct position")
          
   svg.append('text')
          .attr("x", width - 170)
          .attr("y", height + 15)
          .text("Tile far from correct position")

  var N = colorsPerSet // 15
  var setN = numberOfColorSets // 6
  
  // to compute max error for scores, reverse the list and see how bad it is (this should be close enough to correct)
  var maxError = 0;
  for(var i = 0; i < N; i++){
      var currentPointError = Math.abs(i - (N - 1 - i));
      maxError += Math.pow(currentPointError, 2);
  }
  maxError *= setN; // there are 6 sets
  
  var score = 1 - results.reduce(function(prev,curr){ 
    prev += Math.pow(curr.error, 2);
    return prev;
  }, 0) / maxError;
  
  var roundedScore = Math.round(score*10000)/100;
  
  $('#score').html(roundedScore);
  
  var roundedAvgScore = Math.round(window.average_score*10000)/100;
  
  if(window.average_score + .01 <  score){
      $('#score-compare').html('Your score of '+roundedScore+' out of 100 was higher than the average score of '+roundedAvgScore+'.');
  } else if(window.average_score - .01 >  score){
      $('#score-compare').html('Your score of '+roundedScore+' out of 100 was lower than the average score of '+roundedAvgScore+'.');
  } else {
      $('#score-compare').html('Your score of '+roundedScore+' out of 100 was about the same as the average score of '+roundedAvgScore+'.');
  }
  
  //submit score to DB
  var result = {
    participantId: LE.getParticipantId(),
    score: score
  };
    
  LE.recordResult(result);
  $.ajax({
      type: "POST",
     url: "include/score_data.php",
       data: result
  }).done(function(result) {
      //console.log(result);
  });
     
}