import { io, Socket } from 'socket.io-client';

export type ChatMessage = {
  id: string;
  user: string;
  text: string;
  createdAt: number;
};

export type ConnectionStatus = 'connected' | 'disconnected' | 'connecting';

type MessageListener = (message: ChatMessage) => void;
type StatusListener = (status: ConnectionStatus) => void;

class SocketService {
  private socket: Socket | null = null;
  private messageListeners = new Set<MessageListener>();
  private statusListeners = new Set<StatusListener>();

  connect() {
    if (this.socket) {
      return;
    }

    this.updateStatus('connecting');

    const socket = io('http://localhost:3001', {
      autoConnect: true,
      transports: ['websocket'],
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 500,
      reconnectionDelayMax: 3000,
    });

    this.socket = socket;

    socket.on('connect', () => {
      this.updateStatus('connected');
    });

    socket.on('disconnect', () => {
      this.updateStatus('disconnected');
    });

    socket.on('connect_error', () => {
      this.updateStatus('disconnected');
    });

    socket.on('message', (payload: ChatMessage | string) => {
      const message: ChatMessage =
        typeof payload === 'string'
          ? {
              id: crypto.randomUUID(),
              user: 'Desconocido',
              text: payload,
              createdAt: Date.now(),
            }
          : payload;

      this.messageListeners.forEach((listener) => listener(message));
    });
  }

  disconnect() {
    if (!this.socket) return;
    this.socket.removeAllListeners();
    this.socket.disconnect();
    this.socket = null;
    this.updateStatus('disconnected');
  }

  sendMessage(message: ChatMessage) {
    if (!this.socket) return;
    this.socket.emit('message', message);
  }

  onMessage(listener: MessageListener) {
    this.messageListeners.add(listener);
    return () => this.messageListeners.delete(listener);
  }

  onStatusChange(listener: StatusListener) {
    this.statusListeners.add(listener);
    return () => this.statusListeners.delete(listener);
  }

  private updateStatus(status: ConnectionStatus) {
    this.statusListeners.forEach((listener) => listener(status));
  }
}

export const socketService = new SocketService();

