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
  var bin = binNum(response);
  response['bin'] = bin;
  var responseName = response.name.toLowerCase();
  if (responseName.trim() === '') {
    continue;
  };

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

  colorTerm.colorNameCount[colorTerm.terms.indexOf(responseName)][bin] += 1;

};

Object.keys(data).map(function(key){
  var termTotalCounts = data[key].colorNameCount.map(function(colorCount, index){
    return { 
      'term': data[key].terms[index],
      'total' : colorCount.reduce(function(prev,count){
          prev += count;
          return prev;
        },0),
      'colorCount' : colorCount
    };
  });  
  
  data[key].terms = termTotalCounts
                      .sort(compare)
                      .map(function(termTotalCount){ return termTotalCount.term; });
  
  data[key].colorNameCount = termTotalCounts
                      .sort(compare)
                      .map(function(termTotalCount){ return termTotalCount.colorCount; });

})



data.colorSet = binEndPoints.map(function(index, i, array){ 
  return colorSet[Math.round(i===0 ? index/2 : (index + array[i-1]) / 2)]; 
});




fs.writeFile('data/final_color_name_language_data.json', JSON.stringify(data), 'utf8', function(){
  
  
})

fs.writeFile('data/color_name_language_bint_data.json', JSON.stringify(colorNamingResponses), 'utf8', function(){
  console.log(colorNamingResponses);
})
// console.log(data['Korean (한국어, 조선어)'].terms);
// console.log(data['Korean (한국어, 조선어)'].colorNameCount[100]);

function compare(A,B){
  if (A.total === B.total) {
    if (A.term < B.term) {
      return -1;
    }
    else if (A.term > B.term) {
      return 1;
    }
    return 0;
  }
  else{
    return - A.total + B.total
  }
}

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