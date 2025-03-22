export interface ClaudeOptions {
    apiKey: string;
    sessionId: string;
    baseUrl?: string;
    model?: string;
  }
  
  export interface ClaudeMessage {
    role: 'user' | 'assistant';
    content: string;
  }
  
  export interface ClaudeResponse {
    content: string;
    id: string;
    model: string;
    usage?: {
      input_tokens: number;
      output_tokens: number;
    };
  }
  
  export interface ClaudeError {
    status: number;
    message: string;
    type?: string;
  }
  
  export interface ClaudeRequestOptions {
    stream?: boolean;
    temperature?: number;
    maxTokens?: number;
    system?: string;
  }