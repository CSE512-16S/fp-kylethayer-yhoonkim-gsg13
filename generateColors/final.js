$(document).on('ready page:load', function () {
  var Nbin, emptyNbin;
  
  $.getJSON( "/data/final_color_name_language_data.json", function( data ) {
    Nbin = data.colorSet.length;
    emptyNbin = [];
    for (var i = 0; i < Nbin; i++) {
      emptyNbin.push(0);
    };

    drawLangSpec(data['English (English)'], data['colorSet']);
    drawLangSpec(data['Korean (한국어, 조선어)'], data['colorSet']);
    drawLangSpec(data['Polish (język polski, polszczyzna)'], data['colorSet']);
    // drawLangSpec(data['Korean (한국어, 조선어)'], data['colorSet']);
    // drawLangSpec(data['Korean (한국어, 조선어)'], data['colorSet']);
  });

  

  function drawLangSpec(data, colorSet){

    var data_terms = data.terms;
    var data_colors = colorSet;
    var data_color_counts = emptyNbin.slice();
    for (var i = 0; i < Nbin; i++) {
      for (var j = 0; j < data.colorNameCount.length; j++) {
        data_color_counts[i]+= data.colorNameCount[j][i];
      };
    };

    var data_line = data.colorNameCount.map(function(colorCount){ 
      var total = 0;
      for (var i = 0; i < colorCount.length; i++) {
        total += colorCount[i];
      };
      return colorCount.map(function(count,i){
          return count/data_color_counts[i];
          // return count/total;
        });
    });


    var margin = {top: 20, right: 50, bottom: 30, left: 50},
        width = 960 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;

    var x = d3.scale.linear()
        .range([0, width]);

    var y = d3.scale.linear()
        .range([height, 0]);

        
    x.domain([0,35]);
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
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


    svg.append("g")
          .attr("class", "x axis")
          .attr("transform", "translate(0," + height + ")")
          .call(xAxis);

    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis)
      .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text("");

    console.log(data_line);
    var term = svg.selectAll(".term")
        .data(data_line)
      .enter().append("g")
        .attr("class", "term");

    term.append("path")
        .attr("class", "line")
        .attr("d", function(d) { return line(d); })
        .style("stroke", '#aaa')
        .on('mouseover',function(d,i){
          svg.selectAll('path')
            .attr('opacity',0.1);
          
          svg.selectAll('.term text')
            .attr('opacity', function(g,j){ 
              return j==i ? 1 : 0;
            });
          d3.select(this).attr('opacity',1);
        })
        .on('mouseout', function(d){ 
          svg.selectAll('path')
            .attr('opacity',1);

          svg.selectAll('.term text')
          .attr('opacity', 1);
        })

    term.append("text")
        .datum(function(d,i) { 
          return { name: data_terms[i], value: d[d.length-1], index: 35 }; 
        })
        .attr("transform", function(d) { return "translate(" + x(d.index) + "," + y(d.value) + ")"; })
        .attr("x", 3)
        .attr("dy", ".35em")
        .text(function(d) { return d.name; });

    var colorPatch = svg.selectAll(".color_patch")
        .data(data_colors)
      .enter().append("rect")
        .attr("class", "color_patch")
        .attr("x", function(d,i) { return x(i); })
        .attr("y", 10)
        .attr("width", function(d,i) { return x(i+1)-x(i); } )
        .attr("height", 10 )
        .attr("fill", function(d){ return 'rgb(' + d.rgb.r + ',' + d.rgb.g+',' + d.rgb.b + ')' })

       
  }
});
