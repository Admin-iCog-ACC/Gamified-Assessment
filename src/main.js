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
const ENEMY = "enemy";
const BOMB_KEY = "bomb";

// console.log(inputs)

class Laser extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, "laser");
  }

  fire(x, y) {
    this.body.reset(x, y);

    this.setActive(true);
    this.setVisible(true);

    this.setVelocityX(1500);
  }

  fireLeft(x, y) {
    this.body.reset(x, y);

    this.setActive(true);
    this.setVisible(true);

    this.setVelocityX(-1500);
  }
}

class LaserGroup extends Phaser.Physics.Arcade.Group {
  constructor(scene) {
    super(scene.physics.world, scene);

    this.createMultiple({
      frameQuantity: 3000,
      key: "laser",
      active: false,
      visible: false,
      classType: Laser,
    });
  }

  fireBullet(x, y) {
    const laser = this.getFirstDead(false);

    if (laser) {
      laser.fire(x, y);
    }
    return laser;
  }

  fireBulletLeft(x, y) {
    const laser = this.getFirstDead(false);

    if (laser) {
      laser.fireLeft(x, y);
    }
    return laser;
  }
}

class GameScene extends Phaser.Scene {
  constructor() {
    super("game-scene");

    // Shooitng Functionlity
    this.ship;
    this.laserGroup;
    this.inputKeys;
    this.currentBullet = null; // Initialize currentBullet as null

    this.player = undefined;
    this.cursors = undefined;
    this.scoreLabel = undefined;
    this.bombSpawner = undefined;
    this.stars = undefined;
    this.enemy1 = undefined;
    this.enemy2 = undefined;
    this.enemy3 = undefined;
    this.enemy4 = undefined;
    this.star1 = undefined;
    this.star2 = undefined;
    this.star3 = undefined;
    this.star4 = undefined;
    this.star5 = undefined;
    this.star6 = undefined;
    this.gamePiece = undefined;
    this.mysprite = undefined;
    this.gameOver = false;
    this.jumpFlag = false;
    this.key = "";
    this.distance = 0;
    this.initialJumpFlag = false;
    this.isButtonClicked = false;

    this.delayTimer = null; // Timer for delaying the automatic update
    this.delayDuration = 2000; // Delay duration in milliseconds
  }

