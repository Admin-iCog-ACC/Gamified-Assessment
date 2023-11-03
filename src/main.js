import Phaser from "phaser";

import GameScene from "./GameScene";
import CodeMirror from "codemirror";

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
  const gameScene = new GameScene();

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
    gameScene.jump();

	jumpFlag = true; // Set the jump flag to true when the button is clicked

    const code = editor.getValue();
    const lines = code.split("\n");
    console.log(lines);
  }
}

createTextEditorPage();

export default new Phaser.Game(config);
