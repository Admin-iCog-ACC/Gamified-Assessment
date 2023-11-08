import Phaser from "phaser";

import GameScene from "./GameScene";
import CodeMirror from "codemirror";

const gameScene = new GameScene();

const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 300 },
    },
  },
  scene: [GameScene],
};




function customUpdate(arg1, arg2) {
  // This function is called on every frame update
  // You can access and use arg1 and arg2 within this function
  console.log(arg1 + arg2);
  // In this example, it will print "Hello, Phaser!" in the console
}

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
  button.style.width = "7rem";
  button.style.position = "absolute";
  button.style.bottom = "0";
  button.style.marginBottom = "3rem";
  button.style.right = "0";
  button.style.height = "2rem";
  button.style.marginTop = "2rem";
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

  function runCode() {
    const test = 10 
    gameScene.jumpFlag = true; // Set the jumpFlag property of the gameScene object to true when the button is clicked

    gameScene.jump();
    // gameScene.moveRight();

    const code = editor.getValue();
    const inputArray = code.split("\n");

    console.log(inputArray)

    const inputString = JSON.stringify(inputArray);

    // Store the data in the local storage
    localStorage.setItem("myinput", inputString);


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

export default new Phaser.Game(config);