  preload() {
    // this.scene.launch("StartMenu");

    this.load.image("sky", "assets/space-pic.jpg");
    this.load.image("GROUND_KEY", "assets/platform.png");
    this.load.image(STAR_KEY, "assets/star.png");
    this.load.image(BOMB_KEY, "assets/bomb.png");
    this.load.image("enemy", "assets/blue.png");

    const game = new GameScene();

    this.load.image("poo", "assets/poo.png");
    this.load.spritesheet("mummy", "assets/mummy37x45.png", {
      frameWidth: 37,
      frameHeight: 45,
    });

    // Loading Shooting Functionlity
    this.load.image("laser", "assets/laserBlue02.png");
    this.load.image("GROUND_KEY", "assets/playerShip1_red.png");

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
    // this.scene.pause("game-scene");
    this.add.image(400, 300, "sky");

    //  Creating Platforms , players , stars , ScoreLabels
    const platforms = this.createPlatforms();
    this.player = this.createPlayer();
    // this.stars = this.createStars();
    this.scoreLabel = this.createScoreLabel(16, 16, 0);

    // Animation

    const mummyAnimation = this.anims.create({
      key: "walk",
      frames: this.anims.generateFrameNumbers("mummy", { start: 0, end: 10 }),
      frameRate: 16,
    });
    
    const sprite = this.add.sprite(50, 300, "mummy").setScale(1.2);
    
    sprite.play({ key: "walk", repeat: -1 });     
    const distanceToWalk = 50; // Adjust this value to determine the distance to walk
    
    this.tweens.add({
      targets: sprite,
      x: sprite.x + distanceToWalk,
      duration: 558800,
      ease: "Linear",
    });

    // Create the enemy sprite
    this.enemy1 = this.physics.add.sprite(700, 100, "mummy");
    this.enemy2 = this.physics.add.sprite(700, 350, "mummy");
    this.enemy3 = this.physics.add.sprite(450, 500, "mummy");
    this.enemy4 = this.physics.add.sprite(150, 100, "mummy");

    this.enemy1.play({ key: "walk", repeat: -1 });    
    this.enemy2.play({ key: "walk", repeat: -1 });     
    this.enemy3.play({ key: "walk", repeat: -1 });     
    this.enemy4.play({ key: "walk", repeat: -1 });     

    this.star1 = this.physics.add.sprite(750, 50, STAR_KEY);
    this.star2 = this.physics.add.sprite(750, 350, STAR_KEY);
    this.star3 = this.physics.add.sprite(600, 400, STAR_KEY);
    this.star4 = this.physics.add.sprite(50, 100, STAR_KEY);

    this.bombSpawner = new BombSpawner(this, BOMB_KEY);
    const bombsGroup = this.bombSpawner.group;

    // Adding Colliders
    // @ts-ignore
    this.physics.add.collider(this.player, platforms);
    // this.physics.add.collider(this.stars, platforms);
    this.physics.add.collider(bombsGroup, platforms);

    this.physics.add.collider(this.enemy1, platforms);
    this.physics.add.collider(this.enemy2, platforms);
    this.physics.add.collider(this.enemy3, platforms);
    this.physics.add.collider(this.enemy4, platforms);
    this.physics.add.collider(this.star1, platforms);
    this.physics.add.collider(this.star2, platforms);
    this.physics.add.collider(this.star3, platforms);
    this.physics.add.collider(this.star4, platforms);

    // Create Shooting Part
    this.laserGroup = new LaserGroup(this);

    this.addShip();
    this.addEvents();

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

    //  Overlap Detection
    this.laserGroup = new LaserGroup(this);
    const lasers = this.laserGroup.getChildren();

    // Collision Detection between Lasers and Enemy 3
    this.physics.add.overlap(
      // @ts-ignore
      lasers,
      [this.enemy3, this.enemy2, this.enemy1],
      this.collectEnemy,
      null,
      this
    );

    // Player and Enemy Ovelap
    this.physics.add.overlap(
      // @ts-ignore
      this.player,
      [this.enemy3, this.enemy2, this.enemy1],
      this.deductPoints,
      null,
      this
    );

    // Overlap B/n Player and Star
    this.physics.add.overlap(
      // @ts-ignore
      this.player,
      [this.star1, this.star2, this.star3, this.star4, this.star5, this.star6],
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

  addShip() {
    const centerX = this.cameras.main.width;
    const bottom = this.cameras.main.height;
    this.ship = this.add.image(centerX, bottom - 150, "ship");
  }

  addEvents() {
    // Clicking the mouse should fire a bullet
    this.input.on("pointerdown", (pointer) => {
      this.fireBullet();
    });

    // Firing bullets should also work on enter / spacebar press
    this.inputKeys = [
      this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE),
      this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER),
    ];
  }

  fireBullet() {
    this.laserGroup.fireBullet(this.player.x, this.player.y);
  }

