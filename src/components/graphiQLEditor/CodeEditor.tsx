import styles from './GraphiQLEditor.module.css';
import CodeMirror, { EditorView } from '@uiw/react-codemirror';

type CodeEditorPropsType = {
  data: string;
  onChange: (data: string) => void;
  useDefaultSettings?: boolean;
  className?: string;
};

const CodeEditor: React.FC<CodeEditorPropsType> = ({
  data,
  onChange,
  useDefaultSettings = false,
  className = '',
}) => {
  const defaultSettings = {
    highlightActiveLine: true,
    autocompletion: true,
    foldGutter: true,
    dropCursor: true,
    allowMultipleSelections: true,
    indentOnInput: true,
    bracketMatching: true,
    closeBrackets: true,
    lintKeymap: true,
  };

  const customSettings = {
    ...defaultSettings,
  };

  return (
    <CodeMirror
      className={`${styles.myCodeMirror} ${className}`} // Merge default and custom class names
      style={{
        textAlign: 'start',
        whiteSpace: 'pre-wrap',
        wordBreak: 'normal',
        wordWrap: 'break-word',
      }}
      value={data}
      extensions={[EditorView.lineWrapping]}
      onChange={onChange}
      basicSetup={useDefaultSettings ? defaultSettings : customSettings}
      width="auto"
      minHeight="10rem"
    />
  );
};

export default CodeEditor;
