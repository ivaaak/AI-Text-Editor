import React, { useState } from 'react';
import { FileText, Save, Settings, User, Plus, FileDown, FileUp } from 'lucide-react';
import styles from './Header.module.css';
import { Document } from './App';

interface HeaderProps {
  documents: Document[];
  currentDocId: number;
  onCreateNew: () => void;
  onLoadDocument: (id: number) => void;
  onUpdateName: (id: number, name: string) => void;
}

const Header: React.FC<HeaderProps> = ({ 
  documents, 
  currentDocId, 
  onCreateNew,
  onLoadDocument,
  onUpdateName
}) => {
  const [showDocList, setShowDocList] = useState<boolean>(false);
  const currentDoc = documents.find(doc => doc.id === currentDocId);
  
  return (
    <header className={styles.header}>
      <div className={styles.leftSection}>
        <div className={styles.appLogo}>
          <FileText size={24} />
          <h1 className={styles.appName}>AI Writer</h1>
        </div>
        <button className={styles.iconButton} onClick={onCreateNew}>
          <Plus size={20} />
        </button>
        <div className={styles.documentSelector}>
          <input 
            type="text" 
            className={styles.documentTitle} 
            value={currentDoc?.name || 'Untitled Document'} 
            onChange={(e) => onUpdateName(currentDocId, e.target.value)}
            onClick={() => setShowDocList(!showDocList)}
          />
          {showDocList && (
            <div className={styles.documentList}>
              {documents.map(doc => (
                <div 
                  key={doc.id} 
                  className={`${styles.documentItem} ${currentDocId === doc.id ? styles.active : ''}`}
                  onClick={() => {
                    onLoadDocument(doc.id);
                    setShowDocList(false);
                  }}
                >
                  {doc.name}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      
      <div className={styles.rightSection}>
        <button className={styles.iconButton} title="Download document">
          <FileDown size={20} />
        </button>
        <button className={styles.iconButton} title="Upload document">
          <FileUp size={20} />
        </button>
        <button className={styles.iconButton}>
          <Save size={20} />
        </button>
        <button className={styles.iconButton}>
          <Settings size={20} />
        </button>
        <div className={styles.userProfile}>
          <User size={20} />
        </div>
      </div>
    </header>
  );
};

export default Header;