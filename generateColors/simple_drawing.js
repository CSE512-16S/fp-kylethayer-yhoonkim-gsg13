$(document).on('ready page:load', function () {
  var Nbin, emptyNbin;
  
  
  $.getJSON( "../data/final_color_name_language_data.json", function( data ) {
    Nbin = data.colorSet.length;
    emptyNbin = [];
    for (var i = 0; i < Nbin; i++) {
      emptyNbin.push(0);
    };


    var colorData = data['colorSet'];

         
    var margin = {top: 30, right: 5, bottom: 10, left: 5},
        width = 100 - margin.left - margin.right,
        height = 600 - margin.top - margin.bottom;


    var svg = d3.select('body').append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
      .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")")

    

    svg.selectAll('rect')
      .data(colorData)
      .enter()
        .append('rect')
        .attr('x', 0)
        .attr('y', function(d,i){ return height/Nbin*i; })
        .attr('fill', function(d,i){ return 'rgb('+d.rgb.r+','+d.rgb.g + ',' + d.rgb.b +')'})
        .attr('width', width)
        .attr('height', height/Nbin-3 )
    data_eng = data['English (English)'];
    data_kor = data['Korean (한국어, 조선어)'];
    
    var kor_names = emptyNbin.slice();
    data_kor.colorNameCount.map(function(colorCount,i){
      colorCount.map(function(count,j){
        if (kor_names[j]==0) {
          kor_names[j] = {'count': count, 'term': data_kor.terms[i]}
        };
        if (kor_names[j].count < count) {
          kor_names[j].count = count;
          kor_names[j].term = data_kor.terms[i];
        };
      })
    })
    console.log(kor_names.map(function(name){ return name.term; }));

    var eng_names = emptyNbin.slice();
    data_eng.colorNameCount.map(function(colorCount,i){
      colorCount.map(function(count,j){
        if (eng_names[j]==0) {
          eng_names[j] = {'count': count, 'term': data_eng.terms[i]}
        };
        if (eng_names[j].count < count) {
          eng_names[j].count = count;
          eng_names[j].term = data_eng.terms[i];
        };
      })
    })
    console.log(eng_names.map(function(name){ return name.term; }));


  });

});
