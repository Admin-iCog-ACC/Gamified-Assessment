// @ts-nocheck
import Phaser from "phaser";
import ScoreLabel from "./ui/ScoreLabel";
import BombSpawner from "./BombSpawner";
// import createTextEditorPage from "./ui/"

const GROUND_KEY = "ground";
const DUDE_KEY = "dude";
const STAR_KEY = "star";
const BOMB_KEY = "bomb";

// console.log(inputs)

export default class GameScene extends Phaser.Scene {
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
    this.load.image("sky", "assets/sky.png");
    this.load.image("GROUND_KEY", "assets/platform.png");
    this.load.image(STAR_KEY, "assets/star.png");
    this.load.image(BOMB_KEY, "assets/bomb.png");

    this.load.spritesheet(DUDE_KEY, "assets/dude.png", {
      frameWidth: 32,
      frameHeight: 48,
    });
  }

  create() {
    this.game.loop.update = this.customUpdate;

    this.add.image(400, 300, "sky");
    this.add.image(400, 300, "star");

    //  Creating Platforms , players , stars , ScoreLabels
    const platforms = this.createPlatforms();
    this.player = this.createPlayer();
    this.stars = this.createStars();
    this.scoreLabel = this.createScoreLabel(16, 16, 0);

    // Create a button

    this.bombSpawner = new BombSpawner(this, BOMB_KEY);
    const bombsGroup = this.bombSpawner.group;

    // Adding Colliders
    this.physics.add.collider(this.player, platforms);
    this.physics.add.collider(this.stars, platforms);
    this.physics.add.collider(bombsGroup, platforms);
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
      this.player,
      this.stars,
      this.collectStar,
      null,
      this
    );

    //
    this.cursors = this.input.keyboard.createCursorKeys();

    const button = this.add.text(200, 200, "Run Game", {
      backgroundColor: "#ff0000",
      padding: {
        left: 30,
        right: 30,
        top: 20,
        bottom: 20,
      },
    });

    // Enable button interactivity
    button.setInteractive();

    // Add button click event listener
    button.on("pointerdown", this.onButtonClick, this);
  }

  jump(jumpFlag) {
    if (
      jumpFlag &&
      this.player &&
      this.player.body &&
      this.player.body.touching &&
      this.player.body.touching.down
    ) {
      this.player.setVelocityY(-330);
      // this.stopJump(); // Call stopJump() after the jump action
    }
  }

  // lefty(jumpFlag) {
  //   if (
  //     jumpFlag &&
  //     this.player &&
  //     this.player.body &&
  //     this.player.body.touching &&
  //     this.player.body.touching.down
  //   ) {
  //     this.player.setVelocityX(-1000);
  //     jumpFlag = false
  //   }
  // }

  // projectile() {
  //   if (
  //     this.player &&
  //     this.player.body &&
  //     this.player.body.touching &&
  //     this.player.body.touching.down
  //   ) {
  //     var jumpSpeed = 200; // Adjust the initial jump speed as needed
  //     var jumpAngle = -45; // Adjust the jump angle (in degrees) as needed

  //     // Convert the jump angle from degrees to radians
  //     var jumpAngleRad = Phaser.Math.DegToRad(jumpAngle);

  //     // Calculate the jump velocity components
  //     var jumpVelocityX = jumpSpeed * Math.cos(jumpAngleRad);
  //     var jumpVelocityY = jumpSpeed * Math.sin(jumpAngleRad);

  //     this.player.setVelocityX(300);
  //     this.player.setVelocityY(100);
  //   }
  // }

  righty(jumpFlag) {
    if (
      jumpFlag &&
      this.player &&
      this.player.body &&
      this.player.body.touching &&
      this.player.body.touching.down
    ) {
      var speed = 300;

      this.player.setVelocityX(speed);
      this.player.anims.play("right", true);

      // Setting the timeout after seconds
      setTimeout(() => {
        this.player.setVelocityX(0);
      }, 200);

      jumpFlag = false;
    }
  }

  lefty(jumpFlag) {
    if (
      jumpFlag &&
      this.player &&
      this.player.body &&
      this.player.body.touching &&
      this.player.body.touching.down
    ) {
      var speed = -300;
      var duration = 170;

      this.player.setVelocityX(speed);
      this.player.anims.play("left", true);

      // Setting the timeout after seconds
      setTimeout(() => {
        this.player.setVelocityX(0);
      }, duration);

      jumpFlag = false;
    }
  }

  //

  onButtonClick() {
    // Set the flag when the button is clicked
    this.isButtonClicked = true;
  }

  update() {
    if (this.gameOver) {
      return;
    }


    if (this.isButtonClicked) {
      // Execute logic when button is clicked
      const retrievedDataString = localStorage.getItem("myinput");

      // Convert the string back to an array
      let retrievedDataArray = JSON.parse(retrievedDataString);

      console.log(retrievedDataArray); // Output: ["apple", "banana", "orange"]

      for (let i = 0; i < retrievedDataArray.length; i++) {
        const currentElement = retrievedDataArray[i];

        console.log("Processing:", currentElement);

        if (retrievedDataArray === null) {
          console.log("Nothing");
        }

        if (retrievedDataArray && retrievedDataArray[0] === "righty") {
          this.righty(true, 200);
          retrievedDataArray = retrievedDataArray.slice(1); // Remove the "jump" command from the array
          localStorage.setItem("myinput", JSON.stringify(retrievedDataArray)); // Update the modified array in local storage
        }

        if (retrievedDataArray && retrievedDataArray[0] === "lefty") {
          this.lefty(true, 200);
          retrievedDataArray = retrievedDataArray.slice(1); // Remove the "jump" command from the array
          localStorage.setItem("myinput", JSON.stringify(retrievedDataArray)); // Update the modified array in local storage
        }

        if (retrievedDataArray && retrievedDataArray[0] === "jump") {
          this.jump(true);
          retrievedDataArray = retrievedDataArray.slice(1); // Remove the "jump" command from the array
          localStorage.setItem("myinput", JSON.stringify(retrievedDataArray)); // Update the modified array in local storage
        }

        // Reset the flag after executing the logic
        this.isButtonClicked = false;

        retrievedDataArray.splice(i, 1);
        i--;
      }
    }

    //  write the code below

    // if (this.cursors.left.isDown) {
    //   // this.jump();
    //   this.player.setVelocityX(-160);

    //   this.player.anims.play("left", true);
    // } else if (this.cursors.right.isDown) {
    //   this.player.setVelocityX(160);

    //   this.player.anims.play("right", true);
    // } else {
    //   this.player.setVelocityX(0);

    //   this.player.anims.play("turn");
    // }

    // const retrievedDataString = localStorage.getItem("myinput");

    // // Convert the string back to an array
    // const retrievedDataArray = JSON.parse(retrievedDataString);

    // console.log(retrievedDataArray); // Output: ["apple", "banana", "orange"]

    // if (retrievedDataArray[0] == 'jump' ){
    //   this.jump()
    // }

    // if (this.cursors.left.isDown) {
    //   // this.jump();
    //   this.player.setVelocityX(-160);

    //   this.player.anims.play("left", true);
    // } else if (this.cursors.right.isDown) {
    //   this.player.setVelocityX(160);

    //   this.player.anims.play("right", true);
    // } else {
    //   this.player.setVelocityX(0);

    //   this.player.anims.play("turn");
    // }

    // if (this.cursors.up.isDown && this.player.body.touching.down) {
    //   this.player.setVelocityY(-330);
    // }
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

  // // Jump function
  // jump() {
  //   this.player.setVelocityY(-330);
  //   console.log("jumpping")
  // }

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
      repeat: 11,
      setXY: { x: 12, y: 0, stepX: 70 },
    });

    stars.children.iterate((c) => {
      // Creating the Bounce Property when the Stars are created
      const child = /**@type {Phaser.Physics.Arcade.Sprite} */ (c);
      child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.6));
    });

    return stars;
  }

  // When collecting stars the Stars should be removed from the screen
  collectStar(player, star) {
    star.disableBody(true, true);
    this.scoreLabel.add(1000);

    if (this.stars.countActive(true) === 0) {
      //  A new batch of stars to collect
      this.stars.children.iterate((child) => {
        child.enableBody(true, child.x, 0, true, true);
      });
    }

    this.bombSpawner.spawn(player.x);
  }

  // Creating the Player and Animation characterstics

  // Creating the Score Label
  createScoreLabel(x, y, score) {
    const style = { fontSize: "32px", fill: "#000" };
    const label = new ScoreLabel(this, x, y, score, style);

    this.add.existing(label);

    return label;
  }

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
