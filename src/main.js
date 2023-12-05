import Phaser from "phaser";

// @ts-ignore
// import GameScene from "./GameScene";
import CodeMirror from "codemirror";
import GameOver from "./GameoverScene";
// @ts-ignore
import "../styles.css";

// Create a link element
var link = document.createElement("link");
link.rel = "stylesheet";
link.href = "https://unpkg.com/intro.js/introjs.css";

// Append the link element to the head section
document.head.appendChild(link);

// const gameStartDiv = document.querySelector("#gameStartDiv")
// @ts-ignore
const gameStartDiv = document.getElementById("gameStartDiv");
const gameStartBtn = document.querySelector("#gameStartBtn");
const body = document.querySelector("body");
// body.style.backgroundColor = "black";
body.style.zIndex = "10";

var overlay = document.createElement("div");
overlay.classList.add("overlay");
document.documentElement.appendChild(overlay);

import ScoreLabel from "./ui/ScoreLabel";
import BombSpawner from "./BombSpawner";
import CountdownController from "./CountDownController";
// import createTextEditorPage from "./ui/"

// @ts-ignore
const GROUND_KEY = "ground";
const DUDE_KEY = "dude";
const STAR_KEY = "star";
const BOMB_KEY = "bomb";

// console.log(inputs)

class GameScene extends Phaser.Scene {
  constructor() {
    super("game-scene");

    this.player = undefined;
    this.cursors = undefined;
    this.scoreLabel = undefined;
    this.bombSpawner = undefined;
    this.stars = undefined;
    this.gameOver = false;
    this.jumpFlag = false;
    this.key = "";
    this.distance = 0;
    this.initialJumpFlag = false;
    this.isButtonClicked = false;

    this.delayTimer = null; // Timer for delaying the automatic update
    this.delayDuration = 2000; // Delay duration in milliseconds

    // test=this.test = 0;
  }

  preload() {
    // this.scene.launch("StartMenu");

    this.load.image("sky", "assets/space-pic.jpg");
    this.load.image("GROUND_KEY", "assets/platform.png");
    this.load.image(STAR_KEY, "assets/star.png");
    this.load.image(BOMB_KEY, "assets/bomb.png");

    this.load.audio("collectstar", "assets/pepSound1.ogg");

    this.load.spritesheet(DUDE_KEY, "assets/dude.png", {
      frameWidth: 32,
      frameHeight: 48,
    });

    this.load.audio("right-left", "assets/pepSound1.ogg");
    this.load.audio("jump", "assets/phaseJump3.ogg");
    this.load.audio("backgroundMusic", "assets/background-music.mp3");
  }

  create() {
    this.scene.pause("game-scene");
    this.add.image(400, 300, "sky");

    //  Creating Platforms , players , stars , ScoreLabels
    const platforms = this.createPlatforms();
    this.player = this.createPlayer();
    this.stars = this.createStars();
    this.scoreLabel = this.createScoreLabel(16, 16, 0);

    this.bombSpawner = new BombSpawner(this, BOMB_KEY);
    const bombsGroup = this.bombSpawner.group;

    // Adding Colliders
    // @ts-ignore
    this.physics.add.collider(this.player, platforms);
    this.physics.add.collider(this.stars, platforms);
    this.physics.add.collider(bombsGroup, platforms);

    // const timerLabel = this.add
    //   .text(50, 50, "45", { fontSize: "48" })
    //   .setOrigin(0.5);

    // this.countdown = new CountdownController(this, timerLabel);
    // this.countdown.start(this.handleCountdownFinished.bind(this));

    // this.physics.add.collider(
    //   this.player,
    //   bombsGroup,
    //   this.hitBomb,
    //   null,
    //   this

    //   // createTextEditorPage();
    // );

    // Overlap B/n Player and Star
    this.physics.add.overlap(
      // @ts-ignore
      this.player,
      this.stars,
      this.collectStar,
      null,
      this
    );

    this.backgroundMusic = this.sound.add("backgroundMusic", { loop: true });
    //
    this.cursors = this.input.keyboard.createCursorKeys();

    const button = this.add.text(1000, 450, "Run Game", {
      backgroundColor: "#ff0000",
      padding: {
        left: 0,
        right: 50,
        top: 0,
        bottom: 0,
      },
    });

    this.backgroundMusic.play();

    // Enable button interactivity
    button.setInteractive();

    button.on("pointerdown", this.onButtonClick, this);

    var domButton = document.getElementById("runButton");
    domButton.addEventListener("click", function () {
      // Trigger the game button when the DOM button is clicked
      button.emit("pointerdown");
    });

    // // Add button click event listener
  }

