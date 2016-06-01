var fs = require('fs');



var colorSet = JSON.parse(fs.readFileSync('data/naming_color_set_new.json', 'utf8'));
var colorNamingResponses = JSON.parse(fs.readFileSync('data/color_names_in_different_languages.json', 'utf8'));

//find binning points
var binEndPoints = [];
var Nbin=36;

var endPoint = colorSet[colorSet.length-1].cummulative_dist + colorSet[colorSet.length-1].neighbor_dist;
var binIndex = 1;
for (var j = 0; j < colorSet.length; j++) {
  if (colorSet[j].cummulative_dist >= endPoint/Nbin*binIndex ) {  
    binEndPoints.push(j);
    binIndex += 1;    
  };
};
binEndPoints.push(colorSet.length-1);



//
var data = {};
var empty36 = [];
for (var i = 0; i < Nbin; i++) {
  empty36.push(0);
};
// for (var i = 0; i < 2; i++) {
for (var i = 0; i < colorNamingResponses.length; i++) {
  var response = colorNamingResponses[i];
  var responseName = response.name.toLowerCase();
  if(!data[response.lang0]){
    data[response.lang0] = {
      'colorNameCount': [],
      'terms': [],
      'totalCount' : 0
    }
  }

  var colorTerm = data[response.lang0];
  colorTerm.totalCount += 1;
  if(colorTerm.terms.indexOf(responseName) < 0){
    colorTerm.terms.push(responseName);
    colorTerm.colorNameCount.push(empty36.slice());
  }
  // console.log(colorTerm.terms.indexOf(responseName));
  // console.log(binNum(response));
  colorTerm.colorNameCount[colorTerm.terms.indexOf(responseName)][binNum(response)] += 1;

};
data.colorSet = binEndPoints.map(function(index){ return colorSet[index]; });

fs.writeFile('data/final_color_name_language_data.json', JSON.stringify(data), 'utf8', function(){
  Object.keys(data).map(function(key){
    if (key !== 'colorSet') {
      console.log(key + "," + data[key].totalCount);  
    };
    
  })
  
})


// console.log(data['Korean (한국어, 조선어)'].terms.indexOf('blue'));



function binNum(response){
  for (var i = 0; i < colorSet.length; i++) {
    if(equal(colorSet[i].rgb, response)){
      for (var j = 0; j < binEndPoints.length; j++) {
        if (i <= binEndPoints[j]) {
          return j;
        }
      }
    }
  }
  console.log(response);
}
function equal(colorA, colorB){
  // console.log(colorA);
  return colorA.r === colorB.r && colorA.g === colorB.g && colorA.b === colorB.b;
}