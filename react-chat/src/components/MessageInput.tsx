import { FormEvent, useState } from 'react';
import { useChat } from '../hooks/useChat';

export function MessageInput() {
  const { sendMessage, status } = useChat();
  const [text, setText] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    sendMessage(text);
    setText('');
  };

  const disabled = status !== 'connected';

  return (
    <form className="input-row" onSubmit={handleSubmit}>
      <input
        className="text-input"
        placeholder={
          disabled ? 'Conectando al servidor...' : 'Escribe un mensaje'
        }
        value={text}
        onChange={(e) => setText(e.target.value)}
        disabled={disabled}
      />
      <button className="send-button" type="submit" disabled={disabled}>
        Enviar
      </button>
    </form>
  );
}

