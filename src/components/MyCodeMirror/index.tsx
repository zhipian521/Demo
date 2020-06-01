import { UnControlled as CodeMirror } from 'react-codemirror2';
import 'codemirror/lib/codemirror.css';
import 'codemirror/lib/codemirror.js';
import 'codemirror/theme/idea.css';
import 'codemirror/mode/cmake/cmake';
import 'codemirror/mode/javascript/javascript';
import 'codemirror/mode/groovy/groovy';
import 'codemirror/mode/clike/clike';
import 'codemirror/addon/hint/show-hint.css';
import 'codemirror/addon/hint/show-hint.js';
import 'codemirror/addon/hint/anyword-hint.js';
import 'codemirror/addon/hint/javascript-hint.js';
import 'codemirror/addon/lint/lint.css';
import 'codemirror/addon/lint/lint.js';
import 'codemirror/addon/lint/json-lint.js';
import 'codemirror/addon/lint/css-lint.js';
import 'codemirror/addon/lint/javascript-lint.js';
import 'codemirror/addon/edit/matchbrackets.js';
import 'codemirror/addon/edit/closebrackets.js';
import 'codemirror/addon/selection/active-line.js';
import 'codemirror/addon/fold/foldgutter.css';
import 'codemirror/addon/fold/foldgutter.js';
import 'codemirror/addon/fold/brace-fold.js';
import 'codemirror/addon/display/placeholder.js';
import React from 'react';
import { Editor } from '@uiw/react-codemirror';

interface MyCodeMirrorProps {
  onBeforeChange?: (editor: Editor, data: any, value: string, next: () => void) => void;
  onBlur?: (editor: Editor, event?: any) => void;
  onCursorActivity?: (editor: Editor) => void;
  modeName?: string;
  placeholder?: string;
  value?: any;
  onChange?: React.ChangeEventHandler<any>;
  readOnly?: boolean;
  styleActiveLine?: boolean;
}

const MyCodeMirror: React.FC<MyCodeMirrorProps> = (props) => {
  return (
    <CodeMirror
      value={props.value}
      onChange={props.onChange}
      options={{
        mode: { name: props.modeName, globalVars: true },
        theme: 'idea',
        lineNumbers: true,
        matchBrackets: true,
        spellcheck: true,
        gutters: ['CodeMirror-linenumbers', 'CodeMirror-foldgutter', 'CodeMirror-lint-markers'],
        // lint: true,
        lineWrapping: true,
        smartIndent: true,
        autoCloseBrackets: true,
        placeholder: props.placeholder,
        foldGutter: true,
        styleActiveLine: props.styleActiveLine,
        readOnly: props.readOnly,
        height: '1000px',
      }}
      onBeforeChange={props.onBeforeChange}
      onBlur={props.onBlur}
      onCursorActivity={props.onCursorActivity}
    />
  );
};

export default MyCodeMirror;
