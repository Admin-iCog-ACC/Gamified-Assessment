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
  document.body.appendChild(button);

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
    const code = editor.getValue();
    const lines = code.split("\n");
    console.log(lines);
  }
}

createTextEditorPage();

// Export the function
window.createTextEditorPage = createTextEditorPage;