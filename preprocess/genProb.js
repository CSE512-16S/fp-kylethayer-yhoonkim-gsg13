var fs = require('fs');

var data = JSON.parse(fs.readFileSync('data/final_color_name_language_data.json', 'utf8'));
var Nbin = data.colorSet.length;
var emptyNbin = [];
for (var i = 0; i < Nbin; i++) {
  emptyNbin.push(0);
};

dataProcess(20, false, 'English (English)', 'color');

function dataProcess(topN, cutN, lang, whichProb){

  var data_terms = data[lang].terms;
  var data_colors = data['colorSet'];
  var data_color_counts = emptyNbin.slice();
  var data_line = data[lang].colorNameCount;
  // console.log(data_colors);

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

  var processed1 = [];
  var processed2 = [];
  var processed3 = [];

  
  for (var i = 0; i < data_line.length; i++) {
    var row1 = { 'lang': lang, 'name': data_terms[i] };
    
    for (var j = 0; j < data_line[i].length; j++) {
      row1['bin'+j] = data_line[i][j];
      

      var row2 = { 'lang': lang, 'name': data_terms[i] };
      row2['bin'] = j;
      row2['prob'] = data_line[i][j];
      row2['rgb_R'] = data_colors[j].rgb.r;
      row2['rgb_G'] = data_colors[j].rgb.g;
      row2['rgb_B'] = data_colors[j].rgb.b;
      row2['lab_L'] = data_colors[j].lab.l;
      row2['lab_A'] = data_colors[j].lab.a;
      row2['lab_B'] = data_colors[j].lab.b;

      processed2.push(row2);
    };
    processed1.push(row1);
  };
  


  console.log(processed2);
  fs.writeFile('data/language_name_binnedColor_v1.json', JSON.stringify(processed1), 'utf8', function(){
  });
  fs.writeFile('data/language_name_binnedColor_v2.json', JSON.stringify(processed2), 'utf8', function(){
  });

  // //Repeating 0.5 times more
  // data_line = data_line.map(function(colorCount){
  //   return colorCount.concat(colorCount.slice().splice(0,Math.round(colorCount.length/2)));
  // })
  // data_colors = data_colors.concat(data_colors.slice().splice(0,Math.round(data_colors.length/2)));

}