  fireBulletLeft() {
    this.laserGroup.fireBulletLeft(this.player.x, this.player.y);
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
      let retrievedDataString = localStorage.getItem("myinput");
      let retrievedDataArray = JSON.parse(retrievedDataString);

      console.log(retrievedDataArray);
      const lenArray = retrievedDataArray.length;
      const functionCall = retrievedDataArray[lenArray - 1];
      const firstElement = retrievedDataArray[0];

      const processNextElement = () => {
        if (index < retrievedDataArray.length) {
          const currentString = retrievedDataArray[index];
          console.log("Processing:", currentString);

          if (currentString.startsWith("def")) {
            // User-defined function
            const functionName = currentString.substring(4).trim();
            const functionIndex = lenArray - 1;

            if (functionIndex !== -1) {
              const functionBody = retrievedDataArray.slice(
                index + 1,
                functionIndex
              );
              executeFunction(functionBody);
              index = functionIndex + 1;
            } else {
              console.log(`Function enddef ${functionName} not found.`);
            }
          } else {
            // Single action
            executeAction(currentString);
            index++;
          }

          setTimeout(processNextElement, 1000);
        } else {
          console.log("All elements processed");
          retrievedDataString = "";
          retrievedDataArray = [];
          this.isButtonClicked = false;
        }
      };

      const executeAction = (action) => {
        console.log("Executing action:", action);
        const trimmedAction = action.trim();
        if (trimmedAction === "player.shootRight()") {
          this.fireBullet();
        } else if (trimmedAction === "player.shootLeft") {
          this.fireBulletLeft();
        } else if (trimmedAction === "player.right()") {
          this.righty();
        } else if (trimmedAction === "player.right(2)") {
          var number = trimmedAction[6];
          this.righty(number);
        } else if (trimmedAction === "player.right(3)") {
          var number = trimmedAction[6];
          this.righty(number);
        } else if (trimmedAction === "player.left()") {
          this.lefty();
        } else if (trimmedAction === "player.left(2)") {
          var number = trimmedAction[5];
          this.lefty(number);
        } else if (trimmedAction === "player.left(3)") {
          var number = trimmedAction[5];
          this.lefty(number);
        } else if (trimmedAction === "player.left(4)") {
          var number = trimmedAction[5];
          this.lefty(number);
        } else if (trimmedAction === "player.jump()") {
          this.jump();
        } else {
          console.log("Unknown trimmedAction:", trimmedAction);
        }
      };

      const executeFunction = (functionBody) => {
        console.log("Executing function:", functionBody);

        let i = 0; // Initialize the index

        const executeNextAction = () => {
          if (i < functionBody.length) {
            const currentAction = functionBody[i];

            executeAction(currentAction);

            i++;

            setTimeout(executeNextAction, 1000); // Delay each iteration by 2 seconds
          }
        };

        executeNextAction();
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

  // createStars() {
  //   const stars = this.physics.add.group({
  //     key: STAR_KEY,
  //     repeat: 6,
  //     setXY: { x: 12, y: 0, stepX: 70 },
  //   });

  //   stars.children.iterate((c) => {
  //     // Creating the Bounce Property when the Stars are created
  //     // @ts-ignore
  //     const child = /**@type {Phaser.Physics.Arcade.Sprite} */ (c);
  //     child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.6));
  //   });

  //   return stars;
  // }

  // When collecting stars the Stars should be removed from the screen
  // @ts-ignore
  collectStar(player, star) {
    this.sound.play("collectstar");

    star.disableBody(true, true);
    this.scoreLabel.add(1000);

    // if (this.stars.countActive(true) === 0) {
    //   this.scene.start("game-over", { title: "  You Won ! " });
    // }

    // this.bombSpawner.spawn(player.x);
  }

  collectEnemy(laser, enemy3) {
    console.log("Bullet - Enemy Collision Working");
    this.sound.play("collectstar");
    this.scoreLabel.add(2000);
    enemy3.disableBody(true, true);
  }

  deductPoints(laser, enemy3) {
    this.scoreLabel.add(-500);
    this.player.setPosition(100, 400);
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

  var editor = CodeMirror.fromTextArea(
    /** @type {HTMLTextAreaElement} */
    (document.getElementById("editor")),
    {
      mode: "python",
      theme: "dracula",
      lineNumbers: true,
      extraKeys: {
        Space: function (cm) {
          var cursor = cm.getCursor(); // Get the current cursor position
          cm.replaceRange(" ", cursor); // Insert a space character at the cursor position
        },
        Enter: "newlineAndIndentContinueComment",
      },
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
  }
}

createTextEditorPage();

const game = new Phaser.Game(config);

gameStartBtn.addEventListener("click", () => {
  gameStartDiv.style.display = "none";

  console.log("Start Game Clicked");
  // var canvas = document.getElementById("canvas");

  // canvas.style.display = "block";
  game.scene.resume("game-scene");
});