  handleCountdownFinished() {
    this.player.active = false;
    this.player.setVelocity(0, 0);

    const { width, height } = this.scale;

    this.add.rectangle(width * 0.5, height * 0.5, 400, 400, 0xffffff);

    const newFontSize = 48 * 5;

    // this.add
    //   // @ts-ignore
    //   .text(width * 0.5, height * 0.5, "You Lose!")
    //   .setOrigin(0.5);

    this.add
      .text(width * 0.5, height * 0.5, "You Lose!", { fontSize: "48" })
      .setOrigin(0.5);
  }

  onButtonClick() {
    // Set the flag when the button is clicked
    this.isButtonClicked = true;
  }

  update() {
    if (this.gameOver) {
      return;
    }

    if (this.isButtonClicked) {
      let index = 0;

      // Execute logic when button is clicked
      let retrievedDataString = localStorage.getItem("myinput");

      // Convert the string back to an array
      let retrievedDataArray = JSON.parse(retrievedDataString);

      console.log(retrievedDataArray); // Output: ["apple", "banana", "orange"]

      const processNextElement = () => {
        if (index < retrievedDataArray.length) {
          const currentString = retrievedDataArray[index];
          console.log("Processing:", currentString);

          if (currentString === "right()") {
            this.righty(); // Access class method using `this`
          }

          if (currentString === "right(2)") {
            var number = currentString[6];
            this.righty(number); // Access class method using `this`
          }

          if (currentString === "right(3)") {
            var number = currentString[6];
            this.righty(number); // Access class method using `this`
          }

          if (currentString === "right(4)") {
            var number = currentString[6];
            this.righty(number); // Access class method using `this`
          }

          if (currentString === "right(5)") {
            var number = currentString[6];
            this.righty(number); // Access class method using `this`
          }

          if (currentString === "right(6)") {
            var number = currentString[6];
            this.righty(number); // Access class method using `this`
          }

          if (currentString === "right(7)") {
            var number = currentString[6];
            this.righty(number); // Access class method using `this`
          }

          if (currentString === "left()") {
            this.lefty();
          }

          if (currentString === "left(2)") {
            var number = currentString[5];
            this.lefty(number);
          }

          if (currentString === "left(3)") {
            var number = currentString[5];
            this.lefty(number);
          }

          if (currentString === "left(4)") {
            var number = currentString[5];
            this.lefty(number);
          }

          if (currentString === "left(5)") {
            var number = currentString[5];
            this.lefty(number);
          }

          if (currentString === "left(6)") {
            var number = currentString[5];
            this.lefty(number);
          }

          if (currentString === "left(7)") {
            var number = currentString[5];
            this.lefty(number);
          }

          if (currentString === "left(8)") {
            var number = currentString[5];
            this.lefty(number);
          }

          if (currentString === "left(9)") {
            var number = currentString[5];
            this.lefty(number);
          }

          if (currentString === "jump") {
            this.jump();
          }

          if (currentString === "jump(2)") {
            // @ts-ignore
            var number = parseInt(currentString.slice(5));
            this.jump(number);
          }

          if (currentString === "jump(3)") {
            // @ts-ignore
            var number = parseInt(currentString.slice(5));
            this.jump(number);
          }

          if (currentString === "jump(4)") {
            // @ts-ignore
            var number = parseInt(currentString.slice(5));
            this.jump(number);
          }

          if (currentString === "jump(5)") {
            // @ts-ignore
            var number = parseInt(currentString.slice(5));
            this.jump(number);
          }

          if (currentString === "jump(6)") {
            // @ts-ignore
            var number = parseInt(currentString.slice(5));
            this.jump(number);
          }

          if (currentString === "jump(7)") {
            // @ts-ignore
            var number = parseInt(currentString.slice(5));
            this.jump(number);
          }

          if (currentString === "jump(8)") {
            // @ts-ignore
            var number = parseInt(currentString.slice(5));
            this.jump(number);
          }

          if (currentString === "jump(9)") {
            // @ts-ignore
            var number = parseInt(currentString.slice(5));
            this.jump(number);
          }

          index++;
          setTimeout(processNextElement, 1000);
        } else {
          console.log("All elements processed");
          retrievedDataString = "";
          retrievedDataArray = [];
          this.isButtonClicked = false;
        }
      };

      processNextElement();

      // Reset the flag after executing the logic
      this.isButtonClicked = false;
    }

    // this.countdown.update();
  }











