import { useChat } from '../hooks/useChat';

export function ConnectionIndicator() {
  const { status } = useChat();

  const label =
    status === 'connected'
      ? 'Conectado'
      : status === 'connecting'
      ? 'Conectando...'
      : 'Desconectado';

  const color =
    status === 'connected'
      ? '#16a34a'
      : status === 'connecting'
      ? '#eab308'
      : '#dc2626';

  return (
    <div className="status-row">
      <span className="status-dot" style={{ backgroundColor: color }} />
      <span className="status-text">{label}</span>
    </div>
  );
}

