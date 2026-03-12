import { useChat } from '../hooks/useChat';

export function ResetChatButton() {
  const { resetChat, messages } = useChat();
  if (messages.length === 0) return null;

  return (
    <button type="button" className="reset-chat-button" onClick={resetChat}>
      Resetear chat
    </button>
  );
}

