const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
ctx.font = '180px Arial';
const body = document.getElementById('body');
const restart = document.getElementById('restart');
const popup = document.getElementById('popup');
const height = (Math.round(Math.sqrt(288 / window.innerWidth * window.innerHeight)));
const width = (Math.round(Math.sqrt(288 / window.innerHeight* window.innerWidth)));
const canvasWidth = canvas.offsetWidth;
const canvasHeight = canvas.offsetHeight;
canvas.setAttribute('height', height * 100);
canvas.setAttribute('width', width * 100);
let gamestopped = false;
let highscore = getCookie("highscore");
let images = {
  left: new Image(),
  right: new Image(),
  up: new Image(),
  down: new Image(),
  pause: new Image(),
  play: new Image(),
  actPlayIcon: "",
  apple: new Image()
}

images.left.src = 'img/head_left.png';
images.right.src = 'img/head_right.png';
images.up.src = 'img/head_up.png';
images.down.src = 'img/head_down.png';
images.pause.src = 'img/pause-black.png';
images.play.src = 'img/play-black.png';
images.actPlayIcon = images.pause;
images.apple.src = "img/apple.png";



let moveTimeout = 0;

let actDir = "down";
let snake = [{
  x: 0,
  y: 1
}];
const apple = {
  x: 0,
  y: 0
}

function addBlock() {
  snake.push({
    x: snake[0].x,
    y: snake[0].y,
  });
  updateHighscore();
}
function updateHighscore() {
  if (snake.length > highscore) {
    highscore = snake.length;
    saveCookie("highscore", snake.length);
  }

  if (true);
}

function move() {

  if (!gamestopped) {
    if (snake[0].x <= 0 && actDir === "left") {
      stopGame();
      return;
    } else if (snake[0].x >= width-1 && actDir === "right") {
      stopGame();
      return;
    } else if (snake[0].y <= 0 && actDir === "up") {
      stopGame();
      return;
    } else if (snake[0].y >= height-1 && actDir === "down") {
      stopGame();
      return;
    }
    for (let i = snake.length; i > 1; i--) {
      snake[i-1].x = snake[i-2].x;
      snake[i-1].y = snake[i-2].y;
    }

    console.log('move');


    if (actDir === "left") {
      snake[0].x -= 1;
    } else if (actDir === "right") {
      snake[0].x += 1;
    } else if (actDir === "up") {
      snake[0].y -= 1;
    } else if (actDir === "down") {
      snake[0].y += 1;
    }

    snake.forEach((e, i)=> {
      if (i !== 0) {
        if (e.x === snake[0].x &&
          e.y === snake[0].y) {
          stopGame();
        }
      }
    });


    if (apple.x === snake[0].x && apple.y === snake[0].y) {
      spawnFood();
      addBlock();
    }


    draw();

    clearTimeout(moveTimeout);
    moveTimeout = setTimeout(function() {
      move();
    }, 150);
  }
}



function stopGame() {
  writeUserHighscore(snake.length);
  gamestopped = true;
  popup.classList.add("show");
  console.log("stopGame");
}


function spawnFood() {
  apple.x = Math.round(Math.random()*(width-1));
  apple.y = Math.round(Math.random()*(height-1));
}

spawnFood();

function draw() {
  ctx.clearRect(-1000, -1000, 5000, 5000);
  ctx.font = '50px Arial';
  ctx.fillStyle = "black";
  ctx.fillText("Highscore: " + highscore, 100, 50);
  ctx.fillText("Score: " + snake.length, 800, 50)
  for (var i = 0; i < snake.length; i++) {
    let box = snake[i];
    ctx.beginPath();
    ctx.fillStyle = '#80FF00';

    ctx.fillRect(box.x*100+5, box.y*100+5, 90, 90);
    ctx.fill();
    if (i === 0) {
      ctx.drawImage(images[actDir], box.x*100 +5, box.y*100+5, 90, 90);
    }
  }

  ctx.beginPath();
  ctx.fillStyle = 'red';
  ctx.drawImage(images.apple,apple.x * 100 + 5, apple.y * 100 + 5, 90, 90);
  ctx.fill();

  ctx.drawImage(images.actPlayIcon, width * 90, width * 1, width * 8, width* 8);

}

move();


// wischer erkennen
let startX, startY, endX, endY, angle;

