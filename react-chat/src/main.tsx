import React from 'react';
import ReactDOM from 'react-dom/client';
import './style.css';
import { ChatProvider } from './hooks/useChat';
import { ResetChatButton } from './components/ResetChatButton';
import { ConnectionIndicator } from './components/ConnectionIndicator';
import { UsernameInput } from './components/UsernameInput';
import { MessageList } from './components/MessageList';
import { MessageInput } from './components/MessageInput';

function ChatApp() {
  return (
    <div className="app-shell">
      <header className="header">
        <h1>Chat (React)</h1>
        <div className="header-actions">
          <ResetChatButton />
          <ConnectionIndicator />
        </div>
      </header>
      <UsernameInput />
      <MessageList />
      <MessageInput />
    </div>
  );
}

const rootElement = document.getElementById('root') as HTMLElement;

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <ChatProvider>
      <ChatApp />
    </ChatProvider>
  </React.StrictMode>,
);

