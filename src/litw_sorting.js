var colorSet, colorSet1Trimed;
$(document).on('ready page:load', function () {
  var N = 30;
  var setN = 4;
  colorSets = [];
  
  for (var i = 0; i < setN; i++) {
    colorSets.push(makeColorSet(N, 40.26, 2*Math.PI/setN*i, 2*Math.PI/setN*(i+1), 74.03));
    $('#sortables').append('<div class="sortable"><input type="hidden" id="sequnce'+i+'" name="sequence'+i+'"></div></div>')
  };
  

  $('.sortable').each(function(index){
    var $sortable = $(this);
    var $itemDiv = $('<div class="color-patch"></div>');
    var colorSet = colorSets[index];

    $sortable.append($itemDiv.clone().addClass('static').append($('<div></div>').css('background-color',colorSet.splice(0,1)[0].color.rgb().toString())));

    colorSet1Trimed = shuffle(colorSet.splice(0,colorSet.length-1));
    for (var i = 0; i < colorSet1Trimed.length; i++) {
      $sortable.append($itemDiv.clone().data('index',colorSet1Trimed[i].index).append($('<div></div>').css('background-color',colorSet1Trimed[i].color.rgb().toString())));
    };
    $sortable.append($itemDiv.clone().addClass('static').append($('<div></div>').css('background-color',colorSet.splice(0,1)[0].color.rgb().toString())));
 

    $('.color-patch ').height($('.color-patch ').width());
    $sortable.height($('.color-patch ').width())
    $sortable.sortable({
      tolerance: "pointer",
      revert: false,
      placeholder: "color-patch-placeholder",
      forcePlaceholderSize: false,
      items: '> div:not(.static)',
      start: function(){
          $('.static', this).each(function(){
              var $this = $(this);
              $this.data('pos', $( "div.color-patch", $sortable).index(this));
          });
      },
      change: function(){
          $sortable = $(this);
          $statics = $('.static', this).detach();
          // $statics.each(function(){
          //   $('<div class="color-patch static-helper"></div>').prependTo($sortable);  
          // })
          $('<div class="color-patch static-helper"></div>').prependTo($sortable);
          $sortable.append($('<div class="color-patch static-helper"></div>'));

          $statics.each(function(){
              var $this = $(this);
              var target = $this.data('pos');
              
              $this.insertAfter($('div.color-patch', $sortable).eq(target));
              $('.static-helper').eq(0).remove();
          });
      },
      update: function(){ updateSequence(this); }
    });
    $sortable.disableSelection();
    updateSequence(this);
  });

  


  function makeColorSet(N, r, startAngle, endAngle, L){
    var newLabColors = [];
    for (var i = 0; i < N; i++) {
      var a = r * Math.cos( (endAngle-startAngle) * (i/N) + startAngle);
      var b = r * Math.sin( (endAngle-startAngle) * (i/N) + startAngle);
      var labColor = d3.lab(L,a,b);
      newLabColors.push({"index":i, "color":labColor});
    }  
    return newLabColors;
  }


  function updateSequence(sortable){
    var currentSequence = [];
    $('.color-patch:not(.static)', sortable).each(function(){
      currentSequence.push($(this).data('index'));
    });
    $('input', sortable).val(currentSequence.join(','));
  }

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
