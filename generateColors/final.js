$(document).on('ready page:load', function () {
  var Nbin, emptyNbin;
  
  
  $.getJSON( "../data/final_color_name_language_data.json", function( data ) {
    Nbin = data.colorSet.length;
    emptyNbin = [];
    for (var i = 0; i < Nbin; i++) {
      emptyNbin.push(0);
    };

    var whichProb = 'color'; // ='term'
    //color : plot (c, prob(t | color = c) ) 
    //term  : plot (c, prob(c | term = t) ) -> Integral of each line should be 1.0
    drawLangSpec('#vis0', data,'English (English)', data['colorSet'], whichProb, 20);
    drawLangSpec('#vis1', data,'Korean (한국어, 조선어)', data['colorSet'], whichProb, 20);
    

  });

  

  function drawLangSpec(targetSelector, data, lang, colorSet, whichProb, topN, cutN){
    
    var data_terms = data[lang].terms;
    var data_colors = colorSet;
    var data_color_counts = emptyNbin.slice();
    var data_line = data[lang].colorNameCount;

    dataProcess();
    drawing();

    function drawing(){
      var spectrumN = data_line[0].length;
      
      var margin = {top: 30, right: 50, bottom: 10, left: 50},
          width = $(targetSelector).width() - margin.left - margin.right,
          height = 250 - margin.top - margin.bottom;

      var x = d3.scale.linear()
          .range([0, width])
          .clamp(true);

      var y = d3.scale.linear()
          .range([height, 0]);

          
      x.domain([0,spectrumN]);
      y.domain([0,1]);

      // var xAxis = d3.svg.axis()
      //     .scale(x)
      //     .orient("bottom");


      var yAxis = d3.svg.axis()
          .scale(y)
          .orient("left");

      var toggle = false;
      
      var term = $(targetSelector).append('<h3 id="'+targetSelector.replace('#','')+'-selected-title" class="text-center">Color Name <small>google translation</small></h3>');
      var line = d3.svg.line()
          .interpolate("basis")
          .x(function(d,i) { return x(i); })
          .y(function(d,i) { return y(d); });

      var svg = d3.select(targetSelector).append("svg")
          .attr("width", width + margin.left + margin.right)
          .attr("height", height + margin.top + margin.bottom)
        .append("g")
          .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
          

      var title = svg.append('text')
            .attr('class','vis-title')
            .attr('x',10)
            .attr('y',-10)
            .text(lang);

      var colorPatch = svg.selectAll(".color_patch")
          .data(data_colors)
        .enter().append("rect")
          .attr("class", "color_patch")
          .attr("x", function(d,i) { return (x(i)+x(i-1))/2; })
          .attr("y", 0)
          .attr("width", function(d,i) { return i===(spectrumN-1) ? (x(1)-x(0)) /2 : x(1)-x(0)+1; } )
          .attr("height", height )
          .attr("fill", function(d){ return 'rgb(' + d.rgb.r + ',' + d.rgb.g+',' + d.rgb.b + ')' })
          .on('click',function(){
            if (toggle) {
              toggle = false;
              dehighlight();
            }
            
          })
      // svg.append("g")
      //       .attr("class", "x axis")
      //       .attr("transform", "translate(0," + height + ")")
      //       .call(xAxis);

      var axisTitle = whichProb === 'color' ? 'Probability of Name, given Color' : 'Probability of Color, given Name' ;
      svg.append("g")
          .attr("class", "y axis")
          .call(yAxis)
         .append('text')
          .text(axisTitle)
          .attr('x',-height/2)
          .attr('y',-30)
          .attr('transform','rotate(-90)')
          .attr('text-anchor','middle')
      


      

      
      var term = svg.selectAll(".term")
          .data(data_line)
        .enter().append("g")
          .attr("class", "term");

      term.append("path")
          .attr("class", "line line1")
          .attr("d", function(d) { return line(d); })
          .style("stroke", '#000')

      term.append("path")
          .attr("class", "line line2")
          .attr("d", function(d) { return line(d); })
          .style("stroke", '#fff')
          .attr('transform', 'translate(0,2)')
          

      term.append("path")
            .attr("class", "fake-line")
            .attr("d", function(d) { return line(d); })
            .style("stroke", '#000')
            .style("stroke-width", '30px')
            .style("fill", 'none')
            .attr('opacity',0)
            .on('mouseover',function(d,i){
              if (!toggle) {
                highlight(d, i);
              }
            })
            .on('mouseout', function(d){ 

              if (!toggle) {
                dehighlight();
              }
            }).
            on('click',function(d,i){
              if (!toggle) {
                toggle = true;
                highlight(d, i, true);
              }
              else{
                toggle = false;
              }
              d3.event.stopPropagation();
            })

      function dehighlight(){
        svg.selectAll('.line')
          .attr('opacity',1);
        $(targetSelector+"-selected-title").html('Color Name <small>google translation</small>'); 
      }
      function highlight(d, i, clicked){
        svg.selectAll('.line1')
          .attr('opacity', function(g,j){ 
            if (j==i) {
              if (lang === 'Korean (한국어, 조선어)') {
                $(targetSelector+"-selected-title").html(data_terms[j]+' <small id="ko-en"></small>'); 
                translate(data_terms[j]+'색','ko','en'); 
              } 
              else{
                $(targetSelector+"-selected-title").html(data_terms[j]+' <small id="en-ko"></small>');  
                translate(data_terms[j],'en','ko'); 
              };
              
            };
            return j==i ? 1 : 0.1;
          })
          .style('stroke-width',function(g,j){
            return j==i && clicked ? '3px' : '1.5px';
          });
        svg.selectAll('.line2')
          .attr('opacity', function(g,j){ 
            return j==i ? 1 : 0.1;
          })
          .style('stroke-width',function(g,j){
            return j==i && clicked ? '3px' : '1.5px';
          });
      }
    
    }
    function translate(q,sLang,tLang){
      $.getJSON('https://www.googleapis.com/language/translate/v2?key=AIzaSyAT-kyweEHlnjMpEazBrS1T-oxPhKPLNXY&source='+sLang+'&target='+tLang+'&q='+q, function(data){
        $('#'+sLang+'-'+tLang).html(data.data.translations[0].translatedText);
      });
    }
    function dataProcess(){

      //Only see top N names
      if (topN) {
        data_terms = data_terms.splice(0,topN);
        data_line = data_line.splice(0,topN);
      }
     
     // Cut if the number of names are lower than ___
      if (cutN) {
        for (var i = 0; i < data_terms.length; i++) {
          var total = data_line[i].reduce(function(prev,count){
            prev += count;
            return prev
          },0);
          if (total < cutN) {
            data_terms.splice(i, 1);
            data_line.splice(i, 1); 
            i--; 
          };
        }
      }



      

      for (var i = 0; i < Nbin; i++) {
        for (var j = 0; j < data_line.length; j++) {
          data_color_counts[i]+= data_line[j][i];
        };
      };

      data_line = data_line.map(function(colorCount, index){ 
        var total = 0;
        for (var i = 0; i < colorCount.length; i++) {
          total += colorCount[i];
        };
        return colorCount.map(function(count,i){
          if (whichProb ==='term') {
            return count/total;
          }
          else if (whichProb ==='color') {
            return count/data_color_counts[i];
          }
          else
            return count/total;
        });
      });

      //Repeating 0.5 times more
      data_line = data_line.map(function(colorCount){
        return colorCount.concat(colorCount.slice().splice(0,Math.round(colorCount.length/2)));
      })
      data_colors = data_colors.concat(data_colors.slice().splice(0,Math.round(data_colors.length/2)));

    }
  }


  //TODO
  //click to toggle
  //

});
