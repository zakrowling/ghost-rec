// Global variables
var totalScreens = 12;
var timer = 60;
var points = 0;
var winnerMsg = 'You survived the night';
var loserMsg = 'You ran out of power';
var staticDuration = 800;
var screenDuration = 7000;
var expandedScreen = false;

var backgroundSound = new Audio("js/heartbeat.mp3"); 
var beep = new Audio("js/beep.mp3");
var audio = new Audio("js/static.mp3");

// Initialise
startGame();
setInterval(function() { playGame(); }, screenDuration);

function startGame() {
  $(".screen").addClass("static");
  $("h2.timer strong").text(timer);
  $(".screen").attr("data-tilt-max", "5");
  $(".screen").attr("data-tilt-axis", "x");
  $(".screen").attr("data-tilt-transition", "true");
  $(".screen").attr("data-tilt-perspective", "250");

  backgroundSound.addEventListener('ended', function() {
      this.currentTime = 0;
      this.play();
  }, false);
  backgroundSound.play();

  setInterval(function() {
    timer--;
    $("h2.timer strong").text(timer);
    if (timer < 1) {
      youWin();
      timer = 1;
    }
  }, 3000);
}

  
function playGame() {
  shuffleScreens();
  drainBattery();
  
  $(".screen span.ghostly").click(function() {
    expandedScreen = true;
    $(".expanded-screen .record").text('Record');
    var screenBackground = $(this).parent('.screen').css('background-image');
    $(".expanded-screen").addClass('active');
    $(".expanded-screen").css('background-image', screenBackground);
  });
  
  var holdRecord = 0;
  $('.expanded-screen a').on('mousedown', function() {
    $(".expanded-screen .record").text('Recording');
      holdRecord = setTimeout(function() {
        $(".expanded-screen").removeClass('active');
        restoreBattery();
        expandedScreen = false;
        shuffleScreens();
      }, 3200);
      setTimeout(function() {
        $(".expanded-screen .record").text('Done');
      },3150);
  }).on('mouseup mouseleave', function() {
      clearTimeout(holdRecord);
      $(".expanded-screen .record").text('Record');
  });
 
  setTimeout(function() {
    $(".screen").removeClass("static");
  }, staticDuration);
}

function shuffleScreens() {
  if (!expandedScreen) {
    $(".screen").addClass("static");
    $(".screen span").removeClass('ghostly');
    audio.play();
    audio.volume = 0.3;

    // Get total screens and shuffle
    var parent = $(".game");
    var divs = parent.children('.screen');
    var random = Math.floor(Math.random()*12);

    // Add ghost to random screen
    $("video").css("opacity", "1");
    $(".screen span").eq(random).addClass('ghostly');
  }

  while (divs.length) {
    parent.append(divs.splice(Math.floor(Math.random() * divs.length), 1)[0]);
  }
}

function drainBattery() {
  var power = true;
  if ($(".battery li.half.empty").length == $(".battery li").length) {
    power = false;
     youLose();
  }
  if (power == true) {
    $(".battery li").prevAll().not('.half').first().addClass('half');
    $(".battery li").prevAll().not('.empty').first().addClass('empty');
  }
}

function restoreBattery() {
  $(".battery li:not(:last)").removeClass('empty half');
  $(".battery li:last").prev().addClass('half');
  $(".game-controls .battery strong").text("Charging...");
  beep.play();
  beep.volume = 0.4;

  setTimeout(function() {
    $(".game-controls .battery strong").text("Battery");
  },2000);
}

function youLose() {
  $('#my_camera, .game, .game-controls').addClass('survived');
  $("h2.timer").text(loserMsg);
  $("h3.battery").hide();
}

function youWin() {
  $('#my_camera, .game, .game-controls').addClass('survived');
  $("h2.timer").text(winnerMsg);
  $("h3.battery").hide();
}