  jump(jumpCount = 1) {
    if (this.player && this.player.body) {
      var speed = -300;
      var jumpDelay = 170; // Delay between each jump in milliseconds

      const jump = (count) => {
        if (count <= 0) {
          return;
        }

        this.sound.play("jump");
        this.player.setVelocityY(speed);
        this.player.anims.play("turn", true);

        setTimeout(() => {
          this.player.setVelocityY(0);
          jump(count - 1); // Call the jump function recursively with a decreased count
        }, jumpDelay);
      };

      jump(jumpCount);
    }
  }

  righty(jumpCount = 1) {
    if (this.player && this.player.body) {
      var speed = 300;
      var jumpDelay = 200; // Delay between each jump in milliseconds

      // Recursive helper function to handle the jumps
      const jump = (count) => {
        if (count <= 0) {
          return;
        }

        this.sound.play("right-left");
        this.player.setVelocityX(speed);
        this.player.anims.play("right", true);

        setTimeout(() => {
          this.player.setVelocityX(0);
          jump(count - 1); // Call the jump function recursively with a decreased count
        }, jumpDelay);
      };

      jump(jumpCount);
    }
  }

  lefty(jumpCount = 1) {
    if (this.player && this.player.body) {
      var speed = -300;
      var jumpDelay = 200; // Delay between each jump in milliseconds

      // Recursive helper function to handle the jumps
      const jump = (count) => {
        if (count <= 0) {
          return;
        }

        this.sound.play("right-left");
        this.player.setVelocityX(speed);
        this.player.anims.play("left", true);

        setTimeout(() => {
          this.player.setVelocityX(0);
          jump(count - 1); // Call the jump function recursively with a decreased count
        }, jumpDelay);
      };

      jump(jumpCount);
    }
  }


  // Creating the Movement Functions
  moveLeft() {
    console.log("Left Working");
    if (this.player) {
      return this.player.setVelocityX(-800);
    }
  }

  // Move right function
  moveRight() {
    this.player.setVelocityX(-160);
    this.player.anims.play("right", true);
  }

  // Creating the Ground Platform
  createPlatforms() {
    const platforms = this.physics.add.staticGroup();

    platforms.create(400, 568, "GROUND_KEY").setScale(2).refreshBody();

    // Adding the Platforms at different x,y coordinates using
    platforms.create(600, 400, "GROUND_KEY");
    platforms.create(50, 250, "GROUND_KEY");
    platforms.create(750, 220, "GROUND_KEY");

    return platforms;
  }

