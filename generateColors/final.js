$(document).on('ready page:load', function () {
  var Nbin, emptyNbin;
  
  $.getJSON( "/data/final_color_name_language_data.json", function( data ) {
    Nbin = data.colorSet.length;
    emptyNbin = [];
    for (var i = 0; i < Nbin; i++) {
      emptyNbin.push(0);
    };

    var whichProb = 'term'; // ='term'
    //color : plot (c, prob(t | color = c) ) 
    //term  : plot (c, prob(c | term = t) ) -> Integral of each line should be 1.0
    drawLangSpec(data['English (English)'], data['colorSet'], whichProb, 20);
    drawLangSpec(data['Korean (한국어, 조선어)'], data['colorSet'], whichProb, 20);
    

  });

  

  function drawLangSpec(data, colorSet, whichProb, topN, cutN){
    
    var data_terms = data.terms;
    var data_colors = colorSet;
    var data_color_counts = emptyNbin.slice();
    var data_line = data.colorNameCount;


    //Only see top N names
    if (topN) {
      data_terms = data_terms.splice(0,topN);
      data_line = data_line.splice(0,topN);
    };
   
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
    };
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


    var margin = {top: 20, right: 50, bottom: 30, left: 50},
        width = 960 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;

    var x = d3.scale.linear()
        .range([0, width])
        .clamp(true);

    var y = d3.scale.linear()
        .range([height, 0]);

        
    x.domain([0,Nbin]);
    y.domain([0,1]);


    var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom");


    var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left");


    

    var line = d3.svg.line()
        .interpolate("basis")
        .x(function(d,i) { return x(i); })
        .y(function(d,i) { return y(d); });

    var svg = d3.select("body").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
      .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
        .on('mousemove',nearLine);

    var colorPatch = svg.selectAll(".color_patch")
        .data(data_colors)
      .enter().append("rect")
        .attr("class", "color_patch")
        .attr("x", function(d,i) { return (x(i)+x(i-1))/2; })
        .attr("y", 0)
        .attr("width", function(d,i) { return x(1)-x(0); } )
        .attr("height", height )
        .attr("fill", function(d){ return 'rgb(' + d.rgb.r + ',' + d.rgb.g+',' + d.rgb.b + ')' })

    svg.append("g")
          .attr("class", "x axis")
          .attr("transform", "translate(0," + height + ")")
          .call(xAxis);

    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis)
    


    

    
    var term = svg.selectAll(".term")
        .data(data_line)
      .enter().append("g")
        .attr("class", "term");

    term.append("path")
        .attr("class", "line")
        .attr("d", function(d) { return line(d); })
        .style("stroke", '#000')
        // .on('mouseover',function(d,i){
        //   svg.selectAll('path')
        //     .attr('opacity',0.1);
          
        //   svg.selectAll('.term text')
        //     .attr('opacity', function(g,j){ 
        //       return j==i ? 1 : 0;
        //     });
        //   d3.select(this).attr('opacity',1);
        // })
        // .on('mouseout', function(d){ 
        //   svg.selectAll('path')
        //     .attr('opacity',1);

        //   svg.selectAll('.term text')
        //   .attr('opacity', 1);
        // })

    term.append("text")
        .datum(function(d,i) { 
          return { name: data_terms[i], value: d[d.length-1], index: Nbin }; 
        })
        .attr("transform", function(d) { return "translate(" + x(d.index) + "," + y(d.value) + ")"; })
        .attr("x", 3)
        .attr("dy", ".35em")
        .text(function(d) { return d.name; });

    
  
    function nearLine(){
      var m = d3.mouse(this);
      var dist = 0;
      var minD = 99999;
      var selectI = 0;
      for (var i = 0; i < data_line.length; i++) {
        dist = Math.abs(m[1]-y(data_line[i][Math.round(x.invert(m[0]))]));
        if (dist < minD) {
          selectI = i;
          minD = dist;
        };
      };
      console.log( data_terms[selectI] );
      if (minD < 30) {
        svg.selectAll('.term path')
            .attr('opacity', function(g,j){ 
              // console.log(g);
            return j==selectI ? 1 : 0.1;
          });
          
        svg.selectAll('.term text')
          .attr('opacity', function(g,j){ 
            return j==selectI ? 1 : 0;
          });
        

      }
      else{
        svg.selectAll('path')
            .attr('opacity',1);

        svg.selectAll('.term text')
        .attr('opacity', 1);
      }

      
    }

  }



});
