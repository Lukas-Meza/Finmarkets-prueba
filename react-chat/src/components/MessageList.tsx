import { useEffect, useMemo, useRef } from 'react';
import { useChat } from '../hooks/useChat';
import { SOFT_BUBBLE_COLORS } from '../hooks/useChat';

export function MessageList() {
  const { messages, effectiveUsername } = useChat();
  const containerRef = useRef<HTMLDivElement | null>(null);

  const otherUserColorIndex = useMemo(() => {
    const others = [...new Set(messages.map((m) => m.user).filter((u) => u !== effectiveUsername))].sort();
    const map = new Map<string, number>();
    others.forEach((u, i) => map.set(u, i));
    return map;
  }, [messages, effectiveUsername]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  }, [messages]);

  return (
    <div ref={containerRef} className="messages-container">
      {messages.map((m) => {
        const isOwn = m.user === effectiveUsername;
        const colorIndex = otherUserColorIndex.get(m.user);
        const softColor = colorIndex !== undefined ? SOFT_BUBBLE_COLORS[colorIndex % SOFT_BUBBLE_COLORS.length] : null;
        return (
          <div
            key={m.id}
            className={`message-row ${isOwn ? 'message-row--own' : ''}`}
          >
            <div className="avatar">
              {m.user
                .split(' ')
                .map((part) => part[0])
                .join('')
                .toUpperCase()}
            </div>
            <div
              className="bubble"
              style={
                !isOwn && softColor
                  ? { backgroundColor: softColor.bg, borderColor: softColor.border }
                  : undefined
              }
            >
              <div className="bubble-header">
                <span className="bubble-user">{m.user}</span>
                <span className="bubble-time">
                  {new Date(m.createdAt).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
              <div className="bubble-text">{m.text}</div>
            </div>
          </div>
        );
      })}
      {messages.length === 0 && (
        <p className="empty-state">Todavía no hay mensajes. ¡Escribe el primero!</p>
      )}
    </div>
  );
}

