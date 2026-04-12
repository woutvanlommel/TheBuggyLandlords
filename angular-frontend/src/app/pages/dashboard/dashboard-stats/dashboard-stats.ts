import { Component, OnInit, ChangeDetectorRef, ViewChild, ElementRef, AfterViewChecked, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms'; // CRUCIAAL voor ngModel
import { HttpClient } from '@angular/common/http';
import { BuildingDashboard } from '../../../components/building-dashboard/building-dashboard';
import { VerhuurderService } from '../../../shared/verhuurder.service';
import { CreditService } from '../../../shared/credit.service';
import { ChatService } from '../../../shared/chat-service';


@Component({
  selector: 'app-dashboard-stats',
  imports: [CommonModule, BuildingDashboard, RouterModule, FormsModule],
  standalone: true,
  template: ` <section class="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">

      <!-- Total Credits Card -->
      <article
        class="group bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 relative overflow-hidden"
      >
        <div class="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-24 h-24 text-primary">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
        </div>

        <div class="relative z-10 flex flex-col h-full justify-between">
            <div>
              <p class="text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">Beschikbare Credits</p>
              <div class="flex items-baseline gap-2">
                <span class="text-4xl font-extrabold text-primary-900">{{ totalCredits }}</span>
                <span class="text-sm text-gray-400 font-medium">credits</span>
              </div>
            </div>

            <div class="mt-6">
              <a
                routerLink="../credits"
                class="inline-flex items-center gap-1 text-sm font-semibold text-accent hover:text-accent-600 transition-colors group-hover:gap-2"
              >
                Opwaarderen <span class="transition-all">&rarr;</span>
              </a>
            </div>
        </div>
      </article>

      <!-- Active Spotlights Card -->
      <article
        *ngIf="isLandlord"
        class="group bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 relative overflow-hidden"
      >
        <div class="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-24 h-24 text-secondary">
              <path stroke-linecap="round" stroke-linejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
            </svg>
        </div>

        <div class="relative z-10">
            <p class="text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">Actieve Spotlights</p>
            <div class="flex items-center justify-between mb-4">
              <span class="text-4xl font-extrabold text-gray-900">{{ activeSpotlights }}</span>
              <span class="px-2.5 py-1 text-xs font-bold rounded-lg bg-secondary-50 text-secondary-700 border border-secondary-100">
                Live
              </span>
            </div>

            <div class="w-full h-1.5 rounded-full bg-gray-100 overflow-hidden">
              <span
                class="block h-full rounded-full bg-secondary-500 transition-all duration-1000 ease-out"
                [style.width.%]="spotlightPercentage"
              ></span>
            </div>
        </div>
      </article>

      <!-- Views Card (Placeholder) -->
      <article
        class="group bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
      >
        <p class="text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">Totaal Views</p>
        <div class="flex items-center justify-between mb-4">
          <span class="text-4xl font-extrabold text-gray-300">--</span>
          <span class="px-2.5 py-1 text-xs font-bold rounded-lg bg-gray-50 text-gray-400 border border-gray-100">
            +0%
          </span>
        </div>
        <!-- Simple Sparkline SVG -->
        <div class="h-10 w-full opacity-30 group-hover:opacity-50 transition-opacity">
            <svg viewBox="0 0 100 30" preserveAspectRatio="none" class="w-full h-full stroke-gray-400 fill-none stroke-2">
                <path d="M0 25 Q 10 20, 20 22 T 40 15 T 60 20 T 80 5 T 100 15" vector-effect="non-scaling-stroke" />
            </svg>
        </div>
      </article>

      <!-- Usage Card (Placeholder) -->
      <article
        class="group bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
      >
        <p class="text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">Gebruik</p>
        <div class="flex items-center justify-between mb-4">
          <span class="text-4xl font-extrabold text-gray-300">--</span>
        </div>
        <div class="w-full h-1.5 rounded-full bg-gray-100 overflow-hidden">
          <span
            class="block h-full rounded-full bg-gray-300"
            style="width: 0%"
          ></span>
        </div>
      </article>
    </section>

    <section class="grid grid-cols-12 gap-6 relative">
      <article class="col-span-12 lg:col-span-8 bg-white rounded-2xl p-6 shadow-sm border border-gray-100 min-h-[400px]">
        <app-building-dashboard></app-building-dashboard>
      </article>

      <div class="col-span-12 lg:col-span-4 flex flex-col gap-4">

        <article class="bg-base-een-100/50 backdrop-blur-sm border border-primary-100/50 rounded-2xl p-5 shadow-xl flex flex-col min-h-[450px]">
          <div class="mb-3">
            <p class="text-xs font-semibold tracking-wide text-primary-600">Communicatie</p>
            <h3 class="mt-1 text-lg font-semibold text-base-twee-900">
              {{ selectedUser ? 'Chat met ' + selectedUser.name : 'Selecteer een gesprek' }}
            </h3>
          </div>

          <div class="flex-1 overflow-y-auto mb-4 space-y-2 max-h-[250px] pr-2" #chatScroll>
            <div *ngFor="let msg of messages"
                [ngClass]="{'text-right': msg.sender_id === myId}">
              <span [ngClass]="msg.sender_id === myId ? 'bg-primary text-white' : 'bg-base-twee-200 text-base-twee-900'"
                    class="inline-block px-3 py-2 rounded-2xl text-sm max-w-[80%] break-words">
                {{ msg.content }}
              </span>
            </div>
            <p *ngIf="messages.length === 0" class="text-center text-xs text-base-twee-400 mt-10">
              Geen berichten gevonden.
            </p>
          </div>

          <div class="space-y-3 mt-auto border-t border-primary-50 pt-4">

            <div *ngIf="isLandlord" class="mb-2">
              <label class="block text-[10px] font-bold text-primary-600 uppercase mb-1 ml-1">Stuur naar:</label>
              <select
                [(ngModel)]="selectedTenantId"
                class="w-full px-3 py-2 rounded-xl bg-white border border-primary-100 text-xs focus:outline-none focus:ring-2 focus:ring-primary-400 shadow-sm appearance-none cursor-pointer"
              >
                <option value="all" class="font-bold text-secondary-600">📢 Alle actieve huurders (Mededeling)</option>
                <option disabled>──────────</option>
                <option *ngFor="let tenant of allTenants" [value]="tenant.id">
                  👤 {{ tenant.fname }} {{ tenant.name }}
                </option>
              </select>
            </div>

            <textarea
              [(ngModel)]="newMessageText"
              (keyup.enter)="sendMessage()"
              [disabled]="!selectedUser && selectedTenantId === ''"
              placeholder="Typ hier je bericht..."
              rows="2"
              class="w-full px-4 py-2 rounded-xl bg-base-een-100/50 border border-base-twee-300/50 focus:outline-none focus:ring-2 focus:ring-primary-400 placeholder:text-base-twee-400 text-sm disabled:opacity-50"
            ></textarea>

            <button
              (click)="sendMessage()"
              [disabled]="(!selectedUser && selectedTenantId === '') || !newMessageText"
              class="w-full py-2 rounded-xl bg-primary text-white font-semibold shadow hover:bg-primary-600 transition-colors disabled:bg-gray-400"
            >
              Verstuur
            </button>
          </div>
        </article>

        <article class="bg-base-een-100/50 backdrop-blur-sm border border-primary-100/50 rounded-2xl p-5 shadow-xl">
          <div class="flex items-center justify-between gap-3 mb-3">
            <h3 class="text-sm font-semibold text-base-twee-900">Actieve Gesprekken</h3>
          </div>
          <ul class="flex flex-col gap-2 max-h-[200px] overflow-y-auto">
            <li *ngFor="let chat of conversations"
                (click)="selectConversation(chat.user)"
                [ngClass]="{'border-primary-400 bg-primary/5 shadow-inner': selectedUser?.id === chat.user.id}"
                class="flex items-center gap-3 bg-white/40 p-3 rounded-xl border border-transparent hover:border-primary-200 cursor-pointer transition-all">
              <div class="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-bold text-xs">
                {{ chat.user.name.charAt(0) }}
              </div>
              <div class="flex-1 min-w-0">
                <p class="text-sm font-medium text-base-twee-900 truncate">{{ chat.user.name }}</p>
                <p class="text-xs text-base-twee-500 truncate">{{ chat.last_message?.content }}</p>
              </div>
              <span *ngIf="chat.last_message && !chat.last_message.is_read && chat.last_message.sender_id !== myId"
                class="w-2 h-2 rounded-full bg-secondary-500">
              </span>
            </li>
          </ul>
        </article>

      </div>
    </section>`,
})
export class DashboardStats implements OnInit, AfterViewChecked, OnDestroy {
  @ViewChild('chatScroll') private chatContainer!: ElementRef;

  // Bestaande stats variabelen
  totalCredits: number = 0;
  activeSpotlights: number = 0;
  totalRooms: number = 0;
  spotlightPercentage: number = 0;
  isLandlord: boolean = false;

  // NIEUW: Chat variabelen
  myId: number = 0;
  conversations: any[] = [];
  messages: any[] = [];
  selectedUser: any = null;
  newMessageText: string = '';
  allTenants: any[] = [];
  selectedTenantId: string = 'all';

  constructor(
    private creditService: CreditService,
    private verhuurderService: VerhuurderService,
    private chatService: ChatService,
    private http: HttpClient,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    // 1. Haal eigen ID op (bijv. uit sessie of auth service)
    const userData = JSON.parse(sessionStorage.getItem('user_data') || '{}');
    this.myId = Number(sessionStorage.getItem('user_id'));

    const role = sessionStorage.getItem('user_role');
    this.isLandlord = !!role && role.toLowerCase() === 'verhuurder';

    this.creditService.refreshBalance();
    this.creditService.balance$.subscribe((b) => {
      this.totalCredits = b;
      this.cdr.markForCheck();
    });

    // Load appropriate data based on role
    if (this.isLandlord) {
      this.loadStats();
      this.loadMyTenants();
    } else {
      // For renters: load their landlord automatically
      this.loadMyLandlord();
    }
    
    // Both roles load conversations
    this.loadConversations();

    // 2. Start WebSocket luisteraar
    this.chatService.listenToMessages(this.myId, (newMessage: any) => {
      this.handleIncomingMessage(newMessage);
    });
  }

  // Zorg dat de chat altijd onderaan staat bij nieuwe berichten
  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  async loadConversations() {
      const headers = {
        'Authorization': `Bearer ${sessionStorage.getItem('auth_token')}`,
  };
    // Endpoint die je in Laravel maakt om de inbox op te halen
    this.http.get<any[]>('http://localhost:8000/api/conversations', {headers}).subscribe(data => {
      this.conversations = data;
      this.cdr.detectChanges();
    });
  }

  selectConversation(user: any) {
    this.selectedUser = user;

    // Zorg dat de dropdown mee verspringt naar de persoon die je aanklikt
    if (this.isLandlord) {
      this.selectedTenantId = user.id.toString();
    }

    const headers = { 'Authorization': `Bearer ${sessionStorage.getItem('auth_token')}` };
    this.http.get<any[]>(`http://localhost:8000/api/messages/${user.id}`, { headers })
      .subscribe(data => {
        this.messages = data;
        this.cdr.detectChanges();
      });
  }

  sendMessage() {
    if (!this.newMessageText.trim()) return;

    let receiverId: any = null;

    if (this.isLandlord) {
      // Als verhuurder: de dropdown (selectedTenantId) is de baas!
      // Als die op 'all' staat of een specifiek ID, gebruik die.
      receiverId = this.selectedTenantId;

      // Fallback: als er niets in de dropdown staat maar wel een chat open is
      if (!receiverId && this.selectedUser) {
        receiverId = this.selectedUser.id;
      }
    } else {
      // Als huurder: stuur gewoon naar de geopende chat (landlord)
      receiverId = this.selectedUser?.id;
      
      // If no conversation selected, this shouldn't happen as we auto-select landlord
      // But just in case, show a helpful message
      if (!receiverId) {
        alert("Geen gesprek geselecteerd. Probeer de pagina opnieuw te laden.");
        return;
      }
    }

    if (!receiverId) {
      alert("Selecteer eerst een ontvanger of een gesprek.");
      return;
    }

    // CRITICAL FIX: Convert to number if not 'all'
    if (receiverId !== 'all') {
      receiverId = Number(receiverId);
    }

    const headers: any = { 'Authorization': `Bearer ${sessionStorage.getItem('auth_token')}` };
    const socketId = this.chatService.getSocketId();
    if (socketId) {
      headers['X-Socket-Id'] = socketId;
    }
    const payload = {
      receiver_id: receiverId,
      content: this.newMessageText
    };

    this.http.post('http://localhost:8000/api/messages', payload, { headers })
      .subscribe({
        next: (res: any) => {
          // UI bijwerken: alleen voor "all"; individuele chats komen realtime via Echo.
          if (receiverId === 'all') {
            alert('Mededeling succesvol verzonden naar alle huurders!');
          } else if (this.selectedUser && Number(res.receiver_id) === Number(this.selectedUser.id)) {
            this.messages.push(res);
            this.updateInboxWithLatestMessage(res);
          }

          this.newMessageText = '';
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error("Versturen mislukt", err);
        }
      });
  }

  handleIncomingMessage(msg: any) {
    console.log('📨 WebSocket message received:', msg);
    console.log('Current selected user:', this.selectedUser?.id);
    console.log('Message sender:', msg.sender_id);
    
    // Als het bericht van de persoon is die we nu open hebben: toevoegen aan de chat
    if (this.selectedUser && msg.sender_id === this.selectedUser.id) {
      console.log('✅ Adding to current chat');
      this.messages.push(msg);
    } else {
      console.log('⚠️ Message from different user - updating inbox only');
    }
    
    // Update sowieso de preview in de inbox lijst
    this.updateInboxWithLatestMessage(msg);
    
    // Force UI update
    this.cdr.detectChanges();
    
    console.log('📊 Messages array now has', this.messages.length, 'items');
  }

  ngOnDestroy() {
    if (this.myId) {
      this.chatService.leaveChat(this.myId);
    }
  }

  updateInboxWithLatestMessage(msg: any) {
    const chatPartnerId = msg.sender_id === this.myId ? msg.receiver_id : msg.sender_id;
    const chatIndex = this.conversations.findIndex(c => c.user.id === chatPartnerId);

    if (chatIndex !== -1) {
      this.conversations[chatIndex].last_message = msg;
    } else {
      // Optioneel: herlaad conversaties als het een nieuwe persoon is
      this.loadConversations();
    }
  }

  scrollToBottom(): void {
    try {
      this.chatContainer.nativeElement.scrollTop = this.chatContainer.nativeElement.scrollHeight;
    } catch (err) {}
  }

  async loadStats() {
    try {
      const buildings = await this.verhuurderService.getMyBuildings();
      let activeCount = 0;
      let roomCount = 0;

      buildings.forEach((b: any) => {
        if (b.rooms) {
          b.rooms.forEach((r: any) => {
            roomCount++;
            // Use the 'is_highlighted' flag directly as requested (1 = active)
            if (r.is_highlighted) {
              activeCount++;
            }
          });
        }
      });

      this.activeSpotlights = activeCount;
      this.totalRooms = roomCount;
      // Calculate percentage for the bar (cap at 100%)
      this.spotlightPercentage = roomCount > 0 ? Math.min((activeCount / roomCount) * 100, 100) : 0;

      this.cdr.detectChanges(); // Force update after stats calculation
    } catch (e) {
      console.error('Failed to load stats', e);
    }
  }

  loadMyTenants() {
    const headers = { 'Authorization': `Bearer ${sessionStorage.getItem('auth_token')}` };
    this.http.get<any[]>('http://localhost:8000/api/my-tenants', { headers }).subscribe(data => {
      this.allTenants = data;
    });
  }

  loadMyLandlord() {
    const headers = { 'Authorization': `Bearer ${sessionStorage.getItem('auth_token')}` };
    this.http.get<any>('http://localhost:8000/api/my-landlord', { headers }).subscribe({
      next: (landlord) => {
        // Automatically select the landlord as the conversation partner
        this.selectedUser = landlord;
        // Load messages with landlord
        this.selectConversation(landlord);
      },
      error: (err) => {
        console.error('Could not load landlord', err);
      }
    });
  }
}


