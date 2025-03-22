import axios, { AxiosInstance } from 'axios';
import { ClaudeMessage, ClaudeOptions, ClaudeRequestOptions, ClaudeResponse, ClaudeError } from '../types';

export class Claude {
    private client: AxiosInstance;
    sessionId: string;
    private model: string;
    private messageHistory: ClaudeMessage[] = [];

    constructor(options: ClaudeOptions) {
        this.sessionId = options.sessionId;
        this.model = options.model || 'claude-3-opus-20240229';

        this.client = axios.create({
            baseURL: options.baseUrl || 'https://api.anthropic.com/v1',
            headers: {
                'x-api-key': options.apiKey,
                'anthropic-version': '2023-06-01',
                'Content-Type': 'application/json'
            }
        });
    }

    /**
     * Send a message to Claude and get a response
     */
    async message(content: string, options: ClaudeRequestOptions = {}): Promise<ClaudeResponse> {
        try {
            // Add user message to history
            this.messageHistory.push({ role: 'user', content });

            const requestData = {
                model: this.model,
                messages: this.messageHistory,
                temperature: options.temperature ?? 0.7,
                max_tokens: options.maxTokens ?? 4096,
                system: options.system,
                stream: options.stream ?? false
            };

            const response = await this.client.post('/messages', requestData);

            // Add assistant response to history
            const assistantMessage = response.data.content[0].text;
            this.messageHistory.push({ role: 'assistant', content: assistantMessage });

            return {
                content: assistantMessage,
                id: response.data.id,
                model: response.data.model,
                usage: response.data.usage
            };
        } catch (error) {
            return this.handleError(error);
        }
    }

    /**
     * Stream a response from Claude
     */
    async streamMessage(
        content: string,
        onUpdate: (chunk: string) => void,
        onComplete: (response: ClaudeResponse) => void,
        options: ClaudeRequestOptions = {}
    ): Promise<void> {
        try {
            // Add user message to history
            this.messageHistory.push({ role: 'user', content });

            const requestData = {
                model: this.model,
                messages: this.messageHistory,
                temperature: options.temperature ?? 0.7,
                max_tokens: options.maxTokens ?? 4096,
                system: options.system,
                stream: true
            };

            const response = await this.client.post('/messages', requestData, {
                responseType: 'stream'
            });

            let fullContent = '';
            let messageId = '';
            let modelUsed = this.model;

            response.data.on('data', (chunk: Buffer) => {
                const lines = chunk.toString().split('\n').filter(line => line.trim() !== '');

                for (const line of lines) {
                    if (line.startsWith('data: ')) {
                        const data = JSON.parse(line.replace('data: ', ''));

                        if (data.type === 'content_block_delta') {
                            const textDelta = data.delta.text || '';
                            fullContent += textDelta;
                            onUpdate(textDelta);
                        }

                        if (data.message_id) {
                            messageId = data.message_id;
                        }

                        if (data.model) {
                            modelUsed = data.model;
                        }
                    }
                }
            });

            response.data.on('end', () => {
                // Add assistant response to history
                this.messageHistory.push({ role: 'assistant', content: fullContent });

                onComplete({
                    content: fullContent,
                    id: messageId,
                    model: modelUsed
                });
            });
        } catch (error) {
            this.handleError(error);
        }
    }

    /**
     * Clear the message history
     */
    clearHistory(): void {
        this.messageHistory = [];
    }

    /**
     * Get the current message history
     */
    getMessageHistory(): ClaudeMessage[] {
        return [...this.messageHistory];
    }

    /**
     * Set a custom message history
     */
    setMessageHistory(history: ClaudeMessage[]): void {
        this.messageHistory = [...history];
    }

    /**
     * Change the model being used
     */
    setModel(model: string): void {
        this.model = model;
    }

    /**
     * Handle API errors
     */
    private handleError(error: any): never {
        const claudeError: ClaudeError = {
            status: error.response?.status || 500,
            message: error.response?.data?.error?.message || error.message || 'Unknown error',
            type: error.response?.data?.error?.type
        };

        throw claudeError;
    }
}

// Additional text editor specific utilities

export class ClaudeTextEditor {
    private claude: Claude;

    constructor(claude: Claude) {
        this.claude = claude;
    }

    /**
     * Summarize text using Claude
     */
    async summarize(text: string): Promise<string> {
        const prompt = `Please summarize the following text:\n\n${text}`;
        const response = await this.claude.message(prompt);
        return response.content;
    }

    /**
     * Provide suggestions for improving text
     */
    async suggest(text: string): Promise<string> {
        const prompt = `I'm writing the following text. Please provide suggestions to improve it:\n\n${text}`;
        const response = await this.claude.message(prompt);
        return response.content;
    }

    /**
     * Complete the given text
     */
    async complete(text: string): Promise<string> {
        const prompt = `Please continue the following text in the same style:\n\n${text}`;
        const response = await this.claude.message(prompt);
        return response.content;
    }

    /**
     * Edit and improve the given text
     */
    async edit(text: string): Promise<string> {
        const prompt = `Please edit and improve the following text:\n\n${text}\n\nProvide the full edited version.`;
        const response = await this.claude.message(prompt);
        return response.content;
    }

    /**
     * Translate text to a different language
     */
    async translate(text: string, language: string): Promise<string> {
        const prompt = `Please translate the following text to ${language}:\n\n${text}`;
        const response = await this.claude.message(prompt);
        return response.content;
    }

    /**
     * Rewrite text in a different style
     */
    async rewrite(text: string, style: string): Promise<string> {
        const prompt = `Please rewrite the following text ${style}:\n\n${text}`;
        const response = await this.claude.message(prompt);
        return response.content;
    }

    /**
     * Process a custom prompt with the given text
     */
    async processCustomPrompt(text: string, customPrompt: string): Promise<string> {
        const prompt = `${customPrompt}\n\n${text}`;
        const response = await this.claude.message(prompt);
        return response.content;
    }
}

// Factory function to create Claude service
export function createClaudeService(options: ClaudeOptions): {
    claude: Claude;
    textEditor: ClaudeTextEditor;
} {
    const claude = new Claude(options);
    const textEditor = new ClaudeTextEditor(claude);

    return { claude, textEditor };
}