  createStars() {
    const stars = this.physics.add.group({
      key: STAR_KEY,
      repeat: 6,
      setXY: { x: 12, y: 0, stepX: 70 },
    });

    stars.children.iterate((c) => {
      // Creating the Bounce Property when the Stars are created
      // @ts-ignore
      const child = /**@type {Phaser.Physics.Arcade.Sprite} */ (c);
      child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.6));
    });

    return stars;
  }

  // When collecting stars the Stars should be removed from the screen
  // @ts-ignore
  collectStar(player, star) {
    this.sound.play("collectstar");

    star.disableBody(true, true);
    this.scoreLabel.add(1000);

    if (this.stars.countActive(true) === 0) {
      this.scene.start("game-over", { title: "  You Won ! " });
    }

    // this.bombSpawner.spawn(player.x);
  }

  // Creating the Player and Animation characterstics

  // Creating the Score Label
  createScoreLabel(x, y, score) {
    const style = { fontSize: "32px", fill: "#000" };
    const label = new ScoreLabel(this, x, y, score, style);

    // @ts-ignore
    this.add.existing(label);

    return label;
  }

  // @ts-ignore
  hitBomb(player, bomb) {
    this.physics.pause();

    player.setTint(0xff0000);

    player.anims.play("turn");

    this.gameOver = true;
  }

  createPlayer() {
    const player = this.physics.add.sprite(100, 450, DUDE_KEY);
    player.setBounce(0.2);
    player.setCollideWorldBounds(true);

    this.anims.create({
      key: "left",
      frames: this.anims.generateFrameNumbers(DUDE_KEY, { start: 0, end: 3 }),
      frameRate: 10,
      repeat: -1,
    });

    this.anims.create({
      key: "turn",
      frames: [{ key: DUDE_KEY, frame: 4 }],
      frameRate: 20,
    });

    this.anims.create({
      key: "right",
      frames: this.anims.generateFrameNumbers(DUDE_KEY, { start: 5, end: 8 }),
      frameRate: 10,
      repeat: -1,
    });

    return player;
  }
}

const gameScene = new GameScene();

const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 570,
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 300 },
    },
  },
  scene: [GameScene, GameOver],
};

// @ts-ignore
let jumpFlag = false;

function createTextEditorPage() {
  // Create the <textarea> element
  var textarea = document.createElement("textarea");
  textarea.id = "editor";
  textarea.name = "editor";
  document.body.appendChild(textarea);

  // Create the "Run Code" button
  var button = document.createElement("button");
  button.textContent = "Run Code";
  button.style.width = "15%";
  button.style.position = "absolute";
  button.style.backgroundColor = "slate";
  button.style.bottom = "0";
  button.style.marginBottom = "3rem";
  button.style.marginRight = "3rem";

  button.style.right = "0";
  button.style.height = "4rem";
  button.style.marginTop = "4rem";
  button.onclick = runCode;
  button.id = "runButton"; // Add the id attribute
  document.body.appendChild(button);

  // Creating an instance of the GameScene and interacting with the game

  // console.log(gameScene);

  // Create the CodeMirror editor
  var editor = CodeMirror.fromTextArea(
    /** @type {HTMLTextAreaElement} */
    (document.getElementById("editor")),
    {
      mode: "xml",
      theme: "dracula",
      lineNumbers: true,
    }
  );

  //   // Get a reference to the DOM button
  // const domButton = document.getElementById('domButton');

  // // Add a click event listener to the DOM button
  // domButton.addEventListener('click', function() {
  //   // Trigger the click event on the Phaser button
  //   button.emit('pointerdown');
  // });

  function runCode() {
    // @ts-ignore
    const test = 10;
    gameScene.jumpFlag = true; // Set the jumpFlag property of the gameScene object to true when the button is clicked

    gameScene.jump();
    // gameScene.moveRight();

    const code = editor.getValue();
    const inputArray = code.split("\n");

    console.log(inputArray);

    const inputString = JSON.stringify(inputArray);

    // Store the data in the local storage
    localStorage.setItem("myinput", inputString);

    //   <script>

    //   const domButton = document.getElementById('domButton');
    //   domButton.addEventListener('click', function() {
    //     button.emit('pointerdown');
    //   });

    // </script>

    // gameScene.jump(input);

    //     for (let i = 0; i < input.length; i++) {
    //       if (lines[i] === "jump") {
    //         // gameScene.jump(lines)

    //       } else if (lines[i] === "moveLeft") {
    //         gameScene.moveLeft(lines)

    //       } else if (lines[i] === "moveRight") {
    //         gameScene.moveRight(lines)

    //         console.log("Moving right!");
    //       } else {
    // console.log("Error Code , Please Insert a correct method ")
    //       }
    //     }

    // console.log(lines);
  }
}

createTextEditorPage();

const game = new Phaser.Game(config);

gameStartBtn.addEventListener("click", () => {
  gameStartDiv.style.display = "none";
  // var canvas = document.getElementById("canvas");

  // canvas.style.display = "block";
  game.scene.resume("game-scene");
});
