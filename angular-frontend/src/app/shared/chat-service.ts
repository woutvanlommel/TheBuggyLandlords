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
          'X-Requested-With': 'XMLHttpRequest' // Voeg deze toe, dit helpt Laravel herkennen dat het een API request is
        },
      },
    });
  }

  /**
   * Luister naar een specifiek chatkanaal
   * @param receiverId De ID van de ingelogde gebruiker
   */
  listenToMessages(receiverId: number, callback: (data: any) => void) {
    this.echo.private(`chat.user.${receiverId}`)
      .listen('MessageSent', (e: any) => {
        console.log('Nieuw bericht ontvangen:', e.message);
        callback(e.message);
      });
  }

  /**
   * Stop met luisteren (bijv. als de component destroyed wordt)
   */
  leaveChat(receiverId: number) {
    this.echo.leave(`chat.user.${receiverId}`);
  }
}
