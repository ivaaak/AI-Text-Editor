import React, { useState, useEffect } from 'react';
import Header from './Header';
import TextEditor from './TextEditor';
import AIPanel from './AIPanel';
import { Claude } from './services/claude-sdk';
import styles from './App.module.css';

export interface Document {
  id: number;
  name: string;
  content: string;
}

export type AIMode = 'suggestion' | 'completion' | 'edit' | 'summarize' | 'rewrite' | 'translate';

const App: React.FC = () => {
  const [text, setText] = useState<string>('');
  const [aiSuggestion, setAiSuggestion] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [documents, setDocuments] = useState<Document[]>([{ id: 1, name: 'Untitled Document', content: '' }]);
  const [currentDocId, setCurrentDocId] = useState<number>(1);
  const [aiMode, setAiMode] = useState<AIMode>('suggestion');
  const [claudeClient, setClaudeClient] = useState<Claude | null>(null);

  // Initialize Claude client
  useEffect(() => {
    const client = new Claude({
      apiKey: process.env.ANTHROPIC_API_KEY || '',
      sessionId: 'ai-text-editor-session'
    });
    setClaudeClient(client);
  }, []);

  const handleTextChange = (newText: string): void => {
    setText(newText);
    
    // Update the current document
    const updatedDocs = documents.map(doc => 
      doc.id === currentDocId ? { ...doc, content: newText } : doc
    );
    setDocuments(updatedDocs);
  };

  const generateAIResponse = async (prompt: string, customMode?: AIMode): Promise<void> => {
    if (!claudeClient) return;
    
    const mode = customMode || aiMode;
    setIsProcessing(true);
    
    try {
      let promptTemplate = '';
      
      switch (mode) {
        case 'suggestion':
          promptTemplate = `I'm writing the following text. Please provide suggestions to improve it:\n\n${text}`;
          break;
        case 'completion':
          promptTemplate = `Please continue the following text in the same style:\n\n${text}`;
          break;
        case 'edit':
          promptTemplate = `Please edit and improve the following text:\n\n${text}\n\nProvide the full edited version.`;
          break;
        case 'summarize':
          promptTemplate = `Please summarize the following text:\n\n${text}`;
          break;
        case 'rewrite':
          promptTemplate = `Please rewrite the following text ${prompt}:\n\n${text}`;
          break;
        case 'translate':
          promptTemplate = `Please translate the following text to ${prompt}:\n\n${text}`;
          break;
        default:
          promptTemplate = prompt || `Please help me with this text:\n\n${text}`;
      }
      
      const response = await claudeClient.message(promptTemplate);
      setAiSuggestion(response.content);
    } catch (error) {
      console.error('Error generating AI response:', error);
      setAiSuggestion('Sorry, there was an error generating a response. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const applyAiSuggestion = (): void => {
    setText(aiSuggestion);
    
    // Update the current document
    const updatedDocs = documents.map(doc => 
      doc.id === currentDocId ? { ...doc, content: aiSuggestion } : doc
    );
    setDocuments(updatedDocs);
  };

  const createNewDocument = (): void => {
    const newId = Math.max(...documents.map(doc => doc.id), 0) + 1;
    const newDoc: Document = { id: newId, name: `Untitled Document ${newId}`, content: '' };
    setDocuments([...documents, newDoc]);
    setCurrentDocId(newId);
    setText('');
    setAiSuggestion('');
  };

  const loadDocument = (id: number): void => {
    const doc = documents.find(doc => doc.id === id);
    if (doc) {
      setText(doc.content);
      setCurrentDocId(id);
      setAiSuggestion('');
    }
  };

  const updateDocumentName = (id: number, name: string): void => {
    const updatedDocs = documents.map(doc => 
      doc.id === id ? { ...doc, name } : doc
    );
    setDocuments(updatedDocs);
  };

  return (
    <div className={styles.app}>
      <Header 
        documents={documents} 
        currentDocId={currentDocId} 
        onCreateNew={createNewDocument}
        onLoadDocument={loadDocument}
        onUpdateName={updateDocumentName}
      />
      <div className={styles.mainContainer}>
        <div className={styles.editorSection}>
          <TextEditor text={text} onTextChange={handleTextChange} />
        </div>
        <div className={styles.aiSection}>
          <AIPanel 
            aiSuggestion={aiSuggestion} 
            applyAiSuggestion={applyAiSuggestion} 
            aiMode={aiMode}
            setAiMode={setAiMode}
            generateAIResponse={generateAIResponse}
            isProcessing={isProcessing}
          />
        </div>
      </div>
    </div>
  );
};

export default App;