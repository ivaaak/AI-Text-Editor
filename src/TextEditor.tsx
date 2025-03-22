import React from 'react';
import styles from './TextEditor.module.css';

interface TextEditorProps {
  text: string;
  onTextChange: (newText: string) => void;
}

const TextEditor: React.FC<TextEditorProps> = ({ text, onTextChange }) => {
  return (
    <div className={styles.editorWrapper}>
      <h2 className={styles.sectionTitle}>Text editor</h2>
      <div className={styles.editorContainer}>
        <textarea
          className={styles.editor}
          value={text}
          onChange={(e) => onTextChange(e.target.value)}
          placeholder="Text you are editing"
        />
      </div>
    </div>
  );
};

export default TextEditor;