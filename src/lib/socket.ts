/**
 * Dummy socket implementation
 *
 * This file completely replaces socket.io with dummy functions that do nothing.
 * This prevents any socket-related errors in the console.
 */

// Define a dummy interface that matches what our app expects
interface DummySocket {
  connected: boolean;
  on: (event: string, callback: Function) => DummySocket;
  emit: (event: string, ...args: any[]) => boolean;
  disconnect: () => void;
  removeAllListeners: () => DummySocket;
}

// Create a dummy socket object that does nothing
const dummySocket: DummySocket = {
  connected: false,
  on: (event, callback) => dummySocket,
  emit: () => false,
  disconnect: () => {},
  removeAllListeners: () => dummySocket
};

// Export dummy functions that match the original API
export const initializeSocket = (token: string): DummySocket => {
  return dummySocket;
};

export const getSocket = (): DummySocket => {
  return dummySocket;
};

export const disconnectSocket = (): void => {
  // Do nothing
};

export const isSocketConnected = (): boolean => {
  return false;
};

export default {
  initializeSocket,
  getSocket,
  disconnectSocket,
  isSocketConnected,
};
