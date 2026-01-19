import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

// 1. Define Interfaces
interface FaqQuestion {
  id: number;
  question: string;
  answer: string;
}

interface FaqTopic {
  id: string;
  title: string;
  questions: FaqQuestion[];
}

@Component({
  selector: 'app-faq',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="min-h-screen w-full bg-base-een-100 font-sans pb-20 pt-10">
      
      <!-- Header Section -->
      <div class="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12 text-center">
         <h1 class="text-4xl md:text-5xl font-bold text-primary-900 tracking-tight mb-4">
            Veelgestelde <span class="text-accent">Vragen</span>
         </h1>
         <p class="text-lg text-base-twee-600 max-w-2xl mx-auto">
            Heb je een vraag? Hier vind je antwoorden op de meest voorkomende vragen over KotCompass.
         </p>
      </div>

      <div class="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex flex-col lg:flex-row gap-8">
          
          <!-- Sidebar (Topics) -->
          <div class="w-full lg:w-1/4 shrink-0">
            <div class="bg-white rounded-2xl shadow-sm border border-gray-200 p-2 sticky top-24">
              <div class="flex flex-col gap-1">
                <button
                  *ngFor="let topic of faqData"
                  (click)="setTopic(topic.id)"
                  class="w-full text-left px-4 py-3 rounded-xl transition-all duration-200 font-semibold flex items-center justify-between group"
                  [ngClass]="activeTopic === topic.id 
                    ? 'bg-primary-50 text-primary-700 shadow-sm' 
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'"
                >
                  <span>{{ topic.title }}</span>
                  <svg *ngIf="activeTopic === topic.id" class="w-4 h-4 rotate-90" viewBox="0 0 16 19" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                    <path d="M7 18C7 18.5523 7.44772 19 8 19C8.55228 19 9 18.5523 9 18H7ZM8.70711 0.292893C8.31658 -0.0976311 7.68342 -0.0976311 7.29289 0.292893L0.928932 6.65685C0.538408 7.04738 0.538408 7.68054 0.928932 8.07107C1.31946 8.46159 1.95262 8.46159 2.34315 8.07107L8 2.41421L13.6569 8.07107C14.0474 8.46159 14.6805 8.46159 15.0711 8.07107C15.4616 7.68054 15.4616 7.04738 15.0711 6.65685L8.70711 0.292893ZM9 18L9 1H7L7 18H9Z"></path>
                  </svg>
                </button>
              </div>
            </div>
          </div>

          <!-- Main Content (Questions) -->
          <div class="w-full lg:w-3/4">
             <ng-container *ngFor="let topic of faqData">
                <div *ngIf="activeTopic === topic.id" class="space-y-4 animate-fade-in">
                   <div *ngFor="let item of topic.questions" class="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden transition-all duration-300 hover:shadow-md">
                      <button 
                        (click)="toggleQuestion(item.id)"
                        class="w-full px-6 py-5 flex items-center justify-between text-left focus:outline-none"
                      >
                        <span class="text-lg font-bold text-primary-900 pr-8">{{ item.question }}</span>
                        <span 
                          class="shrink-0 w-8 h-8 rounded-full bg-base-een-100 flex items-center justify-center text-primary-600 transition-transform duration-300"
                          [class.rotate-180]="activeQuestion !== item.id"
                        >
                           <svg class="w-4 h-4" viewBox="0 0 16 19" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                              <path d="M7 18C7 18.5523 7.44772 19 8 19C8.55228 19 9 18.5523 9 18H7ZM8.70711 0.292893C8.31658 -0.0976311 7.68342 -0.0976311 7.29289 0.292893L0.928932 6.65685C0.538408 7.04738 0.538408 7.68054 0.928932 8.07107C1.31946 8.46159 1.95262 8.46159 2.34315 8.07107L8 2.41421L13.6569 8.07107C14.0474 8.46159 14.6805 8.46159 15.0711 8.07107C15.4616 7.68054 15.4616 7.04738 15.0711 6.65685L8.70711 0.292893ZM9 18L9 1H7L7 18H9Z"></path>
                           </svg>
                        </span>
                      </button>
                      
                      <div 
                        class="overflow-hidden transition-all duration-300 ease-in-out bg-gray-50/50 border-gray-200"
                        [style.max-height]="activeQuestion === item.id ? '500px' : '0px'"
                        [class.border-t]="activeQuestion === item.id"
                      >
                        <div class="px-6 py-5 text-base-twee-700 leading-relaxed" [innerHTML]="item.answer"></div>
                      </div>
                   </div>
                </div>
             </ng-container>
          </div>

        </div>
      </div>
    </div>
  `,
  styles: [`
    @keyframes fade-in {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .animate-fade-in {
      animation: fade-in 0.3s ease-out forwards;
    }
  `],
})
export class Faq {
  activeTopic: string = 'algemeen';
  activeQuestion: number | null = null;

  faqData: FaqTopic[] = [
    {
      id: 'algemeen',
      title: 'Algemeen',
      questions: [
        {
          id: 1,
          question: 'Hoe maak ik een account aan?',
          answer:
            'Bij de registratie kun je kiezen tussen een <strong>Student</strong>- of <strong>Kotbaas</strong>-account.',
        },
        {
          id: 2,
          question: 'Is het platform gratis te gebruiken?',
          answer: 'Het aanmaken van een account en het zoeken naar koten is gratis.',
        },
      ],
    },
    {
      id: 'student',
      title: 'Voor Studenten',
      questions: [
        {
          id: 3,
          question: 'Waarom heb ik credits nodig om te reageren?',
          answer: 'We gebruiken een creditsysteem om spam en bots tegen te gaan.',
        },
        {
          id: 4,
          question: 'Waar vind ik berichten van mijn huisbaas?',
          answer: 'In je student dashboard onder het kopje <strong>"Mededelingen"</strong>.',
        },
        {
          id: 5,
          question: 'Hoe zoek ik een kot?',
          answer:
            'Gebruik de zoekbalk op de startpagina. Je kunt filteren op stad, prijs en faciliteiten.',
        },
      ],
    },
    {
      id: 'landlord',
      title: 'Voor Kotbazen',
      questions: [
        {
          id: 6,
          question: 'Hoe werkt de "Spotlight" functie?',
          answer:
            'Door credits in te zetten kun je jouw pand in de <strong>Spotlight</strong> zetten.',
        },
        {
          id: 7,
          question: 'Kan ik zien of mijn huurders betaald hebben?',
          answer: 'Ja, in het beheerdashboard heb je een overzicht van al je panden.',
        },
        {
          id: 8,
          question: 'Hoe beheer ik klachten van huurders?',
          answer: 'Meldingen en klachten komen direct binnen in je dashboard.',
        },
      ],
    },
    {
      id: 'credits',
      title: 'Credits & Betalingen',
      questions: [
        {
          id: 9,
          question: 'Hoe koop ik nieuwe credits?',
          answer: 'Je kunt eenvoudig credits bijkopen via je dashboard.',
        },
        {
          id: 10,
          question: 'Vervallen mijn credits?',
          answer: 'Gekochte credits blijven onbeperkt geldig zolang je account actief is.',
        },
      ],
    },
  ];

  setTopic(topicId: string) {
    this.activeTopic = topicId;
    this.activeQuestion = null;
  }

  toggleQuestion(questionId: number) {
    this.activeQuestion = this.activeQuestion === questionId ? null : questionId;
  }
}
