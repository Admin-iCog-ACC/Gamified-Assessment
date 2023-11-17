export default class StartGameScene extends Phaser.Scene {
  constructor() {
      super({ key: 'StartGameScene' });
  }

  create() {
      // Create the start text and position it on the screen
      // @ts-ignore
      const startText = this.add.text(400, 300, 'Click to Start', { fontSize: '32px', fill: '#fff' });
      startText.setOrigin(0.5);
      startText.setInteractive();

      // Add an event listener to the start text
      startText.on('pointerdown', () => {
          // Transition to the main game scene when the start text is clicked
          this.scene.start('GameScene');
      });
  }
}




// / import GameOver from "./GameoverScene";

// export default class StartMenu extends Phaser.Scene {
//     constructor() {
//       super('StartMenu');
//     }
  
//     create() {

//       var startButton = this.add.image(400, 300, 'startButton');
//       startButton.setInteractive();

//       // Add an event listener to the start button
//       startButton.on('pointerdown', function () {
//           // Transition to the main game scene when the start button is clicked
//           this.scene.start('GameScene');
//       }, this);


//       // Add start button
//       // @ts-ignore
//       // const startButton = this.add.text(400, 300, 'Start Game', { fontSize: '64px', fill: '#fff' }).setOrigin(0.5);
//       // startButton.setInteractive(); // Enable button interactivity
  
//       // // Start game on button click
//       // startButton.on('pointerdown', () => {
//       //   console.log("Gameover Clicked Down")
//       //   this.scene.stop("StartMenu")
//       //   this.scene.start('GameScene'); // Start your game scene
//       //   console.log("executes")
//       // });
//     }
//   }