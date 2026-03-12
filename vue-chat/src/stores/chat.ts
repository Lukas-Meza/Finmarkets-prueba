import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { io, type Socket } from 'socket.io-client';

export type ChatMessage = {
  id: string;
  user: string;
  text: string;
  createdAt: number;
};

export type ConnectionStatus = 'connected' | 'disconnected' | 'connecting';

const USERNAME_STORAGE_KEY = 'vue-chat:username';
const MESSAGES_STORAGE_KEY = 'vue-chat:messages';

const randomFallback = `User-${Math.floor(Math.random() * 1000)}`;

export const useChatStore = defineStore('chat', () => {
  const socket = ref<Socket | null>(null);
  const status = ref<ConnectionStatus>('disconnected');

  const messages = ref<ChatMessage[]>([]);
  const username = ref<string>('');

  const effectiveUsername = computed(
    () => username.value.trim() || randomFallback,
  );
  const isConnected = computed(() => status.value === 'connected');

  function loadFromStorage() {
    const storedUser = window.localStorage.getItem(USERNAME_STORAGE_KEY);
    username.value = storedUser ?? '';

    const storedMessages = window.localStorage.getItem(MESSAGES_STORAGE_KEY);
    if (storedMessages) {
      try {
        messages.value = JSON.parse(storedMessages) as ChatMessage[];
      } catch {
        messages.value = [];
      }
    }
  }

  function persist() {
    window.localStorage.setItem(USERNAME_STORAGE_KEY, username.value);
    window.localStorage.setItem(
      MESSAGES_STORAGE_KEY,
      JSON.stringify(messages.value),
    );
  }

  function connect() {
    if (socket.value) return;

    status.value = 'connecting';
    loadFromStorage();

    const s = io('http://localhost:3001', {
      autoConnect: true,
      transports: ['websocket'],
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 500,
      reconnectionDelayMax: 3000,
    });

    socket.value = s;

    s.on('connect', () => {
      status.value = 'connected';
    });

    s.on('disconnect', () => {
      status.value = 'disconnected';
    });

    s.on('connect_error', () => {
      status.value = 'disconnected';
    });

    s.on('message', (payload: ChatMessage | string) => {
      const message: ChatMessage =
        typeof payload === 'string'
          ? {
              id: crypto.randomUUID(),
              user: 'Desconocido',
              text: payload,
              createdAt: Date.now(),
            }
          : payload;

      const exists = messages.value.some((m) => m.id === message.id);
      if (!exists) {
        messages.value.push(message);
        persist();
      }
    });
  }

  function disconnect() {
    if (!socket.value) return;
    socket.value.removeAllListeners();
    socket.value.disconnect();
    socket.value = null;
    status.value = 'disconnected';
  }

  function setUsername(next: string) {
    username.value = next;
    persist();
  }

  function sendMessage(text: string) {
    const trimmed = text.trim();
    if (!trimmed || !socket.value) return;

    const message: ChatMessage = {
      id: crypto.randomUUID(),
      user: effectiveUsername.value,
      text: trimmed,
      createdAt: Date.now(),
    };

    messages.value.push(message);
    persist();
    socket.value.emit('message', message);
  }

  function resetChat() {
    messages.value = [];
    persist();
  }

  return {
    status,
    messages,
    username,
    effectiveUsername,
    isConnected,
    connect,
    disconnect,
    setUsername,
    sendMessage,
    resetChat,
  };
});

