
class Combo {
  constructor() {
    this.combo = 0;
    this.counter = document.getElementById('combo');
    this.maxCombo = 0;
  }

  render() {
    if (this.combo) {
      this.counter.innerHTML = `${this.combo} combo`;
    } else {
      if (!this.counter.innerHTML) {
        return;
      }
      this.counter.innerHTML = 'miss';
    }
  }

  show() {
    this.counter.classList.remove('bounceOutRight');
    this.counter.classList.add('bounceInRight');
  }

  hide() {
    this.counter.classList.remove('bounceInRight');
    this.counter.classList.add('bounceOutRight');
  }

  up() {
    this.combo ++;
    this.show();
    if (this.combo > this.maxCombo) {
      this.maxCombo = this.combo;
    }
  }

  reset() {
    this.combo = 0;
    this.hide();
  }
}

class Drum {
  constructor() {
    this.stage = document.getElementById('canvas').getContext('2d');
    this.x = 234;
    this.y = 204;
    this.colorRim = 'white';
    this.colorCenter = 'lightgrey';
  }

  render() {
    this.drawCircle(31, this.colorRim);
    this.drawCircle(20, this.colorCenter);
  }

  tap(note) {
    if (note.id === 'kat') {
      this.colorRim = 'skyblue';
    } else {
      this.colorCenter = 'orangered';
    }

    setTimeout(() => {
      this.colorRim = 'white';
      this.colorCenter = 'lightgrey';
    }, 100);
  }

  drawCircle(radius, color) {
    let stage = this.stage;
    stage.beginPath();
    stage.arc(this.x, this.y, radius, 0, 2 * Math.PI);
    stage.fillStyle = color;
    stage.fill();
  }

  flash() {
    // let stage = this.stage;
    // stage.beginPath();
    // stage.fillStyle = '#ffe92b';
    // stage.fillRect(150, 150, 80, 160);
  }
}

class DrumKey {
  constructor(drum, key) {
    this.drum = drum;
    this.key = key;
  }

  register(note) {
    this.type = note.id;
  }
}

class Note {
  constructor(vel) {
    this.x = 800;
    this.y = 173;
    this.vel = vel;
    this.id = Date.now();

    let color = Math.floor(Math.random() * 2) ? 'pink' : 'blue';
    this.type = color === 'pink' ? 'don' : 'kat';
    this.image = new Image();
    this.image.src = `./gifs/${color}_chestnut_note_500.png`;

    this.stage = document.getElementById('canvas').getContext('2d');
  }

  move() {
    this.x -= this.vel;
  }

  render() {
    this.stage.drawImage(this.image, this.x, this.y);
  }
}

class Score {
  constructor() {
    this.counter = document.getElementById('score-counter');
    this.score = 0;
  }

  render() {
    this.counter.innerHTML = this.score;
  }

  up(spirit) {
    let multiplier = spirit / 100;
    let score = Math.floor(100 * multiplier + 100);
    this.score += score;
  }
}

class SpiritGauge {
  constructor() {
    this.x = 340;
    this.y = 67;
    this.stage = document.getElementById('canvas').getContext('2d');
    this.spirit = 0;
    this.maxSpirit = 1000;
    this.maxWidth = 400;
  }

  render() {
    let stage = this.stage;
    stage.beginPath();
    stage.rect(this.x, this.y, this.maxWidth, 40);
    stage.fillStyle = 'white';
    stage.fillRect(this.x, this.y, this.maxWidth, 40);
    stage.lineWidth = 3;
    stage.strokeStyle = 'black';
    stage.stroke();

    this.bar();
    this.lit();
  }

  up(combo) {
    if (this.spirit < this.maxSpirit) {
      let spirit = 1 + combo;
      this.spirit += spirit;
    }
  }

  down() {
    if (this.spirit > 0) {
      this.spirit --;
    }
  }

  bar() {
    let width = this.spirit / this.maxSpirit * this.maxWidth;
    if (width >= this.maxWidth) {
      width = this.maxWidth;
      this.full = true;
    } else {
      this.full = false;
    }
    this.stage.fillStyle = '#ffe92b';
    this.stage.fillRect(this.x + 3, this.y + 3, width, 34);
  }

  lit() {
    let fire = document.getElementById('fire');
    if (this.full) {
      fire.classList.remove('hide');
    } else {
      fire.classList.add('hide');
    }
  }
}

class ToggleMusic {
  constructor(music) {
    this.music = music;
    this.volumeOn = document.getElementById('volume-on');
    this.volumeOff = document.getElementById('volume-off');
    this.musicMute = document.querySelector('.music-mute');
    this.init();
  }

  init() {
    this.musicMute.addEventListener('click', e => this.render());
    document.addEventListener('keypress', e => {
      if (e.code === 'KeyM') {
        this.render();
      }
    });
  }

