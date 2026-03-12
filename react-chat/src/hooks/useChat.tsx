import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import {
  socketService,
  type ChatMessage,
  type ConnectionStatus,
} from '../services/socket';

type ChatContextValue = {
  messages: ChatMessage[];
  status: ConnectionStatus;
  username: string;
  effectiveUsername: string;
  setUsername: (name: string) => void;
  sendMessage: (text: string) => void;
  resetChat: () => void;
};

const ChatContext = createContext<ChatContextValue | undefined>(undefined);

const USERNAME_STORAGE_KEY = 'react-chat:username';
const MESSAGES_STORAGE_KEY = 'react-chat:messages';

const SOFT_BUBBLE_COLORS: { bg: string; border: string }[] = [
  { bg: '#e0f2fe', border: '#7dd3fc' },
  { bg: '#fce7f3', border: '#f9a8d4' },
  { bg: '#d1fae5', border: '#6ee7b7' },
  { bg: '#fef3c7', border: '#fcd34d' },
  { bg: '#ede9fe', border: '#a78bfa' },
  { bg: '#ffedd5', border: '#fdba74' },
  { bg: '#f3e8ff', border: '#c084fc' },
  { bg: '#ccfbf1', border: '#5eead4' },
];

export function ChatProvider({ children }: { children: ReactNode }) {
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    const stored = window.localStorage.getItem(MESSAGES_STORAGE_KEY);
    if (!stored) return [];
    try {
      return JSON.parse(stored) as ChatMessage[];
    } catch {
      return [];
    }
  });

  const [status, setStatus] = useState<ConnectionStatus>('disconnected');
  const [username, setUsernameState] = useState<string>(() => {
    const stored = window.localStorage.getItem(USERNAME_STORAGE_KEY);
    return stored ?? '';
  });

  const randomFallbackRef = useRef(`User-${Math.floor(Math.random() * 1000)}`);
  const effectiveUsername = username.trim() || randomFallbackRef.current;

  useEffect(() => {
    window.localStorage.setItem(USERNAME_STORAGE_KEY, username);
  }, [username]);

  useEffect(() => {
    window.localStorage.setItem(MESSAGES_STORAGE_KEY, JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    socketService.connect();

    const unsubscribeMessage = socketService.onMessage((message) => {
      setMessages((prev) => {
        const exists = prev.some((m) => m.id === message.id);
        if (exists) return prev;
        return [...prev, message];
      });
    });

    const unsubscribeStatus = socketService.onStatusChange((nextStatus) => {
      setStatus(nextStatus);
    });

    return () => {
      unsubscribeMessage();
      unsubscribeStatus();
      socketService.disconnect();
    };
  }, []);

  const setUsername = useCallback((name: string) => {
    setUsernameState(name);
  }, []);

  const sendMessage = useCallback(
    (text: string) => {
      const trimmed = text.trim();
      if (!trimmed) return;

      const message: ChatMessage = {
        id: crypto.randomUUID(),
        user: effectiveUsername,
        text: trimmed,
        createdAt: Date.now(),
      };

      setMessages((prev) => [...prev, message]);
      socketService.sendMessage(message);
    },
    [effectiveUsername],
  );

  const resetChat = useCallback(() => {
    setMessages([]);
  }, []);

  const value = useMemo(
    () => ({
      messages,
      status,
      username,
      effectiveUsername,
      setUsername,
      sendMessage,
      resetChat,
    }),
    [messages, status, username, effectiveUsername, setUsername, sendMessage, resetChat],
  );

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
}

export function useChat() {
  const ctx = useContext(ChatContext);
  if (!ctx) {
    throw new Error('useChat must be used within ChatProvider');
  }
  return ctx;
}

export { SOFT_BUBBLE_COLORS };

