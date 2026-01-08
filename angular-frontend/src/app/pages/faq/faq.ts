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
    <div class="flex flex-col h-screen w-full bg-[#0047AB] p-12 text-white font-sans overflow-hidden">

      <h1 class="text-6xl font-light mb-16 text-center w-full">FAQ</h1>

      <div class="flex flex-1 gap-12 overflow-hidden items-start">

        <div class="flex flex-col w-1/3 pr-8 border-r border-white/30 overflow-y-auto h-full custom-scrollbar">
          <div class="flex flex-col gap-6 pt-2">

            <button *ngFor="let topic of faqData"
                    (click)="setTopic(topic.id)"
                    class="w-full py-6 px-8 rounded-full text-left transition-all"
                    [ngClass]="activeTopic === topic.id ? 'bg-white/90 text-blue-900 font-bold' : 'bg-white/40 text-white font-medium hover:bg-white/60'">
              <span class="text-xl">{{ topic.title }}</span>
            </button>

          </div>
        </div>

        <div class="flex flex-col flex-1 pl-8 overflow-y-auto h-full custom-scrollbar min-w-0">

          <ng-container *ngFor="let topic of faqData">
            <div *ngIf="activeTopic === topic.id" class="topic-section">

              <div *ngFor="let item of topic.questions"
                   class="flex flex-col py-8 border-b border-white/20 first:pt-2">

                <button (click)="toggleQuestion(item.id)"
                        class="flex justify-between items-center group w-full text-left outline-none">
                  <h3 class="text-2xl font-light tracking-wide">{{ item.question }}</h3>
                  <span class="text-4xl font-thin flex-none transition-transform duration-300"
                        [class.rotate-45]="activeQuestion === item.id">+</span>
                </button>

                <div class="overflow-hidden transition-all duration-300 ease-in-out"
                     [style.max-height]="activeQuestion === item.id ? '500px' : '0px'">
                  <div class="mt-6 text-white/70 leading-relaxed max-w-2xl pb-4"
                       [innerHTML]="item.answer">
                  </div>
                </div>

              </div>

            </div>
          </ng-container>

        </div>
      </div>
    </div>
  `,
  styles: `
      /* Hides scrollbar for Chrome, Safari and Opera */
  .custom-scrollbar::-webkit-scrollbar {
    display: none;
  }

  /* Hides scrollbar for Firefox, IE and Edge */
  .custom-scrollbar {
    -ms-overflow-style: none;  /* IE and Edge */
    scrollbar-width: none;  /* Firefox */
  }
  `
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
          answer: 'Bij de registratie kun je kiezen tussen een <strong>Student</strong>- of <strong>Kotbaas</strong>-account.'
        },
        {
          id: 2,
          question: 'Is het platform gratis te gebruiken?',
          answer: 'Het aanmaken van een account en het zoeken naar koten is gratis.'
        }
      ]
    },
    {
      id: 'student',
      title: 'Voor Studenten',
      questions: [
        {
          id: 3,
          question: 'Waarom heb ik credits nodig om te reageren?',
          answer: 'We gebruiken een creditsysteem om spam en bots tegen te gaan.'
        },
        {
          id: 4,
          question: 'Waar vind ik berichten van mijn huisbaas?',
          answer: 'In je student dashboard onder het kopje <strong>"Mededelingen"</strong>.'
        },
        {
          id: 5,
          question: 'Hoe zoek ik een kot?',
          answer: 'Gebruik de zoekbalk op de startpagina. Je kunt filteren op stad, prijs en faciliteiten.'
        }
      ]
    },
    {
      id: 'landlord',
      title: 'Voor Kotbazen',
      questions: [
        {
          id: 6,
          question: 'Hoe werkt de "Spotlight" functie?',
          answer: 'Door credits in te zetten kun je jouw pand in de <strong>Spotlight</strong> zetten.'
        },
        {
          id: 7,
          question: 'Kan ik zien of mijn huurders betaald hebben?',
          answer: 'Ja, in het beheerdashboard heb je een overzicht van al je panden.'
        },
        {
          id: 8,
          question: 'Hoe beheer ik klachten van huurders?',
          answer: 'Meldingen en klachten komen direct binnen in je dashboard.'
        }
      ]
    },
    {
      id: 'credits',
      title: 'Credits & Betalingen',
      questions: [
        {
          id: 9,
          question: 'Hoe koop ik nieuwe credits?',
          answer: 'Je kunt eenvoudig credits bijkopen via je dashboard.'
        },
        {
          id: 10,
          question: 'Vervallen mijn credits?',
          answer: 'Gekochte credits blijven onbeperkt geldig zolang je account actief is.'
        }
      ]
    }
  ];

  setTopic(topicId: string) {
    this.activeTopic = topicId;
    this.activeQuestion = null;
  }

  toggleQuestion(questionId: number) {
    this.activeQuestion = this.activeQuestion === questionId ? null : questionId;
  }
}