  render() {
    this.music.muted = this.music.muted ? false : true;
    this.volumeOn.classList.toggle('hide', this.music.muted);
    this.volumeOff.classList.toggle('hide', !this.music.muted);
  }
}

class TogglePlay {
  constructor() {
    this.gameOn = false;
    this.play = document.getElementById('play');
    this.pause = document.getElementById('pause');
  }

  render() {
    this.gameOn = this.gameOn ? false : true;
    this.play.classList.toggle('hide', this.gameOn);
    this.pause.classList.toggle('hide', !this.gameOn);
  }
}

const buttonPositions = {
  bluearea1: {
    x: 0,
    y: 260,
    width: 250,
    height: 200
  },
  bluearea2: {
    x: 500,
    y: 260,
    width: 250,
    height: 200
  },
  pinkarea: {
    x: 260,
    y: 260,
    width: 300,
    height: 150
  }
};

function isInside(pos, rect, desc){
  return pos.x > rect.x && pos.x < rect.x+rect.width && pos.y < rect.y+rect.height && pos.y > rect.y
}

// Get the mouse position
function getMousePos(canvas, e) {
    var rect = canvas.getBoundingClientRect();
    return {
        x: Math.round((e.clientX - rect.left)/(rect.right - rect.left)*canvas.width),
        y: Math.round((e.clientY - rect.top)/(rect.bottom - rect.top)*canvas.height)
    };
}



document.addEventListener('DOMContentLoaded', () => {
  const bumblebee = document.createElement('audio');
  const lacompanella = document.createElement('audio');
  let baseUrl = 'https://res.cloudinary.com/doahuang/video/upload/';
  bumblebee.src = baseUrl + 'v1529382816/bumblebee.ogg';
  lacompanella.src = baseUrl + 'v1529384916/lacampanella.ogg';
  bumblebee.bpm = 200;
  lacompanella.bpm = 170;

  const don = new Audio();
  const kat = new Audio();
  don.id = 'don';
  kat.id = 'kat';
  don.src = './sounds/don.mp3';
  kat.src = './sounds/kat.mp3';

  let songLib = [bumblebee, lacompanella];
  let songId = Math.floor(Math.random() * songLib.length);
  let music = songLib[songId];
  music.volume = 0.5;

  const toggleMusic = new ToggleMusic(music);
  const togglePlay = new TogglePlay();
  const canvas = document.getElementById('canvas');
  const stage = canvas.getContext('2d');
  const score = new Score();
  const spiritGauge = new SpiritGauge();
  const combo = new Combo();
  const drum = new Drum();

  // function NotesArea() {
  //   stage.beginPath();
  //   stage.lineWidth = 5;
  //   stage.moveTo(0, 150);
  //   stage.lineTo(800, 150);
  //   stage.stroke();
  //   stage.fillStyle = 'lightgrey';
  //   stage.fillRect(0, 150, 800, 200);
  //   stage.fillStyle = 'black';
  //   stage.fillRect(0, 310, 800, 40);
  //   stage.fill();
  // }

  const keyA = new DrumKey(drum, 'ArrowLeft');
  const keyB = new DrumKey(drum, 'ArrowRight');
  const drumKeys = [keyA, keyB];
  keyA.register(don);
  keyB.register(kat);

   function togglePause() {
    if (musicOn) {
      musicOn = false;
      music.pause();
    } else {
      musicOn = true;
      music.play();
    }
    togglePlay.render();

    gameOn = gameOn ? false : true;
    update();
  }

  // On mouse button click
  function onMouseDown(e) {
      // Get the mouse position
      var pos = getMousePos(canvas, e);
      console.log(pos.x, pos.y);
      // console.log(e.clientX,e.clientY)
      if (!gameOn) {
        console.log('game not on')
        togglePause();
        modal.classList.add('hide');
      }
      //TODO: song selection and game state
      // if (gamestate == gamestates.gameover) {
      //     newGame();
      // } else if (gamestate == gamestates.win) {
      //     endscreen.style.display = 'none';

      //     var tilefound = false
      //     for (var i=0; i<level.columns; i++) {
      //         for (var j=0; j<level.rows; j++) {
      //             if (level.tiles[i][j].type != -1) {
      //                 tilefound = true;
      //                 break;
      //             }
      //         }
      //     }

      //     if (!tilefound) {
      //         createLevel();
      //     }
      //     setGameState(gamestates.ready)
      // } else if (gamestate == gamestates.displaygif){
      //     gifs[gifnum].style.display = 'none';
      //     // closebutton.style.display = 'none';
      //     gifnum = (gifnum + 1)%5;
      //     setGameState(gamestates.removecluster);
      // }
      else if (isInside(pos,buttonPositions["bluearea1"],"bluearea1") || isInside(pos,buttonPositions["bluearea2"],"bluearea2") ) {
             console.log("kat")
            keyB.pressed = true;
            kat.currentTime = 0;
            kat.play();
            keyB.drum.tap(kat);
            setTimeout(() => {
              keyB.pressed = false;
            }, 100)
      }
      else if (isInside(pos,buttonPositions["pinkarea"],"pinkarea")) {
            console.log("don")
            keyA.pressed = true;
            don.currentTime = 0;
            don.play();
            keyA.drum.tap(don);
            setTimeout(() => {
              keyA.pressed = false;
            }, 100)
      }
      // else if (isInside(pos,directionButtons["rightButton"])) {
      //     console.log("right")
      //     mousedownright = true;
      //     if (IS_MOBILE){
      //         console.log("mobile right")
      //         player.angle = Math.max(8, player.angle-2);
      //         if (charframe == 2) {
      //             charframe = 3;
      //         } else if (charframe == 3) {
      //             charframe = 1;
      //         } else if (charframe == 1) {
      //             charframe = 2;
      //         } else if (charframe == 0) {
      //             charframe = 1;
      //         };
      //     }
        //player.angle = Math.max(8, player.angle-2);
      // }
      //TODO: Can use this for song selection
      // for (var i=0;i<unlockIndex;i++){
      //     if (isInside(pos,playerButtons[i])){
      //         player.selectedSprite = i;
      //     }
      // }
  }

  function onMouseUp(e) {
      // Get the mouse position
      keyA.pressed = false;
      keyB.pressed = false;
  }
  function onTouchStart(e){
    e.clientX = e.touches[0].clientX;
    e.clientY = e.touches[0].clientY;
    // console.log("Touching",e.clientX,e.clientY)
    onMouseDown(e);
  }
  function onTouchEnd(e){
      // console.log("Touch ended");
      onMouseUp(e);
  }
  canvas.addEventListener("mousedown", onMouseDown);
  canvas.addEventListener("touchstart", onTouchStart);
  canvas.addEventListener("touchend", onTouchEnd);
  canvas.addEventListener("mouseup", onMouseUp);



  function setupStage() {
    // NotesArea();
    drum.render();
    score.render();
    // spiritGauge.render();
    // combo.render();
  }
  setupStage();

  let musicOn, gameOn, gameEnded;
  let msg = document.getElementById('msg');
  let restart = document.getElementById('restart');
  let modal = document.querySelector('.modal');
  let playPause = document.querySelector('.play-pause');

  playPause.addEventListener('click', () => togglePause());
  restart.addEventListener('click', () => location.reload());
  modal.addEventListener('click', () => {
    if (!gameEnded) {
      togglePause();
      modal.classList.add('hide');
    }
  })

  document.addEventListener('keydown', e => {
    if (e.code === 'Space' && !gameEnded) {
      togglePause();
      modal.classList.add('hide');
    }
    if (e.code === 'KeyR') {
      location.reload();
    }
  });

  music.onended = () => gameOver();

  function gameOver() {
    gameEnded = true;
    music.pause();
    modal.classList.remove('hide');
    msg.innerHTML = 'Game Over!';
    msg.innerHTML += `<br/> You score is ${score.score}`;
    msg.innerHTML += `<br/> You max combo is ${combo.maxCombo}`;
    msg.innerHTML += `<br/> Press R to restart`;
  }

  let frames = 0;
  let notes = {};
  let vel = 7;
  let life = music.bpm / 10;

  function update() {
    if (!life) gameOver();
    if (gameEnded || !gameOn) {
      return;
    }

    stage.clearRect(0, 0, 800, 500);
    frames ++;

    setupStage();

    let bpm = music.bpm;
    let delay = Math.floor(3600 / bpm - Math.random() * vel / 2);
    let notesKeys = Object.keys(notes);

    if (frames % delay === 0) {
      if (notesKeys.length < vel) {
        let note = new Note(vel);
        notes[note.id] = note;
        frames = 0;
      }
    }

    for (let i = 0; i < notesKeys.length; i++) {
      let id = notesKeys[i];
      let note = notes[id];
      note.render();
      note.move();

      if (note.x > drum.x - 60 && note.x < drum.x) {
        for (let j = 0; j < drumKeys.length; j++) {
          let key = drumKeys[j];
          if (key.pressed) {
            // console.log(key)
            // console.log(key.type,note.type);
            key.pressed = false;
            drum.flash();
            if (key.type === note.type) {
              combo.up();
              spiritGauge.up(combo.combo);
              score.up(spiritGauge.spirit);
              delete notes[id];
            } else {
              combo.reset();
            }
          }
        }
      } 
      if (note.x < -40) {
        spiritGauge.down();
        combo.reset();
        delete notes[id];
        life--;
      }
    }

    requestAnimationFrame(update);
  }
});