var R = 31;
var labColors = [], labColorsBuffer = [], newLabColors=[];
var L=0;
var width = 800, height=20;
//var N = 120, M =500;
var N = 90, M =500;
//var rStep = .01, rStart = 37;
var rStep = .01, rStart = 37;
var maxRs = [];
for (var j = 0; j < (M-1); j++) {
  //L += 100/M;
  //L = 70 + j * 5 / M;
  L = 70 + j * 5 / M;
  labColorsBuffer = [];

  for (var r_temp = 0; r_temp < 50 /rStep; r_temp++) {
	var r = rStart + r_temp * rStep;
    newLabColors = [];
    for (var i = 0; i < N; i++) {
      var a = r * Math.cos(2 * Math.PI * (i/N));
      var b = r * Math.sin(2 * Math.PI * (i/N));
      var labColor = d3.lab(L,a,b);
      
      if (labColor.rgb().clipped) {
        break;
      };

      
      newLabColors.push({"i": i, "r": r, "j":j, "color": labColor});
    }
    if (newLabColors.length === N) {
      labColorsBuffer = newLabColors;
    };
  };
  maxRs.push({"L":L, "R": labColorsBuffer[0].r});
  labColors = labColors.concat(labColorsBuffer);
}


console.log(maxRs.map(function(item){ return "(L = " + item.L + ", R = " + item.R +")"; }));

var svg = d3.select('body').append('svg')
            .attr('width', width+50+20+40)
            .attr('height', height * M );




var colors = svg.selectAll('.lab-color')
                .data(labColors)
              .enter()
                .append('g')
                .attr('class', 'lab-color');

colors.append('rect')
      .attr('x', function(d,i){ return d.i*width/N; })
      .attr('y', function(d,i){ return d.j*height; })
      .attr('width', width/N)
      .attr('height', function(d,i){ 
        return d.color.rgb().clipped ? height/2 : height;
      })
      .attr('fill', function(d,i){ 
        return d.color.rgb(); 
      })

var radius = svg.selectAll('.radius')
                .data(maxRs)
              .enter()
                .append('g')
                .attr('class', 'radius');


radius.append('text')
      .attr('x', function(d, i){ return width + d.R; })
      .attr('y', function(d, i){ return i * height +height; })
      .text(function(d){ 
		var num = parseFloat(d.R)
		return num.toFixed(2); 
	  });
radius.append('text')
      .attr('x', function(d, i){ return width-20; })
      .attr('y', function(d, i){ return i * height +height; })
      .text(function(d){ 
		var num = parseFloat(d.L)
		return num.toFixed(2); 
	   });

