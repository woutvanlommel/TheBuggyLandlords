import { Injectable } from '@angular/core';
import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  private echo: Echo<any>;
  private activeChannel: string | null = null;

  constructor() {
    // Maak Pusher globaal beschikbaar voor Laravel Echo
    (window as any).Pusher = Pusher;

    this.echo = new Echo({
      broadcaster: 'reverb',
      key: 'lwjrac6ybnptwc34bp7h',
      wsHost: '127.0.0.1',
      wsPort: 8080,
      forceTLS: false,
      enabledTransports: ['ws', 'wss'],
      // Belangrijk voor Private Channels:
      authEndpoint: 'http://localhost:8000/api/broadcasting/auth',
      auth: {
        headers: {
          'Authorization': `Bearer ${sessionStorage.getItem('auth_token')}`,
          'Accept': 'application/json',
          'X-Requested-With': 'XMLHttpRequest'
        },
      },
    });

    // Log connection status
    this.echo.connector.pusher.connection.bind('connected', () => {
      console.log('✅ WebSocket Connected!');
    });

    this.echo.connector.pusher.connection.bind('disconnected', () => {
      console.log('❌ WebSocket Disconnected');
    });

    this.echo.connector.pusher.connection.bind('error', (err: any) => {
      console.error('⚠️ WebSocket Error:', err);
    });
  }

  /**
   * Luister naar een specifiek chatkanaal
   * @param receiverId De ID van de ingelogde gebruiker
   */
  listenToMessages(receiverId: number, callback: (data: any) => void) {
    const channelName = `chat.user.${receiverId}`;
    console.log(`🎧 Subscribing to private channel: ${channelName}`);

    // Voorkom dubbele listeners wanneer het component opnieuw init.
    if (this.activeChannel === channelName) {
      this.echo.private(channelName).stopListening('.MessageSent');
    } else if (this.activeChannel) {
      this.echo.leave(this.activeChannel);
    }

    this.activeChannel = channelName;

    this.echo.private(channelName)
      .listen('.MessageSent', (e: any) => {
        console.log('📨 MessageSent event received:', e);
        callback(e.message);
      })
      .error((error: any) => {
        console.error('❌ Channel subscription error:', error);
      });
  }

  /**
   * Stop met luisteren (bijv. als de component destroyed wordt)
   */
  leaveChat(receiverId: number) {
    const channelName = `chat.user.${receiverId}`;
    this.echo.leave(channelName);
    if (this.activeChannel === channelName) {
      this.activeChannel = null;
    }
  }

  getSocketId(): string | undefined {
    return this.echo.connector.pusher.connection.socket_id;
  }
}
