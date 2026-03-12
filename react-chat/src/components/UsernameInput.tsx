import { useChat } from '../hooks/useChat';

export function UsernameInput() {
  const { username, setUsername } = useChat();

  return (
    <div className="username-row">
      <label className="username-label">
        Nombre:
        <input
          className="text-input"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      </label>
    </div>
  );
}

