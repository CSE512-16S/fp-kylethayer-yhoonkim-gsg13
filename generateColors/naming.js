var colorSet;
var binEndPoints = [];
var Nbin=36;
var lang = 'korean';

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
      $newColorColumn.append($("<span class='help-block'>&nbsp;</span>"));
      $('#naming-colors-set'+set).append($newColorColumn);
    })
    
    
    $('input').on('keyup',function(){
      var text = $(this).val();
      var korean = new RegExp("[\u1100-\u11FF|\u3130-\u318F|\uA960-\uA97F|\uAC00-\uD7AF|\uD7B0-\uD7FF]"); 
      var chinese = new RegExp("[\u4E00-\u9FFF|\u2FF0-\u2FFF|\u31C0-\u31EF|\u3200-\u9FBF|\uF900-\uFAFF]"); 
      var langDetector = { "korean": korean, "chinese": chinese };
      
      if(langDetector[lang])
      {
        if (!langDetector[lang].test(text) && text !== "") {
          $(this).css('border-color',"#AA0000");
          $(this).siblings('.help-block').html('Please write in '+lang+'.');
        }
        else{
          $(this).css('border-color',"initial");
          $(this).siblings('.help-block').html('&nbsp;'); 
        }
        
      }

    });

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
