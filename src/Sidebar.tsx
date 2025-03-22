import React from 'react';
import { PlusCircle, File, Trash } from 'lucide-react';
import styles from './Sidebar.module.css';
import { Document } from './App';

interface SidebarProps {
  documents: Document[];
  setDocuments: React.Dispatch<React.SetStateAction<Document[]>>;
  currentDocId: number;
  setCurrentDocId: React.Dispatch<React.SetStateAction<number>>;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  documents, 
  setDocuments, 
  currentDocId, 
  setCurrentDocId 
}) => {
  const createNewDocument = (): void => {
    const newId = Math.max(...documents.map(doc => doc.id), 0) + 1;
    const newDoc: Document = {
        id: newId, name: `Untitled Document ${newId}`,
        content: ''
    };
    setDocuments([...documents, newDoc]);
    setCurrentDocId(newId);
  };

  const deleteDocument = (id: number, event: React.MouseEvent): void => {
    event.stopPropagation();
    const filteredDocs = documents.filter(doc => doc.id !== id);
    setDocuments(filteredDocs);
    if (currentDocId === id && filteredDocs.length > 0) {
      setCurrentDocId(filteredDocs[0].id);
    }
  };

  return (
    <div className={styles.sidebar}>
      <div className={styles.sidebarHeader}>
        <h2>Documents</h2>
        <button onClick={createNewDocument} className={styles.createButton}>
          <PlusCircle size={16} />
          <span>New</span>
        </button>
      </div>
      
      <div className={styles.documentList}>
        {documents.map(doc => (
          <div 
            key={doc.id} 
            className={`${styles.documentItem} ${currentDocId === doc.id ? styles.active : ''}`}
            onClick={() => setCurrentDocId(doc.id)}
          >
            <File size={16} />
            <span className={styles.documentName}>{doc.name}</span>
            {documents.length > 1 && (
              <button 
                className={styles.deleteButton}
                onClick={(e) => deleteDocument(doc.id, e)}
              >
                <Trash size={16} />
              </button>
            )}
          </div>
        ))}
      </div>
      
      <div className={styles.sidebarFooter}>
        <h3>Templates</h3>
        <div className={styles.templateItem}>Blog Post</div>
        <div className={styles.templateItem}>Business Letter</div>
        <div className={styles.templateItem}>Essay</div>
      </div>
    </div>
  );
};

export default Sidebar;