import React from 'react';
import { Controlled as CodeMirror } from 'react-codemirror2';
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/material.css';
import 'codemirror/mode/javascript/javascript';

const CodeEditor = ({ value, onChange }) => {
  const codeMirrorOptions = {
    mode: 'javascript',
    theme: 'material',
    lineNumbers: true,
  };

  return (
    <div className="code-editor">
      <CodeMirror
        value={value}
        options={codeMirrorOptions}
        onBeforeChange={(editor, data, value) => onChange(value)}
      />
    </div>
  );
};

export default CodeEditor;