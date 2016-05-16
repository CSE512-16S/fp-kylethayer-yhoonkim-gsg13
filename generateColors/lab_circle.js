var R =39;
var labColors = [];
var L=75;
var width = 800, height=80;
var N = 100;

for (var i = 0; i < N; i++) {
  var a = R * Math.cos(2*Math.PI * (i/N));
  var b = R * Math.sin(2*Math.PI * (i/N));
  var labColor = d3.lab(L,a,b);
  labColors.push(labColor);
  if( labColor.rgb().clipped )
    console.log('Warning! out of RGB space');
};




var svg = d3.select('body').append('svg')
            .attr('width', width)
            .attr('height', height);
var colors = svg.selectAll('.lab-color')
                .data(labColors)
              .enter()
                .append('g')
                .attr('class', 'lab-color');

colors.append('rect')
      .attr('x',function(d,i){ return i*width/N; })
      .attr('y', 0)
      .attr('width', width/N)
      .attr('height', function(d,i){ return d.rgb().clipped ? height/2 : height})
      .attr('fill', function(d,i){ return d.rgb(); })

console.log(colors);

