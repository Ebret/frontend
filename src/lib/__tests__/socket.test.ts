import {
  initializeSocket,
  getSocket,
  disconnectSocket,
  isSocketConnected
} from '../socket';

describe('Socket Module', () => {
  beforeEach(() => {
    // Reset the module between tests
    jest.resetModules();
    disconnectSocket();
  });

  it('should initialize a dummy socket with a token', () => {
    const socket = initializeSocket('test-token');
    
    // Since we're using a dummy implementation, it should return the dummy socket
    expect(socket).toBeDefined();
    expect(socket?.connected).toBe(false);
  });

  it('should return the socket when getSocket is called after initialization', () => {
    initializeSocket('test-token');
    const socket = getSocket();
    
    expect(socket).toBeDefined();
    expect(socket).toEqual(expect.objectContaining({
      on: expect.any(Function),
      emit: expect.any(Function),
      disconnect: expect.any(Function),
      removeAllListeners: expect.any(Function)
    }));
  });

  it('should return false for isSocketConnected', () => {
    // Our dummy implementation always returns false for isSocketConnected
    expect(isSocketConnected()).toBe(false);
    
    // Even after initialization
    initializeSocket('test-token');
    expect(isSocketConnected()).toBe(false);
  });

  it('should disconnect the socket', () => {
    // Initialize the socket
    initializeSocket('test-token');
    
    // Disconnect
    disconnectSocket();
    
    // isSocketConnected should still be false
    expect(isSocketConnected()).toBe(false);
  });

  it('should handle multiple initializations', () => {
    // Initialize twice
    const socket1 = initializeSocket('token1');
    const socket2 = initializeSocket('token2');
    
    // Both should return the dummy socket
    expect(socket1).toBeDefined();
    expect(socket2).toBeDefined();
    
    // getSocket should return the last initialized socket
    const socket = getSocket();
    expect(socket).toBeDefined();
  });
});
