import React, { useState } from 'react';
import { 
  Lightbulb, 
  Edit, 
  Wand2, 
  Languages, 
  FileText, 
  RefreshCw, 
  Send,
  Loader
} from 'lucide-react';
import styles from './AIPanel.module.css';
import { AIMode } from './App';

interface AIPanelProps {
  aiSuggestion: string;
  applyAiSuggestion: () => void;
  aiMode: AIMode;
  setAiMode: React.Dispatch<React.SetStateAction<AIMode>>;
  generateAIResponse: (prompt: string, mode?: AIMode) => Promise<void>;
  isProcessing: boolean;
}

const AIPanel: React.FC<AIPanelProps> = ({ 
  aiSuggestion, 
  applyAiSuggestion, 
  aiMode, 
  setAiMode,
  generateAIResponse,
  isProcessing
}) => {
  const [promptText, setPromptText] = useState<string>('');
  const [translateLanguage, setTranslateLanguage] = useState<string>('Spanish');
  const [rewriteStyle, setRewriteStyle] = useState<string>('more professionally');
  
  const handleModeChange = (mode: AIMode) => {
    setAiMode(mode);
    if (mode === 'suggestion' || mode === 'completion' || mode === 'edit' || mode === 'summarize') {
      // These modes don't need additional input, so generate immediately
      generateAIResponse('', mode);
    }
  };
  
  const handleTranslate = () => {
    generateAIResponse(translateLanguage, 'translate');
  };
  
  const handleRewrite = () => {
    generateAIResponse(rewriteStyle, 'rewrite');
  };
  
  const handlePromptSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (promptText.trim()) {
      generateAIResponse(promptText);
      setPromptText('');
    }
  };
  
  return (
    <div className={styles.aiPanel}>
      <div className={styles.aiSection}>
        <h2 className={styles.sectionTitle}>AI Section</h2>
        <div className={styles.aiContent}>
          <div className={styles.aiPreview}>
            {isProcessing ? (
              <div className={styles.loadingIndicator}>
                <Loader size={24} className={styles.spinner} />
                <span>Generating...</span>
              </div>
            ) : (
              aiSuggestion || ''
            )}
          </div>
          <div className={styles.previewActions}>
            <button 
              className={styles.applyButton}
              onClick={applyAiSuggestion}
              disabled={!aiSuggestion || isProcessing}
            >
              Apply to Editor
            </button>
          </div>
        </div>
      </div>
      
      <div className={styles.aiSection}>
        <h2 className={styles.sectionTitle}>AI Text editing tools</h2>
        <div className={styles.aiTools}>
          <div className={styles.toolsGrid}>
            <button 
              className={`${styles.toolButton} ${aiMode === 'suggestion' ? styles.active : ''}`}
              onClick={() => handleModeChange('suggestion')}
              disabled={isProcessing}
            >
              <Lightbulb size={16} />
              <span>Suggestions</span>
            </button>
            <button 
              className={`${styles.toolButton} ${aiMode === 'completion' ? styles.active : ''}`}
              onClick={() => handleModeChange('completion')}
              disabled={isProcessing}
            >
              <Wand2 size={16} />
              <span>Complete</span>
            </button>
            <button 
              className={`${styles.toolButton} ${aiMode === 'edit' ? styles.active : ''}`}
              onClick={() => handleModeChange('edit')}
              disabled={isProcessing}
            >
              <Edit size={16} />
              <span>Edit & Improve</span>
            </button>
            <button 
              className={`${styles.toolButton} ${aiMode === 'summarize' ? styles.active : ''}`}
              onClick={() => handleModeChange('summarize')}
              disabled={isProcessing}
            >
              <FileText size={16} />
              <span>Summarize</span>
            </button>
          </div>
          
          <div className={styles.advancedTools}>
            <div className={`${styles.toolGroup} ${aiMode === 'translate' ? styles.active : ''}`}>
              <div className={styles.toolGroupHeader} onClick={() => setAiMode('translate')}>
                <Languages size={16} />
                <span>Translate</span>
              </div>
              {aiMode === 'translate' && (
                <div className={styles.toolGroupContent}>
                  <select 
                    className={styles.selectInput}
                    value={translateLanguage}
                    onChange={(e) => setTranslateLanguage(e.target.value)}
                    disabled={isProcessing}
                  >
                    <option value="Spanish">Spanish</option>
                    <option value="French">French</option>
                    <option value="German">German</option>
                    <option value="Chinese">Chinese</option>
                    <option value="Japanese">Japanese</option>
                    <option value="Russian">Russian</option>
                  </select>
                  <button 
                    className={styles.actionButton}
                    onClick={handleTranslate}
                    disabled={isProcessing}
                  >
                    Translate
                  </button>
                </div>
              )}
            </div>
            
            <div className={`${styles.toolGroup} ${aiMode === 'rewrite' ? styles.active : ''}`}>
              <div className={styles.toolGroupHeader} onClick={() => setAiMode('rewrite')}>
                <RefreshCw size={16} />
                <span>Rewrite</span>
              </div>
              {aiMode === 'rewrite' && (
                <div className={styles.toolGroupContent}>
                  <select 
                    className={styles.selectInput}
                    value={rewriteStyle}
                    onChange={(e) => setRewriteStyle(e.target.value)}
                    disabled={isProcessing}
                  >
                    <option value="more professionally">More professionally</option>
                    <option value="more casually">More casually</option>
                    <option value="more concisely">More concisely</option>
                    <option value="to be more engaging">More engaging</option>
                    <option value="to be more persuasive">More persuasive</option>
                    <option value="to simplify the language">Simplify</option>
                  </select>
                  <button 
                    className={styles.actionButton}
                    onClick={handleRewrite}
                    disabled={isProcessing}
                  >
                    Rewrite
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      <div className={styles.aiSection}>
        <h2 className={styles.sectionTitle}>AI Prompt / chat</h2>
        <form className={styles.aiPrompt} onSubmit={handlePromptSubmit}>
          <input 
            type="text" 
            className={styles.promptInput}
            placeholder="Ask AI to help with your text..."
            value={promptText}
            onChange={(e) => setPromptText(e.target.value)}
            disabled={isProcessing}
          />
          <button 
            type="submit" 
            className={styles.sendButton}
            disabled={isProcessing || !promptText.trim()}
          >
            <Send size={16} />
          </button>
        </form>
      </div>
    </div>
  );
};

export default AIPanel;