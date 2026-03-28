import { Injectable } from '@angular/core';
import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  private echo: Echo<any>;

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
    console.log(`🎧 Subscribing to private channel: chat.user.${receiverId}`);
    
    this.echo.private(`chat.user.${receiverId}`)
      .listen('MessageSent', (e: any) => {
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
    this.echo.leave(`chat.user.${receiverId}`);
  }
}
