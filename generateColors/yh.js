c3.load("../data/xkcd/c3_data.json");
var munsel40 = [];
// for (var i = 0; i < 60; i++) {
//   munsel40.push(d3.lab(d3.hsl(i*6, 1, 0.5)));
// };

var munsel40 = [
{"L":61.7, "a":24.95,  "b":5.75},
{"L":61.7, "a":24.63,  "b":9.29},
{"L":61.7, "a":24.16,  "b":12.84},
{"L":61.7, "a":23.06,  "b":16.53},
{"L":61.7, "a":21.44,  "b":21.59},
{"L":61.7, "a":19.39,  "b":26.13},
{"L":61.7, "a":15.96,  "b":30.87},
{"L":61.7, "a":12.47,  "b":34.39},
{"L":61.7, "a":7.93,   "b":38.4},
{"L":61.7, "a":2.9,  "b":41.55},
{"L":61.7, "a":-2.19,  "b":43.74},
{"L":61.7, "a":-6.74,  "b":44.68},
{"L":61.7, "a":-10.73,   "b":44.12},
{"L":61.7, "a":-15.61,   "b":41.62},
{"L":61.7, "a":-19.9,  "b":37.81},
{"L":61.7, "a":-25.21,   "b":30.87},
{"L":61.7, "a":-28.75,   "b":24.44},
{"L":61.7, "a":-31.43,   "b":16.67},
{"L":61.7, "a":-32.21,   "b":11.15},
{"L":61.7, "a":-32.09,   "b":7.34},
{"L":61.7, "a":-31.64,   "b":3.89},
{"L":61.7, "a":-31.03,   "b":0.56},
{"L":61.7, "a":-29.74,   "b":-4.22},
{"L":61.7, "a":-27.88,   "b":-8.23},
{"L":61.7, "a":-25.35,   "b":-12.41},
{"L":61.7, "a":-22.31,   "b":-15.8},
{"L":61.7, "a":-17.89,   "b":-18.81},
{"L":61.7, "a":-13.29,   "b":-20.84},
{"L":61.7, "a":-8.82,  "b":-22.07},
{"L":61.7, "a":-3.72,  "b":-22.93},
{"L":61.7, "a":1.08,   "b":-23.47},
{"L":61.7, "a":6.86,   "b":-23.19},
{"L":61.7, "a":11.12,  "b":-22.01},
{"L":61.7, "a":14.58,  "b":-20.35},
{"L":61.7, "a":17.35,  "b":-18.04},
{"L":61.7, "a":20.31,  "b":-14.32},
{"L":61.7, "a":22.08,  "b":-10.87},
{"L":61.7, "a":23.41,  "b":-6.79},
{"L":61.7, "a":24.5,   "b":-1.83},
{"L":61.7, "a":24.98,  "b":1.97}];


function  findC3Color(d3_lab){
  return c3.color.map(function(c){ return [c.L,c.a,c.b].join(','); }).indexOf([d3_lab.L,d3_lab.a,d3_lab.b].join(','));
}

var munsel40_index = munsel40.map(function(c){
  var mappedC = {};
  mappedC.L = Math.round(c.L/5)*5;
  mappedC.a = Math.round(c.a/5)*5;
  mappedC.b = Math.round(c.b/5)*5;
  return findC3Color( mappedC );
});


var munsel40_related_terms = new Set(munsel40_index.reduce(function(prev,i){
  prev = prev.concat(c3.color.relatedTerms(i).map(function(obj){ return obj.index; }));
  return prev;
},[]))
munsel40_related_terms = Array.from(munsel40_related_terms);

var probCgivenT = munsel40_related_terms.map(function(term){
  return munsel40_index.map(function(color){
    return c3.color.prob(color, term);  
  });
});




var data = [];
for (var i = 0; i < probCgivenT[0].length; i++) {
  var row = {};
  row["munsel_color_index"] = i;
  for (var j = 0; j < munsel40_related_terms.length; j++) {
    row[c3.terms[munsel40_related_terms[j]]] = probCgivenT[j][i];  
  };
  data.push(row);
};


var munsel40_c3_colors = munsel40_index.map(function(i){ return c3.color[i]});
var munsel40_c3_terms = munsel40_related_terms.map(function(i){ return c3.terms[i]});
// var data = probCgivenT.map(function(term){
//   return {munsel_color_index: i, munsel_prob: prob};
// })


var margin = {top: 20, right: 50, bottom: 30, left: 50},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;


var x = d3.scale.linear()
    .range([0, width]);

var y = d3.scale.linear()
    .range([height, 0]);

var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom");

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left");


var color = d3.scale.category10();

var line = d3.svg.line()
    .interpolate("basis")
    .x(function(d) { return x(d.munsel_color_index); })
    .y(function(d) { return y(d.munsel_prob); });

var svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

color.domain(d3.keys(data[0]).filter(function(key) { return key !== "munsel_color_index"; }));

var munsel_colors = color.domain().map(function(name) {
    return {
      name: name,
      values: data.map(function(d) {
        return {munsel_color_index: d.munsel_color_index, munsel_prob: +d[name]};
      })
    };
  });

x.domain(d3.extent(data, function(d) { return d.munsel_color_index; }));

y.domain([
  d3.min(munsel_colors, function(c) { return d3.min(c.values, function(v) { return v.munsel_prob; }); }),
  d3.max(munsel_colors, function(c) { return d3.max(c.values, function(v) { return v.munsel_prob; }); })
]);

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
    .text("munsel_prob");

var munsel_color = svg.selectAll(".munsel_color")
    .data(munsel_colors)
  .enter().append("g")
    .attr("class", "munsel_color");

munsel_color.append("path")
    .attr("class", "line")
    .attr("d", function(d) { return line(d.values); })
    .style("stroke", function(d) { return color(d.name); })
    .on('mouseover',function(d,i){
      svg.selectAll('path')
        .attr('opacity',0.1);
      console.log(i);
      svg.selectAll('.munsel_color text')
        .attr('opacity', function(g,j){ 
          return j==i ? 1 : 0;
        });
      d3.select(this).attr('opacity',1);
    });

munsel_color.append("text")
    .datum(function(d) { return {name: d.name, value: d.values[d.values.length - 1]}; })
    .attr("transform", function(d) { return "translate(" + x(d.value.munsel_color_index) + "," + y(d.value.munsel_prob) + ")"; })
    .attr("x", 3)
    .attr("dy", ".35em")
    .text(function(d) { return d.name; });

var munsel_color_patch = svg.selectAll(".munsel_color_patch")
    .data(munsel40_c3_colors)
  .enter().append("rect")
    .attr("class", "munsel_color_patch")
    .attr("x", function(d,i) { return x(i); })
    .attr("y", 10)
    .attr("width", function(d,i) { return x(i+1)-x(i); } )
    .attr("height", 10 )
    .attr("fill", function(d){ return 'rgb(' + d.rgb().r + ',' + d.rgb().g+',' + d.rgb().b + ')' })

   

