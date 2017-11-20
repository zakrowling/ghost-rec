// Global variables
var totalScreens = 12;
var timer = 99;
var points = 0;
var winnerMsg = 'You survived the night';
var loserMsg = 'You ran out of power';
var staticDuration = 800;
var screenDuration = 7000;
var expandedScreen = false;

// Initialise
startGame();
setInterval(function() { playGame(); }, screenDuration);

function startGame() {
  $(".screen").addClass("static");
  $("h2.timer strong").text(timer);
  $(".screen").attr("data-tilt-max", "10");
  $(".screen").attr("data-tilt-axis", "x");
  $(".screen").attr("data-tilt-transition", "true");
  $(".screen").attr("data-tilt-perspective", "250");
  setInterval(function() {
    timer--;
    $("h2.timer strong").text(timer);
    if (timer < 1) {
      youLose();
      timer = 1;
    }
  }, 1000);
  Webcam.set({ width: 320, height: 240 });
}

  
function playGame() {
  shuffleScreens();
  drainBattery();
  
  $(".screen span.ghostly").click(function() {
    expandedScreen = true;
    var screenBackground = $(this).parent('.screen').css('background-image');
    $(".expanded-screen").addClass('active');
    $(".expanded-screen").css('background-image', screenBackground);
  });
  
  var holdRecord = 0;
  $('.expanded-screen a').on('mousedown', function() {
      holdRecord = setTimeout(function() {
        $(".expanded-screen").removeClass('active');
        restoreBattery();
        expandedScreen = false;
        shuffleScreens();
      }, 3000);
  }).on('mouseup mouseleave', function() {
      clearTimeout(holdRecord);
  });
 
  setTimeout(function() {
    $(".screen").removeClass("static");
    Webcam.attach("#my_camera");
  }, staticDuration);
}

function shuffleScreens() {
  Webcam.reset("#my_camera");
  $(".screen").addClass("static");
  $(".screen span").removeClass('ghostly');
  
  // Get total screens and shuffle
  var parent = $(".game");
  var divs = parent.children('.screen').not('#my_camera');
  var random = Math.floor(Math.random()*12);

  // Add ghost to random screen
  $("video").css("opacity", "1");
  $(".screen span").eq(random).addClass('ghostly');

  while (divs.length) {
    parent.append(divs.splice(Math.floor(Math.random() * divs.length), 1)[0]);
  }
}

function drainBattery() {
  var power = true;
  if ($(".battery li.half.empty").length == $(".battery li").length) {
    power = false;
     youWin();
  }
  if (power == true) {
    $(".battery li").prevAll().not('.half').first().addClass('half');
    $(".battery li").prevAll().not('.empty').first().addClass('empty');
  }
}

function restoreBattery() {
  $(".battery li:not(:last)").removeClass('empty half');
  $(".battery li:last").prev().addClass('half');
}

function youLose() {
  $('#my_camera, .game, .game-controls').addClass('dead');
  $("h2.timer").text(loserMsg);
  $("h3.battery").hide();
}

function youWin() {
  $('#my_camera, .game, .game-controls').addClass('survived');
  $("h2.timer").text(winnerMsg);
  $("h3.battery").hide();
}