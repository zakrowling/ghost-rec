// Global variables
var totalScreens = 12;
var timer = 20;
var points = 0;
var winnerMsg = 'You survived the night';
var loserMsg = 'You ran out of battery power';
var staticDuration = 800;
var screenDuration = 7000;
var expandedScreen = false;
var backgroundSound = new Audio("js/heartbeat.mp3"); 
var beep = new Audio("js/beep.mp3");
var audio = new Audio("js/static.mp3");

// If no level set then default to first level
var level = getParameterByName("level");
if (!window.location.search) {
  window.location = 'index.html?level=1';
  playMusic();
}

// Initialise
setLevel(level);
shuffleScreens();
setInterval(function() { playGame(); }, screenDuration);

function getParameterByName(name, url) {
  if (!url) url = window.location.href;
  name = name.replace(/[\[\]]/g, '\\$&');
  var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
      results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return '';
  return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

function setLevel(level) {
  var difficulty;
  for (difficulty = 0;  difficulty < level; difficulty++) { 
    $(".battery li:nth-child("+difficulty+")").remove();
    if (difficulty > 3) {
      screenDuration = 7000 / difficulty + 2000;
      timer = difficulty * 10;
    }
  }
  startGame(timer);
}

function playMusic() {
  backgroundSound.addEventListener('ended', function() {
      this.currentTime = 0;
      this.play();
  }, false);
  backgroundSound.play();
}

function startGame(timer) {
  $(".screen").addClass("static");
  $("h2.timer strong").text(timer);
  $("h2.timer em").text("[Shift " + level+ "]");

  playMusic();

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
  $(".game-controls .battery strong").text("Recharging...");
  beep.play();
  beep.volume = 0.4;

  setTimeout(function() {
    $(".game-controls .battery strong").text("Battery");
  },2000);
}

function youLose() {
  var nextLevel = parseInt(getParameterByName("level")) + 1;
  $('.game, .game-controls').addClass('survived');
  $("h2.timer").html(loserMsg + "<br><a href='javascript:location.reload();'>Try Again</a>");
  $("h3.battery").hide();
}

function youWin() {
  var nextLevel = parseInt(getParameterByName("level")) + 1;
  $('.game, .game-controls').addClass('survived');
  $("h2.timer").html(winnerMsg + "<br><a href='index.html?level=" + nextLevel +"'>Next Shift</a>");
  $("h3.battery").hide();
}