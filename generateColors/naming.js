var colorSet;
var binEndPoints = [];
var Nbin=36;
$(document).on('ready page:load', function () {
  
  $.getJSON( "/data/naming_color_set.json", function( data ) {
    colorSet = data;
    var endPoint = colorSet[colorSet.length-1].cummulative_dist + colorSet[colorSet.length-1].neighbor_dist;
    var binIndex = 1;
    for (var j = 0; j < colorSet.length; j++) {
      if (colorSet[j].cummulative_dist >= endPoint/Nbin*binIndex ) {  
        binEndPoints.push(j);
        binIndex += 1;    
      };
    };
    binEndPoints.push(colorSet.length-1);
    var assignedSet = [];
    for (var i = 0; i < Nbin; i++) {
      if (i < Nbin/3) {
        assignedSet.push(1);
      }
      else if (i < Nbin/3*2) {
        assignedSet.push(2);
      }
      else{
        assignedSet.push(3);
      }
    };

    shuffle(assignedSet);
    binEndPoints.map(function(item, index, array){
      var set = assignedSet[index];
      
      var sampled = Math.floor( Math.random()*(item + 1))
      if (index > 0) {
        sampled = Math.floor( Math.random()*(item - array[index-1]) + array[index-1] +1 );
      };
      
      var $newColorColumn = $('<div class="color-column"></div>');
      var $newColorPatch = $('<div>'+index +" : "+ sampled+'</div>').css('background-color',d3.rgb(colorSet[sampled].rgb.r, colorSet[sampled].rgb.g, colorSet[sampled].rgb.b).toString());
      $newColorColumn.append($newColorPatch);
      $newColorColumn.append($("<input type='text' name='color-naming-"+index+"bin'></input>"));
      $('#naming-colors-set'+set).append($newColorColumn);
    })
    
    


  });
});

function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}