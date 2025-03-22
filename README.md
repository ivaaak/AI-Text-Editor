# AI Powered Text Editor - React / ClaudeSDK 
A Web App built with React as a Frontend. It uses the Anthropic [Claude SDK](https://docs.anthropic.com/en/api/client-sdks) for editing and improving the writing experience - an IDE designed for writing and text editing.

**Screenshots:**
<img src="https://github.com/ivaaak/AI-Text-Editor/blob/main/screenshots/1.png?raw=true"></img>
<img src="https://github.com/ivaaak/AI-Text-Editor/blob/main/screenshots/2.png?raw=true"></img>
<img src="https://github.com/ivaaak/AI-Text-Editor/blob/main/screenshots/2.png?raw=true"></img>

**Features**

- Text Editing: Create and edit documents with a clean, modern interface
- Document Management: Create multiple documents and switch between them
- AI Assistance: Leverage Claude's capabilities to enhance your writing

- Suggestions: Get improvement suggestions for your text
- Completions: Have Claude continue your writing with AI-generated text (with streaming!)
- Edits: Automatically improve your text
- Summarization: Generate concise summaries of longer content
- Translation: Translate your text to different languages
- Rewriting: Rewrite content in different styles
- Custom Prompts: Ask Claude anything about your text

**Setup**
Claude API Key
This application requires a Claude API key to function. You have two ways to provide it:

Through the UI: The application will prompt you to enter your API key
LocalStorage: Your API key is securely stored in your browser's localStorage

Your API key never leaves your browser and is not sent to any server other than Claude's API.

**Getting a Claude API Key**

Sign up for an Anthropic account at console.anthropic.com
Generate an API key in your account settings
Enter the key in the application when prompted

You can run the below commands from the base directory and start the project:
```cmd
npm i
npm run dev
```

This installs and starts the app.

### Built With:
-  [**✔**]  `React (Vite, Typescript)`
-  [**✔**]  `Claude SDK / API`
