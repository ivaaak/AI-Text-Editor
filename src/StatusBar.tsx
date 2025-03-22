import React from 'react';
import styles from './StatusBar.module.css';

interface StatusBarProps {
  text: string;
}

const StatusBar: React.FC<StatusBarProps> = ({ text }) => {
  const wordCount = text.split(/\s+/).filter(Boolean).length;
  const charCount = text.length;
  
  return (
    <div className={styles.statusBar}>
      <div className={styles.counts}>
        <span>{wordCount} words</span>
        <span>{charCount} characters</span>
      </div>
      <div className={styles.status}>
        <span>Saved</span>
      </div>
    </div>
  );
};

export default StatusBar;
