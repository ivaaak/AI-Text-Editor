import React, { useState, useEffect } from 'react';
import styles from './ApiKeyProvider.module.css';

interface ApiKeyProviderProps {
  onApiKeySet: (apiKey: string) => void;
}

const ApiKeyProvider: React.FC<ApiKeyProviderProps> = ({ onApiKeySet }) => {
  const [apiKey, setApiKey] = useState<string>('');
  const [showForm, setShowForm] = useState<boolean>(true);

  useEffect(() => {
    // Check if API key is stored in localStorage
    const storedApiKey = localStorage.getItem('ANTHROPIC_API_KEY');
    if (storedApiKey) {
      setApiKey(storedApiKey);
      setShowForm(false);
      onApiKeySet(storedApiKey);
    }
  }, [onApiKeySet]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (apiKey.trim()) {
      localStorage.setItem('ANTHROPIC_API_KEY', apiKey);
      onApiKeySet(apiKey);
      setShowForm(false);
    }
  };

  const handleReset = () => {
    localStorage.removeItem('ANTHROPIC_API_KEY');
    setApiKey('');
    setShowForm(true);
  };

  if (!showForm) {
    return (
      <div className={styles.apiKeyBadge}>
        <span>Claude API Key: Set ✓</span>
        <button className={styles.resetButton} onClick={handleReset}>
          Reset
        </button>
      </div>
    );
  }

  return (
    <div className={styles.apiKeyContainer}>
      <div className={styles.apiKeyForm}>
        <h2>Enter your Claude API Key</h2>
        <p>
          Your API key will be stored in your browser's local storage and used for communicating with the Claude API.
          The key never leaves your browser or gets sent to our servers.
        </p>
        <form onSubmit={handleSubmit}>
          <input
            type="password"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="Enter your Anthropic API key"
            className={styles.apiKeyInput}
            required
          />
          <button type="submit" className={styles.submitButton}>
            Save API Key
          </button>
        </form>
        <div className={styles.infoText}>
          <p>
            Don't have an API key? Get one from{" "}
            <a
              href="https://console.anthropic.com/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Anthropic Console
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ApiKeyProvider;