window.addEventListener('touchstart', function(e) {
  startX = e.touches[0].clientX;
  startY = e.touches[0].clientY;
});

window.addEventListener('touchmove', function(e) {
  e.preventDefault(); // prevent scrolling on touch devices
});

window.addEventListener('touchend', function(e) {
  endX = e.changedTouches[0].clientX;
  endY = e.changedTouches[0].clientY;
  angle = Math.atan2(endY - startY, endX - startX) * 180 / Math.PI; // calculate angle in degrees

  // round the werths
  angle = Math.round(angle);
  startX = Math.round(startX);
  startY = Math.round(startY);
  endX = Math.round(endX);
  endY = Math.round(endY);
  if (Math.round(startX/5) === Math.round(endX/5) && Math.round(startY/5) === Math.round(endY/5)) {
    // console.log('Point:', startX, ':', startY);
  } else {
    // console.log(`Angle: ${angle} degrees, Start Point: (${startX}, ${startY}), End Point: (${endX}, ${endY})`);
  }

  let distanceX = startX - endX;
  let distanceY = startY -endY;
  let distance = Math.sqrt(distanceX**2 + distanceY**2);
  console.log(distance);
  if (distance > 50) {
    if (angle < 45 && angle>-45 && (actDir !== 'left' || snake.length === 1)) {
      actDir = "right";
    } else if (angle<-45 && angle>-135 && (actDir !== 'down' || snake.length === 1)) {
      actDir = 'up';
    } else if ((angle<-135 || angle > 135) && (actDir !== 'right' || snake.length === 1)) {
      actDir = 'left';
    } else if (angle > 45 && angle < 135 && (actDir !== 'up' || snake.length === 1)) {
      actDir = 'down';
    }
    if (gamestopped === false &&  images.actPlayIcon=== images.pause) {
      move();
    }
  }
});

restart.addEventListener('click', e=> {
  actDir = "down";
  snake = [{
    x: 0,
    y: 1
  }];
  popup.classList.remove("show");
  console.log('restart');
  draw();
  gamestopped = false;
  move();
});

function getCookie(cname) {
  let name = cname + "=";

  let decodedCookie = decodeURIComponent(document.cookie);
  let ca = decodedCookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

function saveCookie(value, cname) {
  document.cookie = cname+"="+value+'; expires=Thu, 18 Dec 2050 12:00:00 UTC';
}

if (highscore === "") {
  highscore = snake.length;
}

function pause(makePause) {
  if (makePause) {
    clearTimeout(moveTimeout);
  } else {
    move();
  }
}

canvas.addEventListener('click', e=> {
  if (images.actPlayIcon === images.pause&& e.clientX >= canvasWidth * 0.9 && e.clientY <= canvasWidth*0.1) {
    pause(true);
    images.actPlayIcon = images.play;
    draw();
    setTimeout(draw, 20);
  } else if(true) {
    pause(false);
    images.actPlayIcon = images.pause;
    draw();
    move();
    setTimeout(draw, 200);
  }
  console.log('pause button');
});




// firebase database
import {
  initializeApp
} from "https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js";
import {
  getDatabase,
  ref,
  set,
  onValue,
  child,
  get
} from "https://www.gstatic.com/firebasejs/9.22.0/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyC_cmBPJgBP_QQ-UDvLtsDeahsWdI0AoV4",
  authDomain: "snake3-8f68f.firebaseapp.com",
  databaseURL: "https://snake3-8f68f-default-rtdb.firebaseio.com",
  projectId: "snake3-8f68f",
  storageBucket: "snake3-8f68f.appspot.com",
  messagingSenderId: "439306922160",
  appId: "1:439306922160:web:460fa228e1a617cd38f375",
  measurementId: "G-M7J928N7DK"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase();



function writeUserHighscore(points) {
  let name = prompt("Gib einen Namen ein!");

  set(ref(db, 'highscores/'+name),points);
}

/*
const starCountRef = ref(db, 'posts/' + postId + '/starCount');
onValue(starCountRef, (snapshot) => {
  const data = snapshot.val();
  updateStarCount(postElement, data);
});

const dbRef = ref(getDatabase());
get(child(dbRef, `users/${userId}`)).then((snapshot) => {
  if (snapshot.exists()) {
    console.log(snapshot.val());
  } else {
    console.log("No data available");
  }
}).catch((error) => {
  console.error(error);
});

*/