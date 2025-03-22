import React, { useState, useEffect } from 'react';
import Header from './Header';
import TextEditor from './TextEditor';
import AIPanel from './AIPanel';
import ApiKeyProvider from './ApiKeyProvider';
import styles from './App.module.css';
import { Claude, ClaudeTextEditor, createClaudeService } from './services/claude-sdk';

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
  const [textEditor, setTextEditor] = useState<ClaudeTextEditor | null>(null);
  const [isStreaming, setIsStreaming] = useState<boolean>(false);
  const [streamContent, setStreamContent] = useState<string>('');
  const [apiKeySet, setApiKeySet] = useState<boolean>(false);

  // Initialize Claude client when API key is set
  const initializeClaudeClient = (apiKey: string) => {
    if (!apiKey) {
      console.error('No API key provided');
      return;
    }
    
    try {
      const { claude, textEditor } = createClaudeService({
        apiKey,
        sessionId: `ai-text-editor-${Date.now()}`,
        model: 'claude-3-opus-20240229'
      });
      
      setClaudeClient(claude);
      setTextEditor(textEditor);
      setApiKeySet(true);
      console.log('Claude client initialized successfully');
    } catch (error) {
      console.error('Failed to initialize Claude client:', error);
    }
  };

  // Check for stored API key on component mount
  useEffect(() => {
    const storedApiKey = localStorage.getItem('ANTHROPIC_API_KEY');
    if (storedApiKey) {
      initializeClaudeClient(storedApiKey);
    }
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
    if (!claudeClient || !textEditor) {
      console.error('Claude service not initialized');
      return;
    }
    
    const mode = customMode || aiMode;
    setIsProcessing(true);
    setAiSuggestion('');
    
    try {
      let response: string = '';
      
      switch (mode) {
        case 'suggestion':
          response = await textEditor.suggest(text);
          break;
        case 'completion':
          // For completion, we'll use streaming to provide a better UX
          setIsStreaming(true);
          setStreamContent('');
          
          await claudeClient.streamMessage(
            `Please continue the following text in the same style:\n\n${text}`,
            (chunk) => {
              setStreamContent(prev => prev + chunk);
            },
            (fullResponse) => {
              setAiSuggestion(fullResponse.content);
              setIsStreaming(false);
            }
          );
          return;
        case 'edit':
          response = await textEditor.edit(text);
          break;
        case 'summarize':
          response = await textEditor.summarize(text);
          break;
        case 'rewrite':
          response = await textEditor.rewrite(text, prompt);
          break;
        case 'translate':
          response = await textEditor.translate(text, prompt);
          break;
        default:
          response = await textEditor.processCustomPrompt(text, prompt);
      }
      
      setAiSuggestion(response);
    } catch (error) {
      console.error('Error generating AI response:', error);
      setAiSuggestion('Sorry, there was an error generating a response. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const applyAiSuggestion = (): void => {
    // If we're streaming, use the current stream content
    const contentToApply = isStreaming ? streamContent : aiSuggestion;
    
    if (isStreaming) {
      // If we're in completion mode, append the suggestion to the current text
      const newText = text + contentToApply;
      setText(newText);
      
      // Update the current document
      const updatedDocs = documents.map(doc => 
        doc.id === currentDocId ? { ...doc, content: newText } : doc
      );
      setDocuments(updatedDocs);
    } else {
      // For other modes, replace the content
      setText(contentToApply);
      
      // Update the current document
      const updatedDocs = documents.map(doc => 
        doc.id === currentDocId ? { ...doc, content: contentToApply } : doc
      );
      setDocuments(updatedDocs);
    }
  };

  const stopStreaming = (): void => {
    setIsStreaming(false);
    setAiSuggestion(streamContent);
  };

  const createNewDocument = (): void => {
    const newId = Math.max(...documents.map(doc => doc.id), 0) + 1;
    const newDoc: Document = { id: newId, name: `Untitled Document ${newId}`, content: '' };
    setDocuments([...documents, newDoc]);
    setCurrentDocId(newId);
    setText('');
    setAiSuggestion('');
    setStreamContent('');
    
    // Clear the Claude conversation history when creating a new document
    if (claudeClient) {
      claudeClient.clearHistory();
    }
  };

  const loadDocument = (id: number): void => {
    const doc = documents.find(doc => doc.id === id);
    if (doc) {
      setText(doc.content);
      setCurrentDocId(id);
      setAiSuggestion('');
      setStreamContent('');
      
      // Clear the Claude conversation history when switching documents
      if (claudeClient) {
        claudeClient.clearHistory();
      }
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
      {!apiKeySet && <ApiKeyProvider onApiKeySet={initializeClaudeClient} />}
      
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
          {!apiKeySet ? (
            <div className={styles.aiSectionPlaceholder}>
              <h2>AI Features</h2>
              <p>Please set your Claude API key to enable AI features</p>
            </div>
          ) : (
            <AIPanel 
              aiSuggestion={isStreaming ? streamContent : aiSuggestion} 
              applyAiSuggestion={applyAiSuggestion}
              aiMode={aiMode}
              setAiMode={setAiMode}
              generateAIResponse={generateAIResponse}
              isProcessing={isProcessing}
              isStreaming={isStreaming}
              stopStreaming={stopStreaming}